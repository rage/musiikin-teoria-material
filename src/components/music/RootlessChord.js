import { triads as answerTriads } from "../../util/music/chords"
import Chord, { generateCorrectAnswers, TRIAD } from "./Chord"

export default class RootlessChord extends Chord {
  constructor(withInversions) {
    super(withInversions)
  }

  generateExerciseSet = howMany => {
    const exerciseSet = {
      answerKeys: [TRIAD],
      answerOptions: { triad: answerTriads },
      answerLabels: { triad: "Laatu" },
      exercises: generateCorrectAnswers(howMany, this.withInversions),
    }

    return exerciseSet
  }

  /**
   * Get answerKeys that were same in both answer and correctAnswer.
   * @param {*} answer {triad: 3}
   * @param {*} correctAnswer {triad: 2}
   * @returns ["triad"]
   */
  getCorrectAnswerKeys = (answer, correctAnswer) => {
    if (!answer || typeof answer.triad !== "number" || !correctAnswer) return []

    const correctAnswerKeys = []

    if (answer.triad === correctAnswer.triad) correctAnswerKeys.push(TRIAD)
    return correctAnswerKeys
  }

  getInstructionString = () => "soinnun laatu"

  makeAnswerPayload = (answer, correctAnswer, correct) => {
    const answerTriadLabel = answerTriads[answer.triad].label.toLowerCase()

    const correctAnswerTriadLabel = answerTriads[
      correctAnswer.triad
    ].label.toLowerCase()

    return {
      type: "chords_sound",
      answer: { triad: answerTriadLabel },
      correctAnswer: { triad: correctAnswerTriadLabel },
      correct,
    }
  }
}
