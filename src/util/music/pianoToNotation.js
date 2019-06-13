import { notes } from "./roots"

export const getNoteFromPitch = pitch => {
  const noteOptions = notes[pitch]
  //return first option for now
  return noteOptions[0]
}
