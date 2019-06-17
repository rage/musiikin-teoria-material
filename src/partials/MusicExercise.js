import React from "react"

import MusicExerciseWrapper from "../components/music/MusicExerciseWrapper"

import Exercise from "../components/music/Exercise"
import PianoExercise from "../components/music/PianoExercise"
import Chord from "../components/music/Chord"
import Interval from "../components/music/Interval"
import Scale from "../components/music/Scale"

/**
 * In charge of routing user exercise type to implementing exercise
 * eg <music-exercise type="chords"> to ChordsExercise
 */
const ExerciseRouter = ({ type, name, description, required }) => {
  const requiredAnswers = Number(required) || 10 // default is 10
  return (
    <MusicExerciseWrapper
      renderExercise={createExerciseRenderingFunction(type, requiredAnswers)}
      name={name}
      description={description}
      requiredAnswers={requiredAnswers}
      quizId={getQuizId(type)}
    />
  )
}

const getQuizId = type => {
  switch (type ? type : "chords") {
    case "chords":
      return "abdbe74f-88db-43c2-8ff2-e32e5973bfd4"
    case "chords_notes":
      return "b536cb33-904e-45b4-9a60-ef8c29e989ac"
    case "chords_sound":
      return "b07a8610-8c88-4fd7-9824-e949a8cca7a7"
    case "intervals":
      return "b5f6aa12-90e7-4261-a986-f089cc530a3d"
    case "intervals_notes":
      return "bac091ae-94b7-45f7-98b6-f6de53849d8c"
    case "intervals_sound":
      return "b28a4363-8e2d-43ea-a833-ec0347c28820"
    case "scales":
      return "a8956b63-863f-4867-86cd-ded9f44a55af"
    case "scales_notes":
      return "ad43a004-89f9-4b11-b833-e509dde06a3b"
    case "scales_sound":
      return "4bb6fedf-7165-4999-ae8b-475dec8b9b62"
    case "modes":
      return "ada3e59c-8a46-45b1-a102-e58920f97693"
    case "modes_notes":
      return "a85e658f-8613-4b58-bf95-de91382a0f1f"
    case "modes_sound":
      return "b36b9a72-8ee0-4b08-aad2-ed2d288049ef"
    case "piano_chords":
      return "9b666692-7bbf-4e5f-9493-cd6c811acac0"
  }
}

const getExerciseKindByType = type => {
  if (type.includes("chord")) {
    return new Chord()
  } else if (type.includes("interval")) {
    return new Interval()
  } else if (type.includes("scale")) {
    return new Scale("scales")
  } else if (type.includes("mode")) {
    return new Scale("modes")
  } else {
    return undefined
  }
}

const createExerciseRenderingFunction = (type, requiredAnswers) => (
  onCorrectAnswer,
  onIncorrectAnswer,
) => {
  const wantedType = type ? type : "chords"

  const exerciseKind = getExerciseKindByType(wantedType)

  if (!exerciseKind) {
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

  const onlyNotes = wantedType.includes("notes")
  const onlySound = wantedType.includes("sound")

  if (type.includes("piano")) {
    return (
      <PianoExercise
        onCorrect={onCorrectAnswer}
        onIncorrect={onIncorrectAnswer}
        onlyNotes={onlyNotes}
        onlySound={onlySound}
        exerciseKind={exerciseKind}
        requiredAnswers={requiredAnswers}
      />
    )
  } else {
    return (
      <Exercise
        onCorrect={onCorrectAnswer}
        onIncorrect={onIncorrectAnswer}
        onlyNotes={onlyNotes}
        onlySound={onlySound}
        exerciseKind={exerciseKind}
        requiredAnswers={requiredAnswers}
      />
    )
  }
}

export default ExerciseRouter
