import { concatenate } from "./intervals"
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
  constructor(label, intervals, symmetric) {
    this.label = label
    this.intervals = intervals
    this.symmetric = symmetric
  }

  notation(root) {
    return "L:1/4\n" + concatenate(root, [[PERFECT, UNISON], ...this.intervals])
  }
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
  ),
]

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
  ),
]
