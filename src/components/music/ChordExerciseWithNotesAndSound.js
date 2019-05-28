import React from "react"
import ChordExercise from "./ChordExercise"

const ChordExerciseWithNotesAndSound = ({
  engraverParams,
  playButtonStyle,
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
              paddingleft: 216,
              paddingright: 232,
              paddingtop: 15,
              responsive: undefined,
              scale: 3,
              staffwidth: 300,
            }
      }
      playButtonStyle={playButtonStyle ? playButtonStyle : "scalePlayButton"}
      onCorrect={onCorrectAnswer}
      onIncorrect={onIncorrectAnswer}
    />
  )
}

export default ChordExerciseWithNotesAndSound
