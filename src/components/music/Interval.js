import React from "react"
import { roots as notationRoots } from "../../util/music/roots"
import {
  intervalLabels,
  availableIntervals,
  concatenateNotes,
} from "../../util/music/intervals"
import { qualities } from "../../util/music/qualities"

import { randomIntArray } from "../../util/random"

// Answer Keys
const INTERVAL = "interval",
  QUALITY = "quality"

/**
 * Private method, generate a number of correct answers.
 * @param {*} howMany How many exercises to generate
 * @returns [{interval: 5, quality: 4, notation: "<abc notation>"}]
 */
const generateCorrectAnswers = howMany => {
  const correctRoots = randomIntArray(0, notationRoots.length, howMany)
  const correctIntervals = randomIntArray(0, availableIntervals.length, howMany)

  return correctRoots.map((correctRoot, index) => {
    const interval = availableIntervals[correctIntervals[index]]
    const correctInterval = interval.number - 1 // Number is one higher than index
    const correctQuality = qualities.indexOf(interval.quality)

    const notation = interval.notation(notationRoots[correctRoot])

    return {
      interval: correctInterval,
      quality: correctQuality,
      notation,
    }
  })
}

export default class Interval {
  generateExerciseSet(howMany) {
    const exerciseSet = {
      answerKeys: [INTERVAL, QUALITY],
      answerOptions: {
        interval: intervalLabels.map(label => {
          return { label: label }
        }),
        quality: qualities,
      },
      answerLabels: {
        interval: "Intervalli",
        quality: "Laatu",
      },
      exercises: generateCorrectAnswers(howMany),
    }

    return exerciseSet
  }

  /**
   * Get answerKeys that were same in both answer and correctAnswer.
   * @param {*} answer {interval: 5, quality: 3}
   * @param {*} correctAnswer {interval: 5, quality: 2}
   * @returns ["interval"]
   */
  getCorrectAnswerKeys(answer, correctAnswer) {
    if (
      !answer ||
      typeof answer.interval !== "number" ||
      typeof answer.quality !== "number" ||
      !correctAnswer
    )
      return []

    const correctAnswerKeys = []

    if (answer.interval === correctAnswer.interval)
      correctAnswerKeys.push(INTERVAL)
    if (answer.quality === correctAnswer.quality)
      correctAnswerKeys.push(QUALITY)

    return correctAnswerKeys
  }

  /**
   * Get user readable string of the answer.
   * @param {*} answer {interval: 0, quality: 0}
   * @returns "perfekti Kvintti"
   */
  readableAnswerString(answer) {
    return (
      qualities[answer.quality].label.toLowerCase() +
      " " +
      intervalLabels[answer.interval]
    )
  }

  getInstructionString() {
    return "intervalli ja laatu"
  }

  makeAnswerPayload(answer, correctAnswer, correct) {
    const answerQualityLabel = qualities[answer.quality].label.toLowerCase()
    const answerIntervalLabel = intervalLabels[answer.interval].toLowerCase()

    const correctAnswerQualityLabel = qualities[
      correctAnswer.quality
    ].label.toLowerCase()
    const correctAnswerIntervalLabel = intervalLabels[
      correctAnswer.interval
    ].toLowerCase()

    return {
      type: "interval",
      answer: {
        quality: answerQualityLabel,
        interval: answerIntervalLabel,
      },
      correctAnswer: {
        quality: correctAnswerQualityLabel,
        interval: correctAnswerIntervalLabel,
      },
      correct,
    }
  }

  makePianoAnswerPayload(
    answerNotes,
    correctAnswerPitches,
    correctAnswerString,
    correct,
  ) {
    return {
      type: "piano interval",
      answer: {
        midiNumber: answerNotes.map(note => note.midiNumber),
        pitch: answerNotes.map(note => note.pitch),
      },
      correctAnswer: {
        string: correctAnswerString,
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
    if (pianoAnswerNotes.length > 2) return false

    // Number is one higher than index
    const correctInterval = correctAnswer.interval + 1

    const firstNote = pianoAnswerNotes[0].midiNumber
    const secondNote = pianoAnswerNotes[1].midiNumber
    const interval = secondNote - firstNote

    // TODO Fix answer check, correctAnswer has index for intervalLabels..
    console.log("correct", correctInterval, "was", interval)

    return interval === correctInterval
  }

  /**
   * Should the next note be added.
   * @param {*} note Note given by piano
   * @param {*} notes already added notes
   */
  shouldAddNote = (note, notes) => {
    return (
      notes.length < this.getNoteLimits().max &&
      notes.filter(n => n.notation === note.notation).length < 2
    )
  }

  /**
   * Turn correct answer into an array of notes
   * @param {*} correctAnswer Correct answer (from generateCorrectAnswers)
   */
  getAnswerAsNotes(correctAnswer) {
    return [correctAnswer.pitch]
  }

  /**
   * Form abc notation from the notes given by piano.
   * @param {*} notes notes given by piano
   */
  getNotesAsNotation(notes) {
    return "L:1/1\n[" + concatenateNotes(notes.map(n => n.notation)) + "]"
  }

  getPianoInstructions = correctAnswer => {
    const asString = this.readableAnswerString(correctAnswer)
    return (
      <>
        Muodosta pianon avulla <b>{asString}</b> kahtena nuottina
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
      responsivewidth: 750,
    }
  }

  /**
   * Returns the minimum and maximum notes allowed on the score;
   * min and max are both inclusive.
   */
  getNoteLimits() {
    return { min: 2, max: Number.MAX_SAFE_INTEGER }
  }
}
