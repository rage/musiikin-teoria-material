import React from "react"
import { Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import SelectionBar from "./SelectionBar"
import Loading from "../Loading"

import { roots, answerOptionsForRoots } from "../../util/music/roots"
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
    answerWasWrong: false,
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

  /**
   * Method to call when submit answer button is pressed.
   * @returns false if not all answers are selected, true if the answer was submitted
   */
  handleClick = placement => event => {
    if (
      typeof this.state.answerRoot !== "number" ||
      typeof this.state.answerScale !== "number"
    ) {
      return false
    }
    const { currentTarget } = event
    if (this.answerIsCorrect()) {
      this.props.onCorrect()
      this.nextExercise()
    } else {
      this.props.onIncorrect()
      this.setState(state => ({
        anchorEl: currentTarget,
        open: state.placement !== placement || !state.open,
        placement,
        answerWasWrong: true,
      }))
    }
    return true
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
      answerWasWrong: false,
      open: false,
      answerRoot: null,
      answerScale: null,
    })
  }

  render() {
    if (!this.state.render) {
      return <div>Loading</div>
    }

    const selectionOptions = [
      {
        setAnswer: this.setAnswerRootAndPitch,
        answers: answerOptionsForRoots,
        label: "Pohjasävel",
        selectedIndex: this.state.answerRoot,
        borderColor: this.state.answerWasWrong
          ? this.answerPitchIsCorrect()
            ? "green"
            : "red"
          : "",
      },
      {
        setAnswer: this.setAnswerScale,
        answers: this.props.scales,
        label: "Laatu",
        selectedIndex: this.state.answerScale,
        borderColor: this.state.answerWasWrong
          ? this.answerScaleIsCorrect()
            ? "green"
            : "red"
          : "",
      },
    ]

    return (
      <Loading loading={!this.state.render}>
        <CheckAnswerPopper
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          placement={this.state.placement}
          correctAnswer={
            // pass correct answer only after the answer was sent; otherwise the
            // student could read the correct answer using React Developer Tools
            this.state.answerWasWrong
              ? roots[this.state.correctRoot].label +
                " " +
                this.props.scales[this.state.correctScale].label.toLowerCase()
              : ""
          }
        />
        <Paper>
          <div className="overall-container">
            <MusicSheet
              notation={this.state.notation}
              onlynotes={this.props.onlyNotes}
              onlysound={this.props.onlySound}
              engraverParams={this.props.engraverParams}
              playbuttonstyle={this.props.playButtonStyle}
            />
            <SelectionBar
              options={selectionOptions}
              answerWasWrong={this.state.answerWasWrong}
              nextExerciseSet={this.nextExercise}
              handleClick={this.handleClick("top")}
            />
          </div>
        </Paper>
      </Loading>
    )
  }
}

export default withSimpleErrorBoundary(ScaleExercise)
