import React, { Fragment } from "react"
import { Button, Icon, Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import DropDownForAnswers from "./DropDownForAnswers"
import { roots, answerOptionsForRoots } from "../../util/musicUtils"
import { randomInt } from "../../util/random"

class ScaleExercise extends React.Component {
  state = {
    render: false,
    anchorEl: null,
    open: false,
    placement: null,
    answerRoot: null, //index of array answerOptionsForRoots
    answerPitch: null, //pitch from class Root
    answerScale: null, //index of array scales or modes
    correctRoot: null, //index of array roots
    correctPitch: null, //pitch from class Root
    correctScale: null, //index of array scales or modes
    answerWasSubmitted: false,
    answerWasCorrect: false,
  }

  async componentDidMount() {
    this.setState({ render: true })
    this.nextExercise()
  }

  constructor(props) {
    super(props)
  }

  answerPitchIsCorrect = () =>
    this.state.correctPitch === this.state.answerPitch

  answerScaleIsCorrect = () =>
    this.state.correctScale === this.state.answerScale

  answerIsCorrect = () =>
    this.answerPitchIsCorrect() && this.answerScaleIsCorrect()

  handleClick = placement => event => {
    if (
      typeof this.state.answerRoot !== "number" ||
      typeof this.state.answerScale !== "number"
    ) {
      return
    }
    const { currentTarget } = event
    const answerWasCorrect = this.answerIsCorrect()
    if (answerWasCorrect) {
      this.props.onCorrect()
      this.nextExercise()
    } else {
      this.props.onIncorrect()
      this.setState(state => ({
        anchorEl: currentTarget,
        open: state.placement !== placement || !state.open,
        placement,
        answerWasSubmitted: true,
        answerWasCorrect,
      }))
    }
  }

  setAnswerRootAndPitch = studentsAnswer => {
    const answerPitch = answerOptionsForRoots[studentsAnswer].pitch
    const answerRoot = studentsAnswer
    this.setState({
      answerPitch,
      answerRoot,
    })
  }

  setAnswerScale = studentsAnswer => {
    this.setState({
      answerScale: studentsAnswer,
    })
  }

  nextExercise = () => {
    const scales = this.props.scales
    const correctRoot = randomInt(0, roots.length)
    const correctPitch = roots[correctRoot].pitch
    const correctScale = randomInt(0, scales.length)
    const notation = scales[correctScale].notation(roots[correctRoot])

    this.setState({
      correctRoot,
      correctPitch,
      correctScale,
      notation,
      answerWasSubmitted: false,
      answerWasCorrect: false,
      open: false,
      answerRoot: null,
      answerScale: null,
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
          correctAnswer={
            // pass correct answer only after the answer was sent; otherwise the
            // student could read the correct answer using React Developer Tools
            this.state.answerWasSubmitted
              ? roots[this.state.correctRoot].label +
                " " +
                this.props.scales[this.state.correctScale].label.toLowerCase()
              : ""
          }
        />
        <Paper>
          <div className="overall-container-two">
            <MusicSheet
              notation={this.state.notation}
              onlynotes={this.props.onlyNotes}
              onlysound={this.props.onlySound}
              engraverParams={this.props.engraverParams}
              playbuttonstyle={this.props.playButtonStyle}
            />
            <div className="scaleDropdown1">
              <DropDownForAnswers
                setStudentsAnswer={this.setAnswerRootAndPitch}
                answers={answerOptionsForRoots}
                label="Pohjasävel"
                selectedIndex={this.state.answerRoot}
                borderColor={
                  this.state.answerWasSubmitted
                    ? this.answerPitchIsCorrect()
                      ? "green"
                      : "red"
                    : ""
                }
              />
            </div>
            <div className="scaleDropdown2">
              <DropDownForAnswers
                setStudentsAnswer={this.setAnswerScale}
                answers={this.props.scales}
                label="Laatu"
                selectedIndex={this.state.answerScale}
                borderColor={
                  this.state.answerWasSubmitted
                    ? this.answerScaleIsCorrect()
                      ? "green"
                      : "red"
                    : ""
                }
              />
            </div>
            <div className="scaleSubmitbutton">
              {this.state.answerWasSubmitted ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.nextExercise}
                >
                  Aloita alusta
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
        </Paper>
      </Fragment>
    )
  }
}

export default withSimpleErrorBoundary(ScaleExercise)
