import React, { Fragment } from "react"
import { Button, Icon } from "@material-ui/core"
import green from "@material-ui/core/colors/green"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import DropDownForAnswers from "./DropDownForAnswers"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck as correct } from "@fortawesome/free-solid-svg-icons"
import CorrectIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"

class SelectionBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showCorrectAnswerCheckmark: false }
  }

  haveAnswersBeenGiven = () => {
    const wantedAnswers = this.props.options.length
    const givenAnswers = this.props.options.filter(option => {
      return typeof option.selectedIndex === "number"
    }).length
    return wantedAnswers === givenAnswers
  }

  onClick = event => {
    if (!this.haveAnswersBeenGiven()) {
      // "Set these options" can be added here later
      return
    }

    this.props.onSubmit(event)

    setTimeout(() => {
      const wrongAnswer = this.props.answerWasWrong
      if (wrongAnswer) {
        return
      }

      // Show checkmark
      this.setState({ showCorrectAnswerCheckmark: true })
      // Hide checkmark later
      setTimeout(() => {
        this.setState({ showCorrectAnswerCheckmark: false })
      }, 2500)
    }, 100)
  }

  renderButton() {
    if (this.state.showCorrectAnswerCheckmark) {
      return (
        <Button
          variant="contained"
          color="primary"
          style={{ backgroundColor: green[500] }}
        >
          Oikein! &nbsp; <FontAwesomeIcon icon={correct} />
        </Button>
      )
    } else if (this.props.answerWasWrong) {
      return (
        <Button
          variant="contained"
          color="primary"
          onClick={this.props.nextExerciseSet}
        >
          Aloita alusta
        </Button>
      )
    } else {
      return (
        <Button variant="contained" color="primary" onClick={this.onClick}>
          Lähetä &nbsp;
          <Icon fontSize="small">send</Icon>
        </Button>
      )
    }
  }

  render() {
    const dropDownClassList = ["dropDown1", "dropDown2"]

    const setBorderColor = answerIsCorrect => {
      let borderColor = ""
      if (answerIsCorrect === null) {
        return borderColor
      }
      answerIsCorrect ? (borderColor = "green") : (borderColor = "red")
      return borderColor
    }

    const setIcon = answerIsCorrect => {
      let icon = null
      if (answerIsCorrect === null) {
        return icon
      }
      answerIsCorrect
        ? (icon = <CorrectIcon style={{ color: green[600] }} />)
        : (icon = <ErrorIcon color="error" />)
      return icon
    }

    return (
      <Fragment>
        {this.props.options.map((option, i) => (
          <div key={i} className={dropDownClassList[i]}>
            <DropDownForAnswers
              setStudentsAnswer={option.setAnswer}
              answers={option.answers}
              label={option.label}
              selectedIndex={option.selectedIndex}
              borderColor={setBorderColor(option.answerIsCorrect)}
              icon={setIcon(option.answerIsCorrect)}
            />
          </div>
        ))}
        <div className="submitButton">{this.renderButton()}</div>
      </Fragment>
    )
  }
}

export default withSimpleErrorBoundary(SelectionBar)
