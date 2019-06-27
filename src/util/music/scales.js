import { concatenateIntervals } from "./intervals"
import { DIMINISHED, MINOR, MAJOR, PERFECT, AUGMENTED } from "./qualities"
import {
  UNISON,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH,
  SIXTH,
  SEVENTH,
  OCTAVE,
} from "./intervals"
/**
 * symmetric: true if ascending and descending scales contain the same intervals
 * in which case parameter intervals should contain only ascending intervals
 */
class Scale {
  constructor(label, intervals, symmetric, formattingFunction) {
    this.label = label
    this.intervals = intervals
    this.symmetric = symmetric
    this.formattingFunction = formattingFunction
  }

  notation(root) {
    return (
      "L:1/4\n" +
      concatenateIntervals(root, [
        [PERFECT, UNISON],
        ...this.intervals,
        [PERFECT, OCTAVE],
      ])
    )
  }

  asReadableString(root) {
    return this.formattingFunction(root.label, this.label)
  }
}

export const SCALES = {
  MAJOR: 0,
  NATURAL_MINOR: 1,
  HARMONIC_MINOR: 2,
  MELODIC_MINOR: 3,
}

export const scales = [
  new Scale(
    "Duuri",
    [
      [MAJOR, SECOND],
      [MAJOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MAJOR, SIXTH],
      [MAJOR, SEVENTH],
    ],
    true,
    (root, scale) => root + "-" + scale.toLowerCase(),
  ),
  new Scale(
    "Luonnollinen molli",
    [
      [MAJOR, SECOND],
      [MINOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MINOR, SIXTH],
      [MINOR, SEVENTH],
    ],
    true,
    (root, scale) =>
      scale.split(" ")[0].toLowerCase() +
      " " +
      root +
      "-" +
      scale.split(" ")[1],
  ),
  new Scale(
    "Harmoninen molli",
    [
      [MAJOR, SECOND],
      [MINOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MINOR, SIXTH],
      [MAJOR, SEVENTH],
    ],
    true,
    (root, scale) =>
      scale.split(" ")[0].toLowerCase() +
      " " +
      root +
      "-" +
      scale.split(" ")[1],
  ),
  new Scale(
    "Melodinen molli",
    [
      [MAJOR, SECOND],
      [MINOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MAJOR, SIXTH],
      [MAJOR, SEVENTH],
    ],
    false,
    (root, scale) =>
      scale.split(" ")[0].toLowerCase() +
      " " +
      root +
      "-" +
      scale.split(" ")[1],
  ),
]

export const MODES = {
  IONIAN: 0,
  DORIAN: 1,
  PHRYGIAN: 2,
  LYDIAN: 3,
  MIXOLYDIAN: 4,
  AEOLIAN: 5,
  LOCRIAN: 6,
}

export const modes = [
  new Scale(
    "Jooninen",
    [
      [MAJOR, SECOND],
      [MAJOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MAJOR, SIXTH],
      [MAJOR, SEVENTH],
    ],
    true,
    (root, scale) => root + "-" + scale.toLowerCase(),
  ),
  new Scale(
    "Doorinen",
    [
      [MAJOR, SECOND],
      [MINOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MAJOR, SIXTH],
      [MINOR, SEVENTH],
    ],
    true,
    (root, scale) => root + "-" + scale.toLowerCase(),
  ),
  new Scale(
    "Fryyginen",
    [
      [MINOR, SECOND],
      [MINOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MINOR, SIXTH],
      [MINOR, SEVENTH],
    ],
    true,
    (root, scale) => root + "-" + scale.toLowerCase(),
  ),
  new Scale(
    "Lyydinen",
    [
      [MAJOR, SECOND],
      [MAJOR, THIRD],
      [AUGMENTED, FOURTH],
      [PERFECT, FIFTH],
      [MAJOR, SIXTH],
      [MAJOR, SEVENTH],
    ],
    true,
    (root, scale) => root + "-" + scale.toLowerCase(),
  ),
  new Scale(
    "Miksolyydinen",
    [
      [MAJOR, SECOND],
      [MAJOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MAJOR, SIXTH],
      [MINOR, SEVENTH],
    ],
    true,
    (root, scale) => root + "-" + scale.toLowerCase(),
  ),
  new Scale(
    "Aiolinen",
    [
      [MAJOR, SECOND],
      [MINOR, THIRD],
      [PERFECT, FOURTH],
      [PERFECT, FIFTH],
      [MINOR, SIXTH],
      [MINOR, SEVENTH],
    ],
    true,
    (root, scale) => root + "-" + scale.toLowerCase(),
  ),
  new Scale(
    "Lokrinen",
    [
      [MINOR, SECOND],
      [MINOR, THIRD],
      [PERFECT, FOURTH],
      [DIMINISHED, FIFTH],
      [MINOR, SIXTH],
      [MINOR, SEVENTH],
    ],
    true,
    (root, scale) => root + "-" + scale.toLowerCase(),
  ),
]
