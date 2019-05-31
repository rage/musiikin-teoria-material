import React, { Fragment } from "react"
import { Button, Icon } from "@material-ui/core"
import green from "@material-ui/core/colors/green"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import DropDownForAnswers from "./DropDownForAnswers"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheck as correct } from "@fortawesome/free-solid-svg-icons"

class SelectionBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = { showCorrectAnswerCheckmark: false }
  }

  sendAnswer = event => {
    this.props.handleClick(event)
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
          onClick={this.props.nextExercise}
        >
          Aloita alusta
        </Button>
      )
    } else {
      return (
        <Button variant="contained" color="primary" onClick={this.sendAnswer}>
          Lähetä &nbsp;
          <Icon fontSize="small">send</Icon>
        </Button>
      )
    }
  }

  render() {
    return (
      <Fragment>
        {this.props.options.map((option, i) => (
          <div key={i} className={option.className}>
            <DropDownForAnswers
              setStudentsAnswer={option.setAnswer}
              answers={option.answers}
              label={option.label}
              selectedIndex={option.selectedIndex}
              borderColor={option.borderColor}
            />
          </div>
        ))}
        <div className="scaleSubmitbutton">{this.renderButton()}</div>
      </Fragment>
    )
  }
}

export default withSimpleErrorBoundary(SelectionBar)
