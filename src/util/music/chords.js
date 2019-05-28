import { DIMINISHED, MINOR, MAJOR, PERFECT, AUGMENTED } from "./qualities"
import {
  interval,
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
      root.notation +
      this.intervals.map(i => interval(root, ...i)).join("") +
      "]"
    )
  }
}

export const triads = [
  new Chord("Vähennetty", [[MINOR, THIRD], [DIMINISHED, FIFTH]]),
  new Chord("Molli", [[MINOR, THIRD], [PERFECT, FIFTH]]),
  new Chord("Duuri", [[MAJOR, THIRD], [PERFECT, FIFTH]]),
  new Chord("Ylinouseva", [[MAJOR, THIRD], [AUGMENTED, FIFTH]]),
]
