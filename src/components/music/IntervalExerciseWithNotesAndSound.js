import React from "react"
import IntervalExercise from "./IntervalExercise"

const IntervalExerciseWithNotesAndSound = ({
  engraverParams,
  playButtonStyle,
  onCorrectAnswer,
  onIncorrectAnswer,
  ...other
}) => {
  return (
    <IntervalExercise
      {...other}
      engraverParams={
        engraverParams
          ? engraverParams
          : {
              // Default engraver params
              add_classes: false,
              editable: false,
              listener: null,
              paddingbottom: 1,
              paddingleft: 66,
              paddingright: 50,
              paddingtop: 15,
              responsive: undefined,
              scale: 3,
              staffwidth: 250,
            }
      }
      playButtonStyle={playButtonStyle ? playButtonStyle : "playbutton"}
      onCorrect={onCorrectAnswer}
      onIncorrect={onIncorrectAnswer}
    />
  )
}

export default IntervalExerciseWithNotesAndSound