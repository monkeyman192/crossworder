function b64zipToData(str) {
    // Convert base-64 encoded zlib compressed data to the original data
    let s = atob(str);

    var data = new Array(s.length);
    for (i = 0, il = s.length; i < il; ++i) {
        data[i] = s.charCodeAt(i);
    }

    var inflate = new Zlib.Inflate(data);
    var decompress = inflate.decompress();
    return new TextDecoder("utf-8").decode(decompress);
}

class Crossword {
    constructor(width, height, data) {
        this.width = width;
        this.height = height;
        this.data = JSON.parse(data);
        this.words = [];
        // Initialise the words:
        for (let word_data of this.data) {
            this.add_word(word_data);
        }

        this.draw_clue_numbers();
        this.disabled_unneeded();
    }

    add_word(word_data) {
        let word = new Word(word_data['word'],
                            word_data['dir'],
                            word_data['num'],
                            word_data['start'],
                            word_data['clue']);
        this.words.push(word);
    }

    draw_clue_numbers() {
        for (let word of this.words) {
            let coord = word.coord;
            let axis = (word.dir == 'A') ? 0 : 1;
            let cell = document.getElementById(`${coord[0]},${coord[1]}`);
            cell.classList.add("enabled");
            if (!cell.classList.contains("numbered")) {
                cell.innerHTML += `<div class='cluenum'>${word.num}.</div>`
                cell.classList.add("numbered");
            }
            for (i = 0; i < word.length; i++) {
                cell = document.getElementById(`${coord[0]},${coord[1]}`);
                cell.classList.add("enabled");
                coord[axis] += 1
            }
        }
    }

    disabled_unneeded() {
        // Set all the un-needed cells as disabled
        let cell = null;
        for (x = 0; x < this.width; x ++) {
            for (y = 0; y < this.height; y++) {
                cell = document.getElementById(`${x},${y}`)
                if (!cell.classList.contains("enabled")) {
                    cell.classList.add("disabled");
                }
            }
        }
    }

    set_letter_value(value, id) {
        // Set the value of a letter at some location
    }

    verify() {
        // Verify each of the underlying words.
        let valid = true;
        for (let word of this.words) {
            valid &= word.verify();
        }
        return valid;
    }
}

class Word {
    constructor(word, dir, num, coord, clue) {
        this.word = word;
        this.dir = dir;
        this.num = num;
        this.coord = coord;
        this.clue = clue;
        this.letters = []
        for (let chr of this.word) {
            this.letters.push(new Letter(chr));
        }
        console.log(`Added the word ${this.word} @ ${this.coord}`)
    }
    get length() {
        return this.word.length;
    }
    verify() {
        // Verify each of the underlying letters
        let valid = true;
        for (let letter of this.letters) {
            valid &= letter.verify();
        }
        return valid;
    }
}

class Letter {
    constructor(letter) {
        this.letter = letter;
        this.entered_letter = '';
    }
    verify() {
        // Return whether or not this letter is correct.
        return this.letter == this.entered_letter;
    }
    actual() {
        // Return the actual value of this letter
        return this.letter;
    }
}

let boxDim = 50;
let dummyData = {A: {}}

let crossword = null;

function drawGrid(rows, columns, data) {
    let table = document.getElementById("cword");

    let prevSelected = ["-1", "-1"];
    let currSelected = ["-1", "-1"];

    for (y = 0; y < rows; y++) {
        row = table.insertRow(y);
        for (x = 0; x < columns; x++) {
            cell = row.insertCell(x);
            cell.id = `${x},${y}`;
            //cell.innerHTML = `<div class='entryfield' id='${x},${y}_entry'></div>`
            cell.addEventListener("click", handleCellClick);
        }
    }

    // Add the crossword data
    crossword = new Crossword(columns, rows, data);

    window.addEventListener("keyup", keyUpHandler, true);

    function keyUpHandler(event) {
        // first, get the selected cell
        let cells = document.getElementsByClassName("selected");
        let keyCode = event.keyCode;
        // Letters between A - Z
        if (keyCode > 64 && keyCode < 91) {
            for (let c of cells) {
                let inner = c.innerHTML;
                if (inner && inner.length === 0) {
                    c.innerHTML += String.fromCharCode(keyCode);
                } else if (inner && inner.slice(-1) === '>') {
                    console.log("blah");
                } else {
                    c.innerHTML = String.fromCharCode(keyCode);
                }
                
            }
        // Esc key
        } else if (keyCode === 27) {
            for (let c of cells) {
                toggleBlackCell(c.id);
            }
        // backspace key or space key
        } else if (keyCode === 8 || keyCode === 32) {
            for (let c of cells) {
                c.innerText = '';
            }
        /* Direction keys:
        37: left
        38: up
        39: right
        40: down
        */
        } else if (keyCode === 37) {
        }
        else {
            console.log(keyCode);
        }
    }

    // TODO: move the handling of highlighting and un-highlighting a cell into its own
    // function so it can be called from other places based on just the x,y coords.

    function handleCellClick(event) {
        let cellID = event.target.id;
        let [x, y] = cellID.split(',');
        if ((currSelected[0] !== x) || (currSelected[1] !== y)) {
            let newCell = document.getElementById(`${x},${y}`);
            if (!newCell.classList.contains("disabled")) {
                prevSelected = currSelected;
                currSelected = [x, y];
                if (prevSelected.every(x => x !== "-1")) {
                    clearPrevCell(`${prevSelected[0]},${prevSelected[1]}`);
                }
                highlightCurrCell(`${currSelected[0]},${currSelected[1]}`);
            }
        }
        else {
            // set the current cell as not being selected
            // TODO: do this...
        }
    }

    function highlightCurrCell(id) {
        let cell = document.getElementById(id);
        cell.classList.add("selected");
    }

    function clearPrevCell(id) {
        // Clear the highlighting of previous cell
        let cell = document.getElementById(id);
        cell.classList.remove("selected");
    }

    function toggleBlackCell(id) {
        let cell = document.getElementById(id);
        if (cell.classList.contains("disabled")) {
            cell.classList.remove("disabled");
        } else {
            cell.classList.add("disabled");
        }
    }

}

function verify() {
    console.log(crossword.verify());
}