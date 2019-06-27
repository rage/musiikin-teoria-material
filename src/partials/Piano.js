import React from "react"

import PianoComponent from "../components/music/Piano"

const Piano = props => {
  const { notes } = props

  const midi = notes
    ? [0, ...notes.split(" ").map(part => Number(part) + 60)]
    : [0]

  return <PianoComponent showNotes={midi} />
}

export default Piano
