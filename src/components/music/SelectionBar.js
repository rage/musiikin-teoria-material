import React, { Fragment } from "react"
import PropTypes from "prop-types"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import DropDownForAnswers from "./DropDownForAnswers"
import { Button, Icon } from "@material-ui/core"
import green from "@material-ui/core/colors/green"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCheck as correctMsgIcon,
  faCheckCircle as correct,
  faTimesCircle as incorrect,
  faExclamationCircle as unset,
} from "@fortawesome/free-solid-svg-icons"

class SelectionBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showCorrectOnButton: false,
      showUnsetAnswersAsOrange: false,
    }
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
      this.setState({ showUnsetAnswersAsOrange: true })
      return
    }

    this.setState({ showUnsetAnswersAsOrange: false })

    this.props.onSubmit(event)

    setTimeout(() => {
      const wrongAnswer = this.props.answerWasWrong
      if (wrongAnswer) {
        return
      }

      // Show checkmark
      this.setState({ showCorrectOnButton: true })
      // Hide checkmark later
      setTimeout(() => {
        this.setState({ showCorrectOnButton: false })
      }, 2500)
    }, 100)
  }

  renderButton() {
    if (this.state.showCorrectOnButton) {
      return (
        <Button
          variant="contained"
          color="primary"
          style={{ backgroundColor: green[500] }}
        >
          Oikein! &nbsp; <FontAwesomeIcon icon={correctMsgIcon} />
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

    const borderColorForOption = option => {
      if (option.answerIsCorrect === null) {
        const warnAboutUnset =
          this.state.showUnsetAnswersAsOrange &&
          typeof option.selectedIndex !== "number"

        return warnAboutUnset ? "darkorange" : ""
      }
      return option.answerIsCorrect ? "green" : "red"
    }

    const iconForOption = option => {
      if (option.answerIsCorrect === null) {
        const warnAboutUnset =
          this.state.showUnsetAnswersAsOrange &&
          typeof option.selectedIndex !== "number"

        return warnAboutUnset ? (
          <FontAwesomeIcon
            size="lg"
            icon={unset}
            style={{ color: "darkorange" }}
          />
        ) : null
      }
      return option.answerIsCorrect ? (
        <FontAwesomeIcon
          size="lg"
          icon={correct}
          style={{ color: green[600] }}
        />
      ) : (
        <FontAwesomeIcon size="lg" icon={incorrect} style={{ color: "red" }} />
      )
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
              borderColor={borderColorForOption(option)}
              icon={iconForOption(option)}
            />
          </div>
        ))}
        <div className="submitButton">{this.renderButton()}</div>
      </Fragment>
    )
  }
}

SelectionBar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  nextExerciseSet: PropTypes.func.isRequired,
  answerWasWrong: PropTypes.bool.isRequired,
  options: PropTypes.array.isRequired,
}

export default withSimpleErrorBoundary(SelectionBar)
