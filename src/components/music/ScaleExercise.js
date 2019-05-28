import React, { Fragment } from "react"
import { Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import SelectionBar from "./SelectionBar"
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

    const selectionOptions = [
      {
        className: "scaleDropdown1",
        setAnswer: this.setAnswerRootAndPitch,
        answers: answerOptionsForRoots,
        label: "Pohjasävel",
        selectedIndex: this.state.answerRoot,
        borderColor: this.state.answerWasSubmitted
          ? this.answerPitchIsCorrect()
            ? "green"
            : "red"
          : "",
      },
      {
        className: "scaleDropdown2",
        setAnswer: this.setAnswerScale,
        answers: this.props.scales,
        label: "Laatu",
        selectedIndex: this.state.answerScale,
        borderColor: this.state.answerWasSubmitted
          ? this.answerScaleIsCorrect()
            ? "green"
            : "red"
          : "",
      },
    ]

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
            <SelectionBar
              options={selectionOptions}
              answerWasSubmitted={this.state.answerWasSubmitted}
              nextExercise={this.nextExercise}
              handleClick={this.handleClick("top")}
            />
          </div>
        </Paper>
      </Fragment>
    )
  }
}

export default withSimpleErrorBoundary(ScaleExercise)
