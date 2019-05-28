class Quality {
  constructor(label, name) {
    this.label = label
    this.name = name
  }
}

// Qualities
// { DIMINISHED, MINOR, MAJOR, PERFECT, AUGMENTED }
export const DIMINISHED = "dim",
  MINOR = "min",
  MAJOR = "maj",
  PERFECT = "perf",
  AUGMENTED = "aug"

export const qualities = [
  new Quality("Vähennetty", DIMINISHED),
  new Quality("Pieni", MINOR),
  new Quality("Suuri", MAJOR),
  new Quality("Puhdas", PERFECT),
  new Quality("Ylinouseva", AUGMENTED),
]
