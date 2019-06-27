import React from "react"

import PianoComponent from "../components/music/Piano"

const Piano = props => {
  const { notes, playable } = props

  const midi = notes
    ? notes === "egg" /* Easter egg that allows playing with keyboard */
      ? 0
      : [0, ...notes.split(" ").map(part => Number(part) + 60)]
    : playable
    ? []
    : [0]

  return (
    <div className="material-piano">
      <PianoComponent showNotes={midi} />
    </div>
  )
}

export default Piano
