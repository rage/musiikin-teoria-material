import { triads as answerChords } from "../../util/music/chords"
import Chord, { CHORD } from "./Chord"

export default class RootlessChord extends Chord {
  constructor(withInversions) {
    super(withInversions)
  }

  generateExerciseSet = howMany => {
    const exerciseSet = {
      answerKeys: [CHORD],
      answerOptions: { chord: answerChords },
      answerLabels: { chord: "Laatu" },
      exercises: this.generateCorrectAnswers(howMany, this.withInversions),
    }

    return exerciseSet
  }

  /**
   * Get answerKeys that were same in both answer and correctAnswer.
   * @param {*} answer {chord: 3}
   * @param {*} correctAnswer {chord: 2}
   * @returns ["chord"]
   */
  getCorrectAnswerKeys = (answer, correctAnswer) => {
    if (!answer || typeof answer.chord !== "number" || !correctAnswer) return []

    const correctAnswerKeys = []

    if (answer.chord === correctAnswer.chord) correctAnswerKeys.push(CHORD)
    return correctAnswerKeys
  }

  getInstructionString = () => "soinnun laatu"

  makeAnswerPayload = (answer, correctAnswer, correct) => {
    const answerChordLabel = answerChords[answer.chord].label.toLowerCase()

    const correctAnswerChordLabel = answerChords[
      correctAnswer.chord
    ].label.toLowerCase()

    return {
      type: "chords_sound",
      answer: { chord: answerChordLabel },
      correctAnswer: { chord: correctAnswerChordLabel },
      correct,
    }
  }
}
