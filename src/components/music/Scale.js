import React from "react"
import {
  roots as notationRoots,
  answerOptionsForRoots as answerRoots,
} from "../../util/music/roots"
import { modes, scales } from "../../util/music/scales"
import { concatenateNotation, interval } from "../../util/music/intervals"
import { PERFECT } from "../../util/music/qualities"
import { UNISON, OCTAVE } from "../../util/music/intervals"
import { randomIntArray } from "../../util/random"

// Answer Keys
const ROOT = "root",
  SCALE = "scale"

export default class Scale {
  constructor(useModes) {
    this.scales = useModes === "modes" ? modes : scales
    this.usedMode = useModes
  }

  /**
   * Private method, generate a number of correct answers.
   * @param {*} howMany How many exercises to generate
   * @returns [{root: 5, scale: 4, notation: "<abc notation>"}]
   */
  generateCorrectAnswers = howMany => {
    const correctRoots = randomIntArray(0, notationRoots.length, howMany)
    const correctScales = randomIntArray(0, this.scales.length, howMany)

    return correctRoots.map((root, i) => {
      const correctScale = correctScales[i]
      const notation = this.scales[correctScale].notation(notationRoots[root])
      return {
        root: root,
        pitch: notationRoots[root].pitch, // Generated answers have pitch
        scale: correctScale,
        notation: notation,
      }
    })
  }

  generateExerciseSet = howMany => {
    const exerciseSet = {
      answerKeys: [ROOT, SCALE],
      answerOptions: {
        root: answerRoots,
        scale: this.scales,
      },
      answerLabels: {
        root: "Pohjasävel",
        scale: "Laatu",
      },
      exercises: this.generateCorrectAnswers(howMany),
    }

    return exerciseSet
  }

  /**
   * Get answerKeys that were same in both answer and correctAnswer.
   * @param {*} answer {root: 5, scale: 3}
   * @param {*} correctAnswer {root: 5, scale: 2}
   * @returns ["root"]
   */
  getCorrectAnswerKeys = (answer, correctAnswer) => {
    if (
      !answer ||
      typeof answer.root !== "number" ||
      typeof answer.scale !== "number" ||
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
    if (answer.scale === correctAnswer.scale) correctAnswerKeys.push(SCALE)

    return correctAnswerKeys
  }

  /**
   * Get user readable string of the answer.
   * @param {*} answer {root: 0, scale: 0}
   * @returns "C major"
   */
  readableAnswerString = answer => {
    const answerRoot = answer.pitch // Generated answers have pitch
      ? notationRoots[answer.root]
      : answerRoots[answer.root]
    const answerChord = this.scales[answer.scale]

    return answerChord.asReadableString(answerRoot)
  }

  getInstructionString = () => "asteikon pohjasävel ja laatu"

  makeAnswerPayload = (answer, correctAnswer, correct) => {
    const answerPitchLabel = answer.pitch // Generated answers have pitch
      ? notationRoots[answer.root].label
      : answerRoots[answer.root].label
    const answerScaleLabel = this.scales[answer.scale].label.toLowerCase()

    const correctAnswerPitchLabel = correctAnswer.pitch // Generated answers have pitch
      ? notationRoots[correctAnswer.root].label
      : answerRoots[correctAnswer.root].label
    const correctAnswerScaleLabel = this.scales[
      correctAnswer.scale
    ].label.toLowerCase()

    return {
      type: this.usedMode,
      answer: {
        root: answerPitchLabel,
        scale: answerScaleLabel,
      },
      correctAnswer: {
        root: correctAnswerPitchLabel,
        scale: correctAnswerScaleLabel,
      },
      correct,
    }
  }

  makePianoAnswerPayload = (
    answerNotes,
    correctAnswerNotes,
    correctAnswerString,
    correct,
  ) => {
    return {
      type: "piano " + this.usedMode,
      answer: {
        midiNumber: answerNotes.map(note => note.midiNumber),
        pitch: answerNotes.map(note => note.pitch),
      },
      correctAnswer: {
        string: correctAnswerString,
        pitch: correctAnswerNotes.map(note => note.pitch),
        pitchJump: correctAnswerNotes.map(note => note.pitchJump),
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
    const correctAnswerNotes = this.getAnswerAsNotes(correctAnswer)
    // accepted even if the root isn't repeated one octave higher at the end
    if (
      pianoAnswerNotes[0].pitch === correctAnswer.pitch &&
      pianoAnswerNotes.length <= correctAnswerNotes.length
    ) {
      for (let i = 1; i < pianoAnswerNotes.length; i++) {
        if (
          pianoAnswerNotes[i].midiNumber - pianoAnswerNotes[0].midiNumber !==
          correctAnswerNotes[i].pitchJump
        ) {
          return false
        }
      }
      return true
    }
    return false
  }

  /**
   * Turn correct answer into an array of notes with
   * @param {*} correctAnswer Correct answer (from generateCorrectAnswers)
   */
  getAnswerAsNotes = correctAnswer => {
    // the first empty object is the root, which we don't need
    return [
      [PERFECT, UNISON],
      ...this.scales[correctAnswer.scale].intervals,
      [PERFECT, OCTAVE],
    ].map(i => interval(notationRoots[correctAnswer.root], ...i))
  }

  /**
   * Should the next note be added.
   * @param {*} note Note given by piano
   * @param {*} notes already added notes
   */
  shouldAddNote = (note, notes) => {
    return notes.length < this.getNoteLimits().max
  }

  /**
   * Form abc notation from the notes given by piano.
   * @param {*} notes notes given by piano
   */
  getNotesAsNotation = notes => {
    return "L:1/4\n" + concatenateNotation(notes.map(n => n.notation))
  }

  getPianoInstructions = correctAnswer => {
    const asString = this.readableAnswerString(correctAnswer)
    return (
      <>
        Muodosta pianon avulla <b>{asString}</b> nousevana asteikkona
      </>
    )
  }

  /**
   * Get engraverParams for MusicSheet to display this exercise kind.
   */
  getEngraverParams = () => {
    return {
      add_classes: false,
      editable: false,
      listener: null,
      paddingbottom: 1,
      paddingleft: 15,
      paddingright: 15,
      paddingtop: 15,
      scale: 1, // scale is now only being placeholder for build to succeed in server side. It does not affect rendering, due to resize being set to true in responsive.
      staffwidth: 450,
      responsive: "resize",
    }
  }

  /**
   * Returns the minimum and maximum notes allowed on the score;
   * min and max are both inclusive.
   */
  getNoteLimits = () => {
    return { min: 7, max: 8 }
  }
}
