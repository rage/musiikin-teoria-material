import React from "react"

import {
  roots as notationRoots,
  answerOptionsForRoots as answerRoots,
} from "../../util/music/roots"
import { triads as answerTriads } from "../../util/music/chords"
import { randomIntArray } from "../../util/random"

// Answer Keys
const ROOT = "root",
  TRIAD = "triad"

export default class Chord {
  /**
   * @returns Array of Exercises with the correct answers
   */
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
      exercises: this.__generateCorrectAnswers(howMany),
    }

    return exerciseSet
  }

  __generateCorrectAnswers = howMany => {
    const correctRoots = randomIntArray(0, notationRoots.length, howMany)
    const correctTriads = randomIntArray(0, answerTriads.length, howMany)

    return correctRoots.map((root, i) => {
      const triad = correctTriads[i]
      return {
        root: root,
        triad: triad,
        notation: answerTriads[triad].notation(notationRoots[root]),
      }
    })
  }

  // answers
  // answerKeys: ["root", "triad"]
  // answers[answerKeys[i]]

  // answer[answerKeys[0]] = studentAnswer

  getCorrectAnswerKeys(answer, correctAnswer) {
    if (!answer.root || !correctAnswer) return []

    const correctAnswerKeys = []

    if (answer.root.pitch === correctAnswer.root.pitch)
      correctAnswerKeys.push(ROOT)
    if (answer.triad === correctAnswer.triad) correctAnswerKeys.push(TRIAD)

    return correctAnswerKeys
  }

  readableAnswerString(answer) {
    return (
      notationRoots[answer.root].label +
      " " +
      answerTriads[answer.triad].label.toLowerCase()
    )
  }
}
