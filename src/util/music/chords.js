import { DIMINISHED, MINOR, MAJOR, PERFECT, AUGMENTED } from "./qualities"
import {
  concatenateIntervals,
  UNISON,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH,
  SIXTH,
  SEVENTH,
  OCTAVE,
} from "./intervals"

class Chord {
  constructor(label, intervals, formattingFunction) {
    this.label = label
    this.intervals = intervals
    this.formattingFunction = formattingFunction
  }

  notation(root) {
    return (
      "L:1/1\n[" +
      concatenateIntervals(root, [[PERFECT, UNISON], ...this.intervals]) +
      "]"
    )
  }

  asReadableString(root) {
    return this.formattingFunction(root.label, this.label)
  }
}

export const TRIADS = {
  MAJOR: 0,
  MINOR: 1,
  DIMINISHED: 2,
  AUGMENTED: 3,
}

export const triads = [
  new Chord(
    "Duuri",
    [[MAJOR, THIRD], [PERFECT, FIFTH]],
    (root, triad) => root + "-" + triad.toLowerCase(),
  ),
  new Chord(
    "Molli",
    [[MINOR, THIRD], [PERFECT, FIFTH]],
    (root, triad) => root + "-" + triad.toLowerCase(),
  ),
  new Chord(
    "Vähennetty",
    [[MINOR, THIRD], [DIMINISHED, FIFTH]],
    (root, triad) => triad.toLowerCase() + " " + root,
  ),
  new Chord(
    "Ylinouseva",
    [[MAJOR, THIRD], [AUGMENTED, FIFTH]],
    (root, triad) => triad.toLowerCase() + " " + root,
  ),
]
