import Chord, { CHORD } from "./Chord"

export default class RootlessChord extends Chord {
  constructor(chords, withInversions) {
    super(chords, withInversions)
  }

  generateExerciseSet = howMany => {
    const exerciseSet = {
      answerKeys: [CHORD],
      answerOptions: { chord: this.answerChords },
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
    const answerChordLabel = this.answerChords[answer.chord].label.toLowerCase()

    const correctAnswerChordLabel = this.answerChords[
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
