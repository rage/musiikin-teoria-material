import React from "react"
import {
  roots as notationRoots,
  answerOptionsForRoots as answerRoots,
} from "../../util/music/roots"
import { triads as answerTriads } from "../../util/music/chords"
import { randomIntArray } from "../../util/random"
import {
  UNISON,
  interval,
  concatenateNotation,
} from "../../util/music/intervals"
import { PERFECT } from "../../util/music/qualities"

// Answer Keys
const ROOT = "root",
  TRIAD = "triad"

/**
 * Private method, generate a number of correct answers.
 * @param {*} howMany How many exercises to generate
 * @returns [{root: 5, triad: 4, notation: "<abc notation>"}]
 */
const generateCorrectAnswers = (howMany, withInversions) => {
  const correctRoots = randomIntArray(0, notationRoots.length, howMany)
  const correctTriads = randomIntArray(0, answerTriads.length, howMany)
  const inversions = withInversions
    ? randomIntArray(0, answerTriads[0].intervals.length + 1, howMany)
    : new Array(howMany).fill(0)

  return correctRoots.map((root, i) => {
    const triad = correctTriads[i]
    return {
      root: root,
      pitch: notationRoots[root].pitch, // Generated answers have pitch
      triad: triad,
      notation: answerTriads[triad].notation(
        notationRoots[root],
        inversions[i],
      ),
    }
  })
}

export default class Chord {
  constructor(withInversions) {
    this.withInversions = withInversions
  }

  generateExerciseSet(howMany) {
    const exerciseSet = {
      answerKeys: [ROOT, TRIAD],
      answerOptions: {
        root: answerRoots,
        triad: answerTriads,
      },
      answerLabels: {
        root: "Pohjasävel",
        triad: "Laatu",
      },
      exercises: generateCorrectAnswers(howMany, this.withInversions),
    }

    return exerciseSet
  }

  /**
   * Get answerKeys that were same in both answer and correctAnswer.
   * @param {*} answer {root: 5, triad: 3}
   * @param {*} correctAnswer {root: 5, triad: 2}
   * @returns ["root"]
   */
  getCorrectAnswerKeys(answer, correctAnswer) {
    if (
      !answer ||
      typeof answer.root !== "number" ||
      typeof answer.triad !== "number" ||
      !correctAnswer
    )
      return []

    const correctAnswerKeys = []

    const answerPitch = answer.pitch
      ? answer.pitch // Generated answers have pitch
      : answerRoots[answer.root].pitch
    const correctAnswerPitch = correctAnswer.pitch
      ? correctAnswer.pitch // Generated answers have pitch
      : answerRoots[correctAnswer.root].pitch

    if (answerPitch === correctAnswerPitch) correctAnswerKeys.push(ROOT)
    if (answer.triad === correctAnswer.triad) correctAnswerKeys.push(TRIAD)

    return correctAnswerKeys
  }

  /**
   * Get user readable string of the answer.
   * @param {*} answer {root: 0, triad: 0}
   * @returns "C major"
   */
  readableAnswerString(answer) {
    const answerRoot = answer.pitch // Generated answers have pitch
      ? notationRoots[answer.root]
      : answerRoots[answer.root]
    const answerTriad = answerTriads[answer.triad]

    return answerTriad.asReadableString(answerRoot)
  }

  getInstructionString() {
    return "soinnun pohjasävel ja laatu"
  }

  makeAnswerPayload(answer, correctAnswer, correct) {
    const answerPitchLabel = answer.pitch // Generated answers have pitch
      ? notationRoots[answer.root].label
      : answerRoots[answer.root].label
    const answerTriadLabel = answerTriads[answer.triad].label.toLowerCase()

    const correctAnswerPitchLabel = correctAnswer.pitch // Generated answers have pitch
      ? notationRoots[correctAnswer.root].label
      : answerRoots[correctAnswer.root].label
    const correctAnswerTriadLabel = answerTriads[
      correctAnswer.triad
    ].label.toLowerCase()

    return {
      type: "chord",
      answer: {
        root: answerPitchLabel,
        triad: answerTriadLabel,
      },
      correctAnswer: {
        root: correctAnswerPitchLabel,
        triad: correctAnswerTriadLabel,
      },
      correct,
    }
  }

  makePianoAnswerPayload(
    answerNotes,
    correctAnswerNotes,
    correctAnswerString,
    correct,
  ) {
    return {
      type: "piano chord",
      answer: {
        midiNumber: answerNotes.map(note => note.midiNumber),
        pitch: answerNotes.map(note => note.pitch),
      },
      correctAnswer: {
        string: correctAnswerString,
        pitch: correctAnswerNotes.map(n => n.pitch),
      },
      correct,
    }
  }

  /**
   * Check if the answer is correct for a Piano exercise.
   * @param {*} pianoAnswerNotes Notes the student has pressed on piano
   * @param {*} correctAnswer Correct answer (from generateCorrectAnswers)
   */
  isPianoAnswerCorrect = (pianoAnswerNotes, correctAnswer) => {
    const answerNotes = pianoAnswerNotes.map(n => n.pitch)
    const correctAnswerNotes = this.getAnswerAsNotes(correctAnswer)
    if (answerNotes.length === correctAnswerNotes.length) {
      return correctAnswerNotes.every(note => answerNotes.includes(note.pitch))
    }
    return false
  }

  /**
   * Should the next note be added.
   * @param {*} note Note given by piano
   * @param {*} notes already added notes
   */
  shouldAddNote = (note, notes) => {
    return (
      notes.length < this.getNoteLimits().max &&
      !notes.map(n => n.notation).includes(note.notation)
    )
  }

  /**
   * Turn correct answer into an array of notes
   * @param {*} correctAnswer Correct answer (from generateCorrectAnswers)
   */
  getAnswerAsNotes(correctAnswer) {
    return [
      [PERFECT, UNISON],
      ...answerTriads[correctAnswer.triad].intervals,
    ].map(i => interval(notationRoots[correctAnswer.root], ...i))
  }

  /**
   * Form abc notation from the notes given by piano.
   * @param {*} notes notes given by piano
   */
  getNotesAsNotation(notes) {
    return "L:1/1\n[" + concatenateNotation(notes.map(n => n.notation)) + "]"
  }

  getPianoInstructions = correctAnswer => {
    const asString = this.readableAnswerString(correctAnswer)
    return (
      <>
        Muodosta pianon avulla <b>{asString}</b> kolmisointuna
      </>
    )
  }

  /**
   * Get engraverParams for MusicSheet to display this exercise kind.
   */
  getEngraverParams() {
    return {
      add_classes: false,
      editable: false,
      listener: null,
      paddingbottom: 1,
      paddingleft: 262,
      paddingright: 278,
      paddingtop: 15,
      scale: 2,
      staffwidth: 224,
      responsive: undefined,
    }
  }

  /**
   * Returns the minimum and maximum notes allowed on the score;
   * min and max are both inclusive.
   */
  getNoteLimits() {
    return { min: 3, max: Number.MAX_SAFE_INTEGER }
  }
}
