import zlib
import base64
import json

BASEURL = 'file:///C:/Users/Matt/Documents/GitHub/crossworder/main.html?code='
DATA = [{"dir": "A",
         "num": 1,
         "start": [0, 0],
         "word": "test",
         "clue": "The answer is 'test'"},
        {"dir": "D",
         "num": 1,
         "start": [0, 0],
         "word": "tree",
         "clue": "Green with leaves"},
        {"dir": "A",
         "num": 2,
         "start": [5, 0],
         "word": "chell",
         "clue": "Test subject in portal"},
        {"dir": "D",
         "num": 2,
         "start": [5, 0],
         "word": "cheese",
         "clue": "Delicious yellow substance"},
        {"dir": "A",
         "num": 3,
         "start": [0, 3],
         "word": "eviscerate",
         "clue": "To thoroughly destory something"},
        ]


def convert():
    a = json.dumps(DATA).encode('utf-8')
    b = zlib.compress(a)
    c = base64.b64encode(b)
    m = c.decode('utf-8').replace('/', '%2F').replace('+', '%2B').replace('=', '%3D')
    print(BASEURL + m)


if __name__ == "__main__":
    convert()
