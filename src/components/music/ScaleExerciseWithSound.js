import React from "react"
import ScaleExercise from "./ScaleExercise"

const ScaleExerciseWithSound = ({
  playButtonStyle,
  onCorrectAnswer,
  onIncorrectAnswer,
  ...other
}) => {
  return (
    <ScaleExercise
      {...other}
      playButtonStyle={playButtonStyle ? playButtonStyle : "scalePlayButton"}
      onCorrect={onCorrectAnswer}
      onIncorrect={onIncorrectAnswer}
      onlySound={true}
    />
  )
}

export default ScaleExerciseWithSound
