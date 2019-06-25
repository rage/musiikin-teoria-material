import { lowerOctave, raiseOctave } from "./intervals"
import { notes } from "./roots"

export const convertMidiNumberToNote = (midiNumber, noteOptions) => {
  const { pitch, octave } = convertMidiNumberToPitch(midiNumber)
  // select the option that is in the correct answer as well
  const selectedNote = noteOptions[pitch]
  const noteInRightOctave = getNoteInRightOctave(selectedNote, octave)
  return { notation: noteInRightOctave, pitch, midiNumber }
}

const convertMidiNumberToPitch = midiNumber => {
  let pitch = midiNumber - 60 // midi number 60 = middle c
  let octave = 0 // middle octave
  while (pitch >= notes.length) {
    pitch -= notes.length
    octave++
  }
  // needed only if piano range is changed
  while (pitch < 0) {
    pitch += notes.length
    octave--
  }
  return { pitch, octave, midiNumber }
}

const getNoteInRightOctave = (notation, octave) => {
  while (octave > 0) {
    notation = raiseOctave(notation)
    octave--
  }
  // needed only if piano range is changed
  while (octave < 0) {
    notation = lowerOctave(notation)
    octave++
  }
  return notation
}
