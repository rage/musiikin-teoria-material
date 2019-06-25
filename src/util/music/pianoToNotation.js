import { lowerOctave, raiseOctave } from "./intervals"
import { notes } from "./roots"

/**
 * Returns a note corresponding to the given midiNumber, according to the
 * notation options given as noteOptions.
 * The returned note is an object with:
 * "notation": a String corresponding to abc notation of the note;
 * "pitch": the corresponding pitch in the central octave, from 0 to 11;
 * "midiNumber": same as the input parameter midiNumber.
 *
 * @param {*} midiNumber Midi number (absolute pitch) of the desired note
 * @param {*} noteOptions String array of size 12, in which each element is the
 *                        desired notation (in the central octave) for the
 *                        corresponding pitch, meaning that pitch is the index
 *                        of the array (for example noteOptions[0] contains the
 *                        desired notation for C)
 */
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
