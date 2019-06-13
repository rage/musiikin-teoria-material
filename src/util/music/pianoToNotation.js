import { notes } from "./roots"

export const convertMidiNumberToNote = midiNumber => {
  const pitch = convertMidiNumberToPitch(midiNumber)
  const noteOptions = notes[pitch]
  //return first option for now
  return noteOptions[0]
}

const convertMidiNumberToPitch = midiNumber => {
  //midi number 60 = middle c
  let pitch = midiNumber - 60
  while (pitch > 11) {
    pitch = pitch - 12
  }
  while (pitch < 0) {
    pitch = pitch + 12
  }
  return pitch
}
