import React from "react"

import MusicExerciseWrapper from "../components/music/MusicExerciseWrapper"
import ChordExerciseWithNotesAndSound from "../components/music/ChordExerciseWithNotesAndSound"
import ChordExerciseWithNotes from "../components/music/ChordExerciseWithNotes"
import ChordExerciseWithSound from "../components/music/ChordExerciseWithSound"
import IntervalExerciseWithNotesAndSound from "../components/music/IntervalExerciseWithNotesAndSound"
import IntervalExerciseWithNotes from "../components/music/IntervalExerciseWithNotes"
import IntervalExerciseWithSound from "../components/music/IntervalExerciseWithSound"
import ScaleExerciseWithNotesAndSound from "../components/music/ScaleExerciseWithNotesAndSound"
import ScaleExerciseWithNotes from "../components/music/ScaleExerciseWithNotes"
import ScaleExerciseWithSound from "../components/music/ScaleExerciseWithSound"

/**
 * In charge of routing user exercise type to implementing exercise
 * eg <music-exercise type="chrords"> to ChordsExercise
 */
const ExerciseRouter = ({ type, name, description }) => {
  return (
    <MusicExerciseWrapper
      renderExercise={createExerciseRenderingFunction(type)}
      name={name}
      description={description}
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
    case "intervals":
      return (
        <IntervalExerciseWithNotesAndSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
        />
      )
    case "intervals_notes":
      return (
        <IntervalExerciseWithNotes
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
        />
      )
    case "intervals_sound":
      return (
        <IntervalExerciseWithSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
        />
      )
    case "scales":
      return (
        <ScaleExerciseWithNotesAndSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
        />
      )
    case "scales_notes":
      return (
        <ScaleExerciseWithNotes
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
        />
      )
    case "scales_sound":
      return (
        <ScaleExerciseWithSound
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
