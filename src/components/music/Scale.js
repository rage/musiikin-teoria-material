import {
  roots as notationRoots,
  answerOptionsForRoots as answerRoots,
} from "../../util/music/roots"
import { modes, scales } from "../../util/music/scales"
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
      pitch: notationRoots[root].pitch, // Generated answers have pitch
      scale: correctScale,
      notation: notation,
    }
  })
}

export default class Scale {
  constructor(useModes) {
    this.scales = useModes === "modes" ? modes : scales
    this.usedMode = useModes
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
  readableAnswerString(answer) {
    const answerPitchLabel = answer.pitch // Generated answers have pitch
      ? notationRoots[answer.root].label
      : answerRoots[answer.root].label

    return (
      answerPitchLabel + " " + this.scales[answer.scale].label.toLowerCase()
    )
  }

  getInstructionString() {
    return "asteikon pohjasävel ja laatu"
  }

  makeAnswerPayload(answer, correctAnswer, correct) {
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

  makePianoAnswerPayload(
    answerNotes,
    correctAnswerPitches,
    correctAnswerString,
    correct,
  ) {
    return {
      type: "piano " + this.usedMode,
      answer: {
        midiNumber: answerNotes.map(note => note.midiNumber),
        pitch: answerNotes.map(note => note.pitch),
      },
      correctAnswer: {
        string: correctAnswerString,
        pitch: correctAnswerPitches,
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
      paddingleft: 15,
      paddingright: 15,
      paddingtop: 15,
      scale: 1.5,
      staffwidth: 450,
      responsive: "resize",
    }
  }

  /**
   * Returns the minimum and maximum notes allowed on the score;
   * min and max are both inclusive.
   */
  getNoteLimits() {
    return { min: 7, max: 8 }
  }
}
