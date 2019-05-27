import { randomInt } from "./random"

// Magic numbers that index the letters below
const C = 0,
  D = 1,
  E = 2,
  F = 3,
  G = 4,
  A = 5,
  B = 6

// Represents the position of the note on the staff (nuottiviivasto)
const letters = ["C", "D", "E", "F", "G", "A", "B"]

// Represents notes in abc notation,
// Grouped by pitch (elements in same row produce same sound)
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

/**
 * symbol: String shown in answer choices
 * notation: String used in abc notation to produce the accidental
 */
class Accidental {
  constructor(symbol, notation) {
    this.symbol = symbol
    this.notation = notation
  }
}

// Magic numbers that index the accidentals below.
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

/**
 * pitch: index for 'notes' that match the wanted sound of this Root note
 * letter: index for 'letters' of this Root note
 * accidental: index for 'accidentals' of this Root note
 */
class Root {
  constructor(pitch, letter, accidental) {
    this.pitch = pitch
    this.letter = letter
    this.accidental = accidentals[accidental]

    // Determines label, label is shown in answer choices
    if (letter === B)
      // Custom label for B
      this.label =
        pitch === 9
          ? "Bbb" // The number matches the name inside "", so 9 = "Bbb"
          : pitch === 10
          ? "Bb"
          : pitch === 11
          ? "H"
          : pitch === 0
          ? "H#"
          : "Hx"
    else this.label = letters[letter] + this.accidental.symbol

    // abc requires accidental before letter
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
  new Root(10, B, FLAT), // Bb
  new Root(11, B, NATURAL), // B or H
]

/**
 * Takes as argument a String in abc notation and returns a String in abc
 * notation corresponding to the input notation raised an octave higher.
 * Please note that the input notation must not contain any header.
 *
 * For example:
 *    raiseOctave("_B, g'^F") returns "_B g''^f"
 *
 * @param {*} input A String in abc notation
 */
const raiseOctave = input => {
  let output = ""
  for (let i = 0; i < input.length; i++) {
    if (input.charAt(i).match(/[A-G]/)) {
      if (input.charAt(i + 1) && input.charAt(i + 1) === ",") {
        output += input.charAt(i++)
      } else {
        output += input.charAt(i).toLowerCase()
      }
    } else if (input.charAt(i).match(/[a-g]/)) {
      output += input.charAt(i) + "'"
    } else {
      output += input.charAt(i)
    }
  }
  return output
}

// pitchJumps assume PERFECT and MAJOR quality
const pitchJumps = [0, 2, 4, 5, 7, 9, 11]

// Numbers
const UNISON = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
  SIXTH = 6,
  SEVENTH = 7,
  OCTAVE = 8

// Qualities
const DIMINISHED = "dim",
  MINOR = "min",
  MAJOR = "maj",
  PERFECT = "perf",
  AUGMENTED = "aug"

class Quality {
  constructor(label, name) {
    this.label = label
    this.name = name
  }
}

export const qualities = [
  new Quality("Vähennetty", DIMINISHED),
  new Quality("Pieni", MINOR),
  new Quality("Suuri", MAJOR),
  new Quality("Puhdas", PERFECT),
  new Quality("Ylinouseva", AUGMENTED),
]

/**
 * Returns String corresponding to abc notation for adding an interval symbol
 * on top of root.
 *
 * For example:
 *    root = roots[0] // C
 *    interval(root, MAJOR, THIRD)
 *    returns "E"
 *
 * @param {*} root Root note for the interval
 * @param {*} quality What quality the interval should have
 * @param {*} number Number corresponding to the name of the interval, 3 for third
 */
export const interval = (root, quality, number) => {
  // When the interval is an octave or bigger (compound interval), first make
  // the simple interval (less than an octave), later raise it one octave
  let compound = false
  if (number > SEVENTH) {
    number -= letters.length
    compound = true
  }

  // How many letters the letter jumps to go to
  const letterJump = number - 1

  const letter = letters[(root.letter + letterJump) % letters.length]
  // abc notation uses lowercase for the higher octave, i.e. the 5th octave in
  // scientific pitch notation
  const lowercaseLetter = root.letter + letterJump >= letters.length

  // How many semitones the pitch jumps
  let pitchJump = pitchJumps[letterJump]

  // Default pitchJumps assume PERFECT and MAJOR quality
  // So we need to modify the pitch jump based on the quality
  switch (quality) {
    case MINOR:
      pitchJump -= 1
      break
    case DIMINISHED:
      // UNISON, FOURTH, FIFTH assume PERFECT quality,
      // so the jump needs to be reduced by 1
      // Rest assume MAJOR, so the jump needs to be reduced by 2
      pitchJump -=
        number === UNISON || number === FOURTH || number === FIFTH ? 1 : 2
      break
    case AUGMENTED:
      pitchJump += 1
  }

  /*
  doesn't error check for nonexisting intervals
  (like perfect third or minor fourth)
  for now only 1 -> 14 intervals are supported
  */
  let notation = ""
  for (const note of notes[
    (root.pitch + pitchJump + notes.length) % notes.length
  ])
    if (note.includes(letter))
      notation = lowercaseLetter ? note.toLowerCase() : note

  return compound ? raiseOctave(notation) : notation
}

const concatenate = (root, intervals) =>
  intervals.map(i => interval(root, ...i)).join("")

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

export const createRandomInterval = () => {
  const quality = qualities[randomInt(0, qualities.length)]
  const possibleNumbers = numbersForQualities[quality.name]
  const number = possibleNumbers[randomInt(0, possibleNumbers.length)]

  return new Interval(quality, number)
}

class Interval {
  constructor(quality, number) {
    this.quality = quality
    this.label = intervalLabels[number - 1]
    this.number = number
  }

