import {
  roots as notationRoots,
  answerOptionsForRoots as answerRoots,
} from "../../util/music/roots"
import { triads as answerTriads } from "../../util/music/chords"
import { randomIntArray } from "../../util/random"

// Answer Keys
const ROOT = "root",
  TRIAD = "triad"

/**
 * Private method, generate a number of correct answers.
 * @param {*} howMany How many exercises to generate
 * @returns [{root: 5, triad: 4, notation: "<abc notation>"}]
 */
const generateCorrectAnswers = howMany => {
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

export default class Chord {
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
      exercises: generateCorrectAnswers(howMany),
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
    if (!answer.root || !correctAnswer) return []

    const correctAnswerKeys = []

    if (answer.root.pitch === correctAnswer.root.pitch)
      correctAnswerKeys.push(ROOT)
    if (answer.triad === correctAnswer.triad) correctAnswerKeys.push(TRIAD)

    return correctAnswerKeys
  }

  /**
   * Get user readable string of the answer.
   * @param {*} answer {root: 0, triad: 0}
   * @returns "C major"
   */
  readableAnswerString(answer) {
    return (
      notationRoots[answer.root].label +
      " " +
      answerTriads[answer.triad].label.toLowerCase()
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
      paddingleft: 270,
      paddingright: 270,
      paddingtop: 15,
      responsive: undefined,
      scale: 2,
      staffwidth: 224,
    }
  }
}
