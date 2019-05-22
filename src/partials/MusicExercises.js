import React from "react"

import MusicExerciseWrapper from "../components/music/MusicExerciseWrapper"
import ChordExerciseWithNotesAndSound from "../components/music/ChordExerciseWithNotesAndSound"
import ChordExerciseWithNotes from "../components/music/ChordExerciseWithNotes"
import ChordExerciseWithSound from "../components/music/ChordExerciseWithSound"

/**
 * In charge of routing user exercise type to implementing exercise
 * eg <music-exercise type="chrords"> to ChordsExercise
 */
const ExerciseRouter = ({ type }) => {
  return (
    <MusicExerciseWrapper
      renderExercise={createExerciseRenderingFunction(type)}
    />
  )
}

const createExerciseRenderingFunction = type => (
  onCorrectAnswer,
  onIncorrectAnswer,
) => {
  switch (type ? type : "chords") {
    case "chords":
      return (
        <ChordExerciseWithNotesAndSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
        />
      )
    case "chords_notes":
      return (
        <ChordExerciseWithNotes
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
        />
      )
    case "chords_sound":
      return (
        <ChordExerciseWithSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
        />
      )
    default:
      return (
        <p>
          Incorrect exercise type, implemented types: "chords", "chords_notes",
          "chords_sound"
        </p>
      )
  }
}

export default ExerciseRouter
