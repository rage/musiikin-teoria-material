import {
  roots as notationRoots,
  answerOptionsForRoots as answerRoots,
} from "../../util/music/roots"
import { randomIntArray } from "../../util/random"

// Answer Keys
const ROOT = "root",
  SCALE = "scale"

/**
 * Private method, generate a number of correct answers.
 * @param {*} howMany How many exercises to generate
 * @returns [{root: 5, scale: 4, notation: "<abc notation>"}]
 */
const generateCorrectAnswers = (howMany, scales) => {
  const correctRoots = randomIntArray(0, notationRoots.length, howMany)
  const correctScales = randomIntArray(0, scales.length, howMany)

  return correctRoots.map((root, i) => {
    const correctScale = correctScales[i]
    const notation = scales[correctScale].notation(notationRoots[root])
    return {
      root: root,
      scale: correctScale,
      notation: notation,
    }
  })
}

export default class Scale {
  constructor(scales) {
    this.scales = scales
  }

  generateExerciseSet(howMany) {
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
      exercises: generateCorrectAnswers(howMany, this.scales),
    }

    return exerciseSet
  }

  /**
   * Get answerKeys that were same in both answer and correctAnswer.
   * @param {*} answer {root: 5, scale: 3}
   * @param {*} correctAnswer {root: 5, scale: 2}
   * @returns ["root"]
   */
  getCorrectAnswerKeys(answer, correctAnswer) {
    if (!answer.root || !correctAnswer) return []

    const correctAnswerKeys = []

    if (answer.root.pitch === correctAnswer.root.pitch)
      correctAnswerKeys.push(ROOT)
    if (answer.scale === correctAnswer.scale) correctAnswerKeys.push(SCALE)

    return correctAnswerKeys
  }

  /**
   * Get user readable string of the answer.
   * @param {*} answer {root: 0, scale: 0}
   * @returns "C major"
   */
  readableAnswerString(answer) {
    return (
      notationRoots[answer.root].label +
      " " +
      this.scales[answer.scale].label.toLowerCase()
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
      paddingleft: 15,
      paddingright: 10,
      paddingtop: 15,
      responsive: undefined,
      scale: 2,
      staffwidth: 730,
    }
  }
}
