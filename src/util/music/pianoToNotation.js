import { notes } from "./roots"

export const convertMidiNumberToNote = midiNumber => {
  const { pitch, octave } = convertMidiNumberToPitch(midiNumber)
  const noteOptions = notes[pitch]
  //select the first option for now
  const selectedNote = noteOptions[0]
  const noteInRightOctave = getNoteInRightOctave(selectedNote, octave)
  return { notation: noteInRightOctave, pitch, midiNumber }
}

const convertMidiNumberToPitch = midiNumber => {
  let pitch = midiNumber - 60 //midi number 60 = middle c
  let octave = 1 // middle octave
  while (pitch > 11) {
    pitch -= 12
    octave += 1
  }
  while (pitch < 0) {
    pitch += 12
    octave -= 1
  }
  return { pitch, octave, midiNumber }
}

const getNoteInRightOctave = (note, octave) => {
  switch (octave) {
    case 0:
      return note + ","
    case 1:
      return note
    case 2:
      return note.toLowerCase()
    case 3:
      return note.toLowerCase() + "'"
  }
  return note
}
