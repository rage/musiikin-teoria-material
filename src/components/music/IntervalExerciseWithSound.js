import React from "react"
import IntervalExercise from "./IntervalExercise"

const IntervalExerciseWithSound = ({
  playButtonStyle,
  onCorrectAnswer,
  onIncorrectAnswer,
  ...other
}) => {
  return (
    <IntervalExercise
      {...other}
      playButtonStyle={playButtonStyle ? playButtonStyle : "playButton"}
      onCorrect={onCorrectAnswer}
      onIncorrect={onIncorrectAnswer}
      onlySound={true}
    />
  )
}

export default IntervalExerciseWithSound
