import { raiseOctave, concatenate } from "./intervals"
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

  /*
    if not symmetric, use the first half of intervals going up, and the second
    half going down; if symmetric, use all intervals going up, and all intervals
    in reverse order going down
  */
  notation(root) {
    return (
      "L:1/4\n" +
      root.notation +
      concatenate(
        root,
        this.symmetric
          ? this.intervals
          : this.intervals.slice(0, this.intervals.length / 2),
      ) +
      raiseOctave(root.notation) +
      concatenate(
        root,
        this.symmetric
          ? this.intervals.slice().reverse()
          : this.intervals.slice(this.intervals.length / 2),
      ) +
      root.notation
    )
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
      [MINOR, SEVENTH],
      [MINOR, SIXTH],
      [PERFECT, FIFTH],
      [PERFECT, FOURTH],
      [MINOR, THIRD],
      [MAJOR, SECOND],
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