  notation(root) {
    return (
      "L:1/1\n[" +
      root.notation +
      interval(root, this.quality.name, this.number) +
      "]"
    )
  }
}

export const intervalLabels = [
  "Priimi",
  "Sekunti",
  "Terssi",
  "Kvartti",
  "Kvintti",
  "Seksti",
  "Septimi",
  "Oktaavi",
]

/*
  The following intervals have been removed, since they cannot be written for
  some of the available roots in the roots array:
  diminished second, diminished third, diminished sixth, augmented third,
  augmented sixth augmented seventh
*/
export const numbersForQualities = {
  dim: [UNISON, FOURTH, FIFTH, SEVENTH, OCTAVE],
  min: [SECOND, THIRD, SIXTH, SEVENTH],
  maj: [SECOND, THIRD, SIXTH, SEVENTH],
  perf: [UNISON, FOURTH, FIFTH, OCTAVE],
  aug: [UNISON, SECOND, FOURTH, FIFTH, OCTAVE],
}

/**
 * symmetric: true if ascending and descending scales contain the same intervals
 * in which case parameter intervals should contain only ascending intervals
 */
class Scale {
  constructor(label, intervals, symmetric) {
    this.label = label
    this.intervals = intervals
    this.symmetric = symmetric
  }

  notation(root) {
    return (
      root.notation +
      concatenate(
        root,
        this.symmetric
          ? this.intervals
          : this.intervals.slice(0, this.intervals.length / 2),
      ) +
      raiseOctave(root.notation) +
      concatenate(
        root,
        this.symmetric
          ? this.intervals.reverse()
          : this.intervals.slice(this.intervals.length / 2),
      ) +
      root.notation
    )
  }
}

export const scales = [
  new Scale(
    "Duuri",
    [
      [MAJOR, SECOND],
      [MAJOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MAJOR, SIXTH],
      [MAJOR, SEVENTH],
    ],
    true,
  ),
  new Scale(
    "Luonnollinen molli",
    [
      [MAJOR, SECOND],
      [MINOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MINOR, SIXTH],
      [MINOR, SEVENTH],
    ],
    true,
  ),
  new Scale(
    "Harmoninen molli",
    [
      [MAJOR, SECOND],
      [MINOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MINOR, SIXTH],
      [MAJOR, SEVENTH],
    ],
    true,
  ),
  new Scale(
    "Melodinen molli",
    [
      [MAJOR, SECOND],
      [MINOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MAJOR, SIXTH],
      [MAJOR, SEVENTH],
      [MINOR, SEVENTH],
      [MINOR, SIXTH],
      [PERFECT, FIFTH],
      [PERFECT, FOURTH],
      [MINOR, THIRD],
      [MAJOR, SECOND],
    ],
    false,
  ),
]
