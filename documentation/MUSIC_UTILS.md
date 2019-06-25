# Music utils in `src/util/music/`

This document details what each music utility file contains.

The order they are explained is based on dependency graph, 
so that files used in impotyd are explained before going to the next file.

The objects with classes are mostly used for creating the options that user can choose in exercises (The objects require `label` as an option)

## `accidentals.js`

This file is used for listing abc notation accidentals (`_`, `^`, `=`) and their equivalent symbols in text (`b`, `#`, ``).

```javascript
Accidental: {
  symbol: String,
  notation: String // abc notation
}
```

## `roots.js`

Uses `accidentals`

This file is used for defining Root objects. 
Roots are base for all other musical constructs and define pitch a note is played in.

```javascript
Root: {
  pitch: number,
  letter: String,
  accidental: Accidental,
  label: String,
  notation: String // abc notation
}
```

## `qualities.js`

This file is used for defining different qualities for basic intervals (diminished, minor, major, perfect, augmented)

```javascript
Quality: {
  label: String,
  name: String // key (dim, min, maj, perf, aug)
}
```

## `intervals.js`

Uses `qualities` & `roots`

This file is used as a base for constructing higher musical constructs like chords and scales,
since they consist of intervals to the root note.

```javascript
Interval: {
  quality: Quality,
  label: String,
  number: number // unison = 1, second = 2, ..., octave = 8
}
```

### Most important functions

Function | Description
-- | --
`interval(root, quality, number)` | Forms a new object (not Interval) that contains information for displaying an interval.
`concatenateIntervals(root, intervals)` | Creates a single abc notation from root and multiple interval arrays (`[quality, number]`)
`concatenateNotes(notes)` | Creates a single abc notation from array of abc notation strings (`["c", "^d"]`)

## `chords.js`

Uses `qualities` & `intervals`

This file is used for creating chord triads.

```javascript
Chord: {
  label: String,
  intervals: Array, // [[quality, number], [quality, number]]
  formattingFunction: function, // Formats the triad label ("C-Duuri", "ylennetty C")
}
```

## `scales.js`

Uses `qualities` & `intervals`

This file is used for creating scales and modes

```javascript
Scale: {
  label: String,
  intervals: Array, // [[quality, number], [quality, number]]
  symmetric: boolean // is the scale symmetric
}
```
