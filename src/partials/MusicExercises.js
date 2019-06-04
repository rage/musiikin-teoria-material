import React from "react"

import MusicExerciseWrapper from "../components/music/MusicExerciseWrapper"

import Exercise from "../components/music/Exercise"
import Chord from "../components/music/Chord"
import Interval from "../components/music/Interval"
import Scale from "../components/music/Scale"

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
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          exerciseKind={new Chord()}
          requiredAnswers={requiredAnswers}
        />
      )
    case "chords_notes":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          onlyNotes={true}
          exerciseKind={new Chord()}
          requiredAnswers={requiredAnswers}
        />
      )
    case "chords_sound":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          onlySound={true}
          exerciseKind={new Chord()}
          requiredAnswers={requiredAnswers}
        />
      )
    case "intervals":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          exerciseKind={new Interval()}
          requiredAnswers={requiredAnswers}
        />
      )
    case "intervals_notes":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          onlyNotes={true}
          exerciseKind={new Interval()}
          requiredAnswers={requiredAnswers}
        />
      )
    case "intervals_sound":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          onlySound={true}
          exerciseKind={new Interval()}
          requiredAnswers={requiredAnswers}
        />
      )
    case "scales":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          exerciseKind={new Scale(scales)}
          requiredAnswers={requiredAnswers}
        />
      )
    case "scales_notes":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          onlyNotes={true}
          exerciseKind={new Scale(scales)}
          requiredAnswers={requiredAnswers}
        />
      )
    case "scales_sound":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          onlySound={true}
          exerciseKind={new Scale(scales)}
          requiredAnswers={requiredAnswers}
        />
      )
    case "modes":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          exerciseKind={new Scale(modes)}
          requiredAnswers={requiredAnswers}
        />
      )
    case "modes_notes":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          onlyNotes={true}
          exerciseKind={new Scale(modes)}
          requiredAnswers={requiredAnswers}
        />
      )
    case "modes_sound":
      return (
        <Exercise
          onCorrect={onCorrectAnswer}
          onIncorrect={onIncorrectAnswer}
          onlySound={true}
          exerciseKind={new Scale(modes)}
          requiredAnswers={requiredAnswers}
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
