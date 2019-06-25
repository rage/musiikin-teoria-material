import {
  accidentals,
  DOUBLE_FLAT,
  FLAT,
  NATURAL_SIGN,
  NATURAL,
  SHARP,
  DOUBLE_SHARP,
} from "./accidentals"

/**
 * pitch: index for 'notes' that match the wanted sound of this Root note
 * letter: index for 'letters' of this Root note
 * accidental: index for 'accidentals' of this Root note
 */
class Root {
  constructor(pitch, letter, accidental, label) {
    this.pitch = pitch
    this.letter = letter
    this.accidental = accidentals[accidental]
    this.label = label

    // abc requires accidental before letter
    this.notation = this.accidental.notation + letters[letter]
  }
}

// Magic numbers that index the letters below
// { C, D, E, F, G, A, B }
export const C = 0,
  D = 1,
  E = 2,
  F = 3,
  G = 4,
  A = 5,
  B = 6

// Represents the position of the note on the staff (nuottiviivasto)
export const letters = ["C", "D", "E", "F", "G", "A", "B"]

// Represents notes in abc notation,
// Grouped by pitch (elements in same row produce same sound)
export const notes = [
  ["C", "^B,", "__D"],
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
  ["B", "_c", "^^A"],
]

// Indexes for roots below
export const ROOTS = {
  C: 0,
  C_SHARP: 1,
  D_FLAT: 2,
  D: 3,
  D_SHARP: 4,
  E_FLAT: 5,
  E: 6,
  F: 7,
  F_SHARP: 8,
  G_FLAT: 9,
  G: 10,
  G_SHARP: 11,
  A_FLAT: 12,
  A: 13,
  A_SHARP: 14,
  B_FLAT: 15,
  B: 16,
}

// available roots (doesn't include all theoretically possible roots)
export const roots = [
  new Root(0, C, NATURAL, "C"), // C
  new Root(1, C, SHARP, "C#"), // C#
  new Root(1, D, FLAT, "Db"), // Db
  new Root(2, D, NATURAL, "D"), // D
  new Root(3, D, SHARP, "D#"), // D#
  new Root(3, E, FLAT, "Eb"), // Eb
  new Root(4, E, NATURAL, "E"), // E
  new Root(5, F, NATURAL, "F"), // F
  new Root(6, F, SHARP, "F#"), // F#
  new Root(6, G, FLAT, "Gb"), // Gb
  new Root(7, G, NATURAL, "G"), // G
  new Root(8, G, SHARP, "G#"), // G#
  new Root(8, A, FLAT, "Ab"), // Ab
  new Root(9, A, NATURAL, "A"), // A
  new Root(10, A, SHARP, "A#"), // A#
  new Root(10, B, FLAT, "Bb"), // Bb
  new Root(11, B, NATURAL, "H"), // B or H
]

// answer options for roots (notes with same pitch together)
export const answerOptionsForRoots = [
  new Root(0, C, NATURAL, "C"), // C
  new Root(1, C, SHARP, "C#/Db"), // C#
  new Root(2, D, NATURAL, "D"), // D
  new Root(3, D, SHARP, "D#/Eb"), // D#
  new Root(4, E, NATURAL, "E"), // E
  new Root(5, F, NATURAL, "F"), // F
  new Root(6, F, SHARP, "F#/Gb"), // F#
  new Root(7, G, NATURAL, "G"), // G
  new Root(8, G, SHARP, "G#/Ab"), // G#
  new Root(9, A, NATURAL, "A"), // A
  new Root(10, A, SHARP, "A#/Bb"), // A#
  new Root(11, B, NATURAL, "H"), // B or H
]
