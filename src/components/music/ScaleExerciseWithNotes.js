import React from "react"
import ChordExercise from "./ChordExercise"

const ScaleExerciseWithNotes = ({
  engraverParams,
  onCorrectAnswer,
  onIncorrectAnswer,
  ...other
}) => {
  return (
    <ChordExercise
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
              paddingtop: 60,
              responsive: undefined,
              scale: 3,
              staffwidth: 250,
            }
      }
      onCorrect={onCorrectAnswer}
      onIncorrect={onIncorrectAnswer}
      onlyNotes={true}
    />
  )
}

export default ScaleExerciseWithNotes
