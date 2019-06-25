import {
  qualities,
  DIMINISHED,
  MINOR,
  MAJOR,
  PERFECT,
  AUGMENTED,
} from "./qualities"
import { letters, notes } from "./roots"

import { randomInt } from "../random"

class Interval {
  constructor(quality, number) {
    this.quality = quality
    this.label = intervalLabels[number - 1]
    this.number = number
  }

  notation(root) {
    return (
      "L:1/1\n[" +
      concatenateIntervals(root, [
        [PERFECT, UNISON],
        [this.quality.name, this.number],
      ]) +
      "]"
    )
  }
}

// Numbers
// { UNISON, SECOND, THIRD, FOURTH, FIFTH, SIXTH, SEVENTH, OCTAVE }
export const UNISON = 1,
  SECOND = 2,
  THIRD = 3,
  FOURTH = 4,
  FIFTH = 5,
  SIXTH = 6,
  SEVENTH = 7,
  OCTAVE = 8

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
  The following intervals have been removed:
  (since they cannot be written for some of the available roots in the roots array)
    diminished second,
    diminished third,
    diminished sixth,
    augmented third,
    augmented sixth,
    augmented seventh
*/
export const intervalsForQualities = {
  dim: [UNISON, FOURTH, FIFTH, SEVENTH, OCTAVE],
  min: [SECOND, THIRD, SIXTH, SEVENTH],
  maj: [SECOND, THIRD, SIXTH, SEVENTH],
  perf: [UNISON, FOURTH, FIFTH, OCTAVE],
  aug: [UNISON, SECOND, FOURTH, FIFTH, OCTAVE],
}

const makeAllIntervals = () => {
  const all = []
  qualities.forEach(quality =>
    intervalsForQualities[quality.name].forEach(number => {
      all.push(new Interval(quality, number))
    }),
  )
  return all
}

export const availableIntervals = makeAllIntervals()

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
export const raiseOctave = input => {
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

/**
 * Returns an object with:
 * "notation": a String corresponding to abc notation for adding an interval on
 *             top of the given root;
 * "pitch": the corresponding pitch, from 0 to 11.
 *
 * For example:
 *    root = roots[0] // C
 *    interval(root, MAJOR, THIRD)
 *    returns { notation: "E", pitch: 4 }
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
  const pitch = (root.pitch + pitchJump + notes.length) % notes.length
  for (const note of notes[pitch])
    if (note.includes(letter))
      notation = lowercaseLetter ? note.toLowerCase() : note

  if (compound) {
    notation = raiseOctave(notation)
    pitchJump += notes.length
  }

  const midiNumber = pitch - pitchJump >= 0 ? pitch + 60 : pitch + 72

  return { notation, pitch, pitchJump, midiNumber }
}

/**
 * Returns String corresponding to abc notation for all the notes specified in
 * intervals, built on top of the given root. If the note being added is not accidental,
 * and previously the same not was added as accidental, a natural symbol is added
 * to the note.
 *
 * For example:
 *    root = roots[0] // C
 *    concatenate(root, [[MAJOR, THIRD], [PERFECT, FOURTH], [MINOR, SIXTH]])
 *      returns "EF_A"
 *
 * @param {*} root Root note from which the intervals will be built
 * @param {*} intervals Desired notes, expressed as intervals from the root
 */
export const concatenateIntervals = (root, intervals) =>
  concatenateNotes(intervals.map(i => interval(root, ...i).notation))

export const concatenateNotes = notes => {
  const prevAccidentals = new Set([])
  return notes
    .map(note => {
      if (!isAccidental(note)) {
        note = addNaturalIfNeeded(note, prevAccidentals)
      } else {
        //Remove the accidental sign(s) from the beginning
        const noteLetter = note.charAt(note.length - 1)
        prevAccidentals.add(noteLetter)
      }
      return note
    })
    .join("")
}

const isAccidental = note => {
  if (note.includes("_") || note.includes("^")) {
    return true
  }
  return false
}

const addNaturalIfNeeded = (note, prevAccidentals) => {
  if (prevAccidentals.has(note)) {
    prevAccidentals.delete(note)
    note = "=" + note
  }
  return note
}
