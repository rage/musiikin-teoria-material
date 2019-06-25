import React from "react"
import { roots as notationRoots } from "../../util/music/roots"
import {
  UNISON,
  interval,
  intervalLabels,
  availableIntervals,
  simpleIntervals,
  concatenateNotes,
} from "../../util/music/intervals"
import {
  PERFECT,
  allQualities,
  simpleQualities,
} from "../../util/music/qualities"

import { randomIntArray } from "../../util/random"

// Answer Keys
const INTERVAL = "interval",
  QUALITY = "quality"

/**
 * Private method, generate a number of correct answers.
 * @param {*} howMany How many exercises to generate
 * @returns [{interval: 5, quality: 4, notation: "<abc notation>"}]
 */
const generateCorrectAnswers = (howMany, intervals, qualities) => {
  const correctRoots = randomIntArray(0, notationRoots.length, howMany)
  const correctIntervals = randomIntArray(0, intervals.length, howMany)

  return correctRoots.map((correctRoot, index) => {
    const interval = intervals[correctIntervals[index]]
    const correctInterval = interval.number - 1 // Number is one higher than index
    const correctQuality = qualities.indexOf(interval.quality)

    const notation = interval.notation(notationRoots[correctRoot])

    return {
      root: correctRoot, // Generated answers have root
      interval: correctInterval,
      quality: correctQuality,
      notation,
    }
  })
}

export default class Interval {
  constructor(useSimple) {
    this.qualities = useSimple === "simple" ? simpleQualities : allQualities
    this.intervals =
      useSimple === "simple" ? simpleIntervals : availableIntervals
    this.usedSimple = useSimple
  }

  generateExerciseSet(howMany) {
    const exerciseSet = {
      answerKeys: [INTERVAL, QUALITY],
      answerOptions: {
        interval: intervalLabels.map(label => {
          return { label: label }
        }),
        quality: this.qualities,
      },
      answerLabels: {
        interval: "Intervalli",
        quality: "Laatu",
      },
      exercises: generateCorrectAnswers(
        howMany,
        this.intervals,
        this.qualities,
      ),
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
   * @returns "puhdas kvintti"
   */
  readableAnswerString(answer) {
    return (
      // Generated answers have root
      (typeof answer.root === "number"
        ? notationRoots[answer.root].label + " "
        : "") +
      this.qualities[answer.quality].label.toLowerCase() +
      " " +
      intervalLabels[answer.interval].toLowerCase()
    )
  }

  getInstructionString() {
    return "intervalli ja laatu"
  }

  makeAnswerPayload(answer, correctAnswer, correct) {
    const answerQualityLabel = this.qualities[
      answer.quality
    ].label.toLowerCase()
    const answerIntervalLabel = intervalLabels[answer.interval].toLowerCase()

    const correctAnswerQualityLabel = this.qualities[
      correctAnswer.quality
    ].label.toLowerCase()
    const correctAnswerIntervalLabel = intervalLabels[
      correctAnswer.interval
    ].toLowerCase()

    return {
      type: "interval " + this.usedSimple,
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
    correctAnswerNotes,
    correctAnswerString,
    correct,
  ) {
    return {
      type: "piano interval " + this.usedSimple,
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
    if (pianoAnswerNotes.length !== 2) return false

    const enteredPitchJump = Math.abs(
      pianoAnswerNotes[1].midiNumber - pianoAnswerNotes[0].midiNumber,
    )

    // Get correct information from the generated answer
    const correctNotes = this.getAnswerAsNotes(correctAnswer)
    const correctPitches = correctNotes.map(n => n.pitch)

    for (const note of pianoAnswerNotes)
      if (!correctPitches.includes(note.pitch)) return false

    return enteredPitchJump === Math.abs(correctNotes[1].pitchJump)
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
    const correctRoot = notationRoots[correctAnswer.root]
    const quality = this.qualities[correctAnswer.quality].name
    const number = correctAnswer.interval + 1 // Number is one higher than index
    return [[PERFECT, UNISON], [quality, number]].map(i =>
      interval(correctRoot, ...i),
    )
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
    const slicePoint = asString.indexOf(" ")
    const root = asString.slice(0, slicePoint)
    const interval = asString.slice(slicePoint, asString.length)
    return (
      <>
        Muodosta pianon avulla <b>{interval}</b>, jonka pohjasävel on{" "}
        <b>{root}</b>
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
    return { min: 2, max: Number.MAX_SAFE_INTEGER }
  }
}
