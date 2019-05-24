import React from "react"
import ChordExercise from "./ChordExercise"

const ScaleExerciseWithSound = ({
  playButtonStyle,
  onCorrectAnswer,
  onIncorrectAnswer,
  ...other
}) => {
  return (
    <ChordExercise
      {...other}
      playButtonStyle={playButtonStyle ? playButtonStyle : "playbuttonSound"}
      onCorrect={onCorrectAnswer}
      onIncorrect={onIncorrectAnswer}
      onlySound={true}
    />
  )
}

export default ScaleExerciseWithSound
