import { DIMINISHED, MINOR, MAJOR, PERFECT, AUGMENTED } from "./qualities"
import {
  concatenate,
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
  constructor(label, intervals) {
    this.label = label
    this.intervals = intervals
  }

  notation(root) {
    return (
      "L:1/1\n[" +
      concatenate(root, [[PERFECT, UNISON], ...this.intervals]) +
      "]"
    )
  }
}

export const triads = [
  new Chord("Duuri", [[PERFECT, UNISON], [MAJOR, THIRD], [PERFECT, FIFTH]]),
  new Chord("Molli", [[PERFECT, UNISON], [MINOR, THIRD], [PERFECT, FIFTH]]),
  new Chord("Vähennetty", [[MINOR, THIRD], [DIMINISHED, FIFTH]]),
  new Chord("Ylinouseva", [[MAJOR, THIRD], [AUGMENTED, FIFTH]]),
]
