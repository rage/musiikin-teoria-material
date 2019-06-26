import { DIMINISHED, MINOR, MAJOR, PERFECT, AUGMENTED } from "./qualities"
import {
  concatenateNotation,
  interval,
  raiseOctave,
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

  // inversion can range from 0 to this.intervals.size (both inclusive)
  notation(root, inversion = 0) {
    const intervalsNotations = [[PERFECT, UNISON], ...this.intervals].map(
      i => interval(root, ...i).notation,
    )
    // create two subarrays from intervalsNotations: one from index 0
    // (inclusive) to index inversion (exclusive), the other from index
    // inversion (inclusive) to the end of the array
    const toBeRaised = intervalsNotations.slice(0, inversion)
    const ready = intervalsNotations.slice(inversion)

    return (
      "L:1/1\n[" +
      concatenateNotation([...ready, ...toBeRaised.map(n => raiseOctave(n))]) +
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
