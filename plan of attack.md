# CROSSWORDER

A website, hosted completely statically.
No server required to do any js calls or host any of the crosswords. All crosswords are created based on the url provided.

Data structure (likely to change):

A string in the form:
A;                  [direction (A | D)]
                    {for each clue:}
    #N:             [clue number]
    (X,Y):          [starting grid location (from top left at 0,0)]
    (L[,L2,...]):   [Length(s) of word]
    lorem ipsum|    [The clue itself]

Each 'Word' will be an object like:
{
    dir: (A | D)    :: The direciton to bin the clue in.
    num: #N         :: The clue number.
    start: (X, Y)   :: The co-ordinate on the grid of the starting location
    word: word      :: The word which is the solution. For ones which go over multiple clues let's just do the word in that clue for now...
    clue: clue      :: The clue.
}



This will form a long string. This string will then be compressed using something like zlib to get some bytes, and then this will be encoded to base 64. This should give about a 20x compression ratio, allowing for pretty big crosswords.

The board:

I think that the board that is created by the SMH online crossword is pretty good tbh.

Potential objects:

1. Board - An object for the entire board
2. Word - An object for each word
3. Square - An object for each individual square

Each object is contained by the one above

Modes:

There are 2 modes:

1. Create mode.
2. Solve mode.

Each mode needs certain functions:

## Create mode:

1. Ability to select a square and set it as the starting location (set whether it is A or D)
2. Ability to save the crossword
3. Ability to fill in the empty squares black

## Solve mode:

1. Check word/letter/whole puzzle
2. Reveal whole puzzle
3. Reset puzzle