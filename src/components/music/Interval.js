import { roots as notationRoots } from "../../util/music/roots"
import {
  intervalLabels,
  createRandomInterval,
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

  return correctRoots.map(correctRoot => {
    const interval = createRandomInterval()
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
