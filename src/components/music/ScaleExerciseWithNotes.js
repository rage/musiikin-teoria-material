import React from "react"
import ScaleExercise from "./ScaleExercise"

const ScaleExerciseWithNotes = ({
  engraverParams,
  onCorrectAnswer,
  onIncorrectAnswer,
  ...other
}) => {
  return (
    <ScaleExercise
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
              paddingleft: 15,
              paddingright: 10,
              paddingtop: 15,
              responsive: undefined,
              scale: 2,
              staffwidth: 730,
            }
      }
      onCorrect={onCorrectAnswer}
      onIncorrect={onIncorrectAnswer}
      onlyNotes={true}
    />
  )
}

export default ScaleExerciseWithNotes
