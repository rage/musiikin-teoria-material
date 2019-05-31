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

import { scales, modes } from "../util/music/scales"

/**
 * In charge of routing user exercise type to implementing exercise
 * eg <music-exercise type="chords"> to ChordsExercise
 */
const ExerciseRouter = ({ type, name, description, required }) => {
  const requiredAnswers = required || 10 // default is 10
  return (
    <MusicExerciseWrapper
      renderExercise={createExerciseRenderingFunction(type, requiredAnswers)}
      name={name}
      description={description}
      requiredAnswers={requiredAnswers}
    />
  )
}

const createExerciseRenderingFunction = (type, requiredAnswers) => (
  onCorrectAnswer,
  onIncorrectAnswer,
) => {
  switch (type ? type : "chords") {
    case "chords":
      return (
        <ChordExerciseWithNotesAndSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
        />
      )
    case "chords_notes":
      return (
        <ChordExerciseWithNotes
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
        />
      )
    case "chords_sound":
      return (
        <ChordExerciseWithSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
        />
      )
    case "intervals":
      return (
        <IntervalExerciseWithNotesAndSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
        />
      )
    case "intervals_notes":
      return (
        <IntervalExerciseWithNotes
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
        />
      )
    case "intervals_sound":
      return (
        <IntervalExerciseWithSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
        />
      )
    case "scales":
      return (
        <ScaleExerciseWithNotesAndSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
          scales={scales}
        />
      )
    case "scales_notes":
      return (
        <ScaleExerciseWithNotes
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
          scales={scales}
        />
      )
    case "scales_sound":
      return (
        <ScaleExerciseWithSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
          scales={scales}
        />
      )
    case "modes":
      return (
        <ScaleExerciseWithNotesAndSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
          scales={modes}
        />
      )
    case "modes_notes":
      return (
        <ScaleExerciseWithNotes
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
          scales={modes}
        />
      )
    case "modes_sound":
      return (
        <ScaleExerciseWithSound
          onCorrectAnswer={onCorrectAnswer}
          onIncorrectAnswer={onIncorrectAnswer}
          requiredAnswers={requiredAnswers}
          scales={modes}
        />
      )
    default:
      return (
        <>
          <p>Incorrect exercise type {"'" + type + "'"}, implemented types:</p>
          <ul>
            <li>chords, chords_notes, chords_sound</li>
            <li>intervals, intervals_notes, intervals_sound</li>
            <li>scales, scales_notes, scales_sound</li>
            <li>modes, modes_notes, modes_sound</li>
          </ul>
        </>
      )
  }
}

export default ExerciseRouter
