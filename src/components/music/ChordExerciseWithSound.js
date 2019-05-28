import React from "react"
import ChordExercise from "./ChordExercise"

const ChordExerciseWithSound = ({
  playButtonStyle,
  onCorrectAnswer,
  onIncorrectAnswer,
  ...other
}) => {
  return (
    <ChordExercise
      {...other}
      playButtonStyle={playButtonStyle ? playButtonStyle : "scalePlayButton"}
      onCorrect={onCorrectAnswer}
      onIncorrect={onIncorrectAnswer}
      onlySound={true}
    />
  )
}

export default ChordExerciseWithSound
