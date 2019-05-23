import React from "react"
import ChordExercise from "./ChordExercise"

const ChordExerciseWithNotes = ({
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
              paddingleft: 50,
              paddingright: 50,
              paddingtop: 15,
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

export default ChordExerciseWithNotes
