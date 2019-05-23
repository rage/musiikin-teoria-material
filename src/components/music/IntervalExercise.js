import React, { Fragment } from "react"
import { Button, Icon, Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import DropDownForAnswers from "./DropDownForAnswers"
import { roots, triads } from "../../util/musicUtils"
import { randomInt } from "../../util/random"

class IntervalExercise extends React.Component {
  state = {
    render: false,
    anchorEl: null,
    open: false,
    placement: null,
    answerRoot: null,
    answerTriad: null,
    correctRoot: null,
    correctTriad: null,
    answerWasSubmitted: false,
    answerWasCorrect: false,
  }

  async componentDidMount() {
    this.setState({
      correctRoot: randomInt(0, roots.length),
      correctTriad: randomInt(0, triads.length),
      render: true,
      onCorrect: undefined, // Function
      onIncorrect: undefined, // Function
      notation: "",
    })
    this.nextExercise()
  }

  constructor(props) {
    super(props)
  }

  answerRootIsCorrect = () => this.state.correctRoot === this.state.answerRoot

  answerTriadIsCorrect = () =>
    this.state.correctTriad === this.state.answerTriad

  answerIsCorrect = () =>
    this.answerRootIsCorrect() && this.answerTriadIsCorrect()

  handleClick = placement => event => {
    if (
      typeof this.state.answerRoot !== "number" ||
      typeof this.state.answerTriad !== "number"
    ) {
      return
    }
    const { currentTarget } = event
    this.setState(state => ({
      anchorEl: currentTarget,
      open: state.placement !== placement || !state.open,
      placement,
      answerWasSubmitted: true,
      answerWasCorrect: this.answerIsCorrect(),
    }))
    if (this.state.answerWasCorrect) {
      this.props.onCorrect()
    } else {
      this.props.onIncorrect()
    }
  }

  setAnswerRoot = studentsAnswer => {
    this.setState({
      answerRoot: studentsAnswer,
    })
  }

  setAnswerTriad = studentsAnswer => {
    this.setState({
      answerTriad: studentsAnswer,
    })
  }

  nextExercise = () => {
    const correctRoot = randomInt(0, roots.length)
    const correctTriad = randomInt(0, triads.length)
    const notation = triads[correctTriad].notation(roots[correctRoot])

    this.setState({
      correctRoot,
      correctTriad,
      notation,
      answerWasSubmitted: false,
      answerWasCorrect: false,
      open: false,
      answerRoot: null,
      answerTriad: null,
    })
  }

  render() {
    if (!this.state.render) {
      return <div>Loading</div>
    }

    return (
      <Fragment>
        <CheckAnswerPopper
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          placement={this.state.placement}
          isCorrect={this.state.answerWasCorrect}
          correctAnswer={
            // pass correct answer only after the answer was sent; otherwise the
            // student could read the correct answer using React Developer Tools
            this.state.answerWasSubmitted
              ? roots[this.state.correctRoot].label +
                " " +
                triads[this.state.correctTriad].label.toLowerCase()
              : ""
          }
        />
        <p>
          TODO Tehtävät, esim: Seuraavassa tehtävässä on tarkoitus opetella
          sointujas
        </p>
        <Paper>
          <div className="overall-container">
            <div className="left-container">
              <MusicSheet
                notation={this.state.notation}
                onlynotes={this.props.onlyNotes}
                onlysound={this.props.onlySound}
                engraverParams={this.props.engraverParams}
                playbuttonstyle={this.props.playButtonStyle}
              />
            </div>
            <div className="right-container">
              <div className="dropdowninterval1">
                <DropDownForAnswers
                  setStudentsAnswer={this.setAnswerRoot}
                  answers={roots}
                  label="Valitse vastaus"
                  selectedIndex={this.state.answerRoot}
                  borderColor={
                    this.state.answerWasSubmitted
                      ? this.answerRootIsCorrect()
                        ? "green"
                        : "red"
                      : ""
                  }
                />
              </div>
              <div className="dropdowninterval2">
                <DropDownForAnswers
                  setStudentsAnswer={this.setAnswerTriad}
                  answers={triads}
                  label="Valitse vastaus"
                  selectedIndex={this.state.answerTriad}
                  borderColor={
                    this.state.answerWasSubmitted
                      ? this.answerTriadIsCorrect()
                        ? "green"
                        : "red"
                      : ""
                  }
                />
              </div>
              <div className="dropdowninterval3">
                <DropDownForAnswers
                  setStudentsAnswer={this.setAnswerTriad}
                  answers={triads}
                  label="Valitse vastaus"
                  selectedIndex={this.state.answerTriad}
                  borderColor={
                    this.state.answerWasSubmitted
                      ? this.answerTriadIsCorrect()
                        ? "green"
                        : "red"
                      : ""
                  }
                />
              </div>
              <div className="submitbuttoninterval">
                {this.state.answerWasSubmitted ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.nextExercise}
                  >
                    {this.state.answerWasCorrect
                      ? "Seuraava kysymys"
                      : "Aloita alusta"}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleClick("top")}
                  >
                    Lähetä vastaukset &nbsp;
                    <Icon>send</Icon>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Paper>
      </Fragment>
    )
  }
}

export default withSimpleErrorBoundary(IntervalExercise)
