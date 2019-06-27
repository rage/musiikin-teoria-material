import React from "react"

import PianoComponent from "../components/music/Piano"

const Piano = props => {
  const { notes, playable } = props

  const midi = notes
    ? [0, ...notes.split(" ").map(part => Number(part) + 60)]
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
