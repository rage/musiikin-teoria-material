const C = 0,
  D = 1,
  E = 2,
  F = 3,
  G = 4,
  A = 5,
  B = 6

const letters = ["C", "D", "E", "F", "G", "A", "B"]

// grouped by pitch
const notes = [
  ["C", "^B", "__D"],
  ["_D", "^C", "^^B"],
  ["D", "^^C", "__E"],
  ["_E", "^D", "__F"],
  ["E", "_F", "^^D"],
  ["F", "^E", "__G"],
  ["_G", "^F", "^^E"],
  ["G", "^^F", "__A"],
  ["_A", "^G"],
  ["A", "^^G", "__B"],
  ["_B", "^A", "__C"],
  ["B", "_C", "^^A"],
]

class Accidental {
  constructor(symbol, notation) {
    this.symbol = symbol
    this.notation = notation
  }
}

const DOUBLE_FLAT = 0,
  FLAT = 1,
  NATURAL_SIGN = 2,
  NATURAL = 3,
  SHARP = 4,
  DOUBLE_SHARP = 5

const accidentals = [
  new Accidental("bb", "__"),
  new Accidental("b", "_"),
  new Accidental("", "="),
  new Accidental("", ""),
  new Accidental("#", "^"),
  new Accidental("x", "^^"),
]

class Root {
  constructor(pitch, letter, accidental) {
    this.pitch = pitch
    this.letter = letter
    this.accidental = accidentals[accidental]
    if (letter === 6)
      this.label =
        pitch === 9
          ? "Bbb"
          : pitch === 10
          ? "Bb"
          : pitch === 11
          ? "H"
          : pitch === 0
          ? "H#"
          : "Hx"
    else this.label = letters[letter] + this.accidental.symbol
    this.notation = this.accidental.notation + letters[letter]
  }
}

// available roots (doesn't include all theoretically possible roots)
export const roots = [
  new Root(0, C, NATURAL), // C
  new Root(1, C, SHARP), // C#
  new Root(1, D, FLAT), // Db
  new Root(2, D, NATURAL), // D
  new Root(3, D, SHARP), // D#
  new Root(3, E, FLAT), // Eb
  new Root(4, E, NATURAL), // E
  new Root(5, F, NATURAL), // F
  new Root(6, F, SHARP), // F#
  new Root(6, G, FLAT), // Gb
  new Root(7, G, NATURAL), // G
  new Root(8, G, SHARP), // G#
  new Root(8, A, FLAT), // Ab
  new Root(9, A, NATURAL), // A
  new Root(10, A, SHARP), // A#
  new Root(10, B, FLAT), // Bb or B
  new Root(11, B, NATURAL), // B or H
]

// defaults are major and perfect intervals
const pitchJumps = [0, 2, 4, 5, 7, 9, 11]

const UNISON = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
  SIXTH = 6,
  SEVENTH = 7

const DIMINISHED = "dim",
  MINOR = "min",
  MAJOR = "maj",
  PERFECT = "perf",
  AUGMENTED = "aug"

/*
  doesn't error check for nonexisting intervals
  (like perfect third or minor fourth)
  for now only 1 -> 7 intervals are supported
*/
export const interval = (root, quality, number) => {
  const letterJump = number - 1
  const letter = letters[(root.letter + letterJump) % letters.length]
  const smallLetter = root.letter + letterJump >= letters.length

  let pitchJump = pitchJumps[letterJump]
  switch (quality) {
    case MINOR:
      pitchJump -= 1
      break
    case DIMINISHED:
      pitchJump -=
        number === UNISON || number === FOURTH || number === FIFTH ? 1 : 2
      break
    case AUGMENTED:
      pitchJump += 1
  }

  for (const note of notes[(root.pitch + pitchJump) % notes.length])
    if (note.includes(letter)) return smallLetter ? note.toLowerCase() : note
}

class Chord {
  constructor(label, intervals) {
    this.label = label
    this.intervals = intervals
  }

  notation(root) {
    return (
      "L:1/1\n[" +
      root.notation +
      this.intervals.map(i => interval(root, ...i)).join("") +
      "]"
    )
  }
}

export const triads = [
  new Chord("Vähennetty", [[MINOR, THIRD], [DIMINISHED, FIFTH]]),
  new Chord("Molli", [[MINOR, THIRD], [PERFECT, FIFTH]]),
  new Chord("Duuri", [[MAJOR, THIRD], [PERFECT, FIFTH]]),
  new Chord("Ylinouseva", [[MAJOR, THIRD], [AUGMENTED, FIFTH]]),
]
