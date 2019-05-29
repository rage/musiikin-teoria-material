import React from "react"
import IntervalExercise from "./IntervalExercise"

const IntervalExerciseWithNotes = ({
  engraverParams,
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
              paddingleft: 216,
              paddingright: 232,
              paddingtop: 15,
              responsive: undefined,
              scale: 3,
              staffwidth: 300,
            }
      }
      onCorrect={onCorrectAnswer}
      onIncorrect={onIncorrectAnswer}
      onlyNotes={true}
    />
  )
}

export default IntervalExerciseWithNotes
