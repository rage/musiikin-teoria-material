import React from "react"
import { Typography, Divider } from "@material-ui/core"

const ExerciseInstruction = props => {
  return (
    <>
      <br />
      <Typography variant="subtitle1" align="center">
        {props.children}
      </Typography>
      <br />
      <Divider light />
    </>
  )
}

export default ExerciseInstruction
