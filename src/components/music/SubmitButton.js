import React from "react"
import { Button, Icon } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import green from "@material-ui/core/colors/green"
import { faCheck as correctMsgIcon } from "@fortawesome/free-solid-svg-icons"

const SubmitButton = ({
  showCorrectOnButton,
  answerWasWrong,
  nextExerciseSet,
  onClick,
  isPiano,
}) => {
  let button = null
  if (showCorrectOnButton) {
    button = (
      <Button
        variant="contained"
        color="primary"
        style={{ backgroundColor: green[500] }}
      >
        Oikein! &nbsp; <FontAwesomeIcon icon={correctMsgIcon} />
      </Button>
    )
  } else if (answerWasWrong) {
    button = (
      <Button variant="contained" color="primary" onClick={nextExerciseSet}>
        Aloita alusta
      </Button>
    )
  } else {
    button = (
      <Button variant="contained" color="primary" onClick={onClick}>
        Lähetä &nbsp;
        <Icon fontSize="small">send</Icon>
      </Button>
    )
  }

  if (isPiano) {
    return <div className="submitButtonPiano">{button}</div>
  } else {
    return <div className="submitButton">{button}</div>
  }
}

export default SubmitButton
