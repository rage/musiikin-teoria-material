import React, { Fragment } from "react"
import { Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import SelectionBar from "./SelectionBar"
import { roots, answerOptionsForRoots, triads } from "../../util/musicUtils"
import { randomInt } from "../../util/random"

class ScaleExercise extends React.Component {
  state = {
    render: false,
    anchorEl: null,
    open: false,
    placement: null,
    answerRoot: null, //index of array answerOptionsForRoots
    answerPitch: null, //pitch from class Root
    answerTriad: null, //index of array triads
    correctRoot: null, //index of array roots
    correctPitch: null, //pitch from class Root
    correctTriad: null, //index of array triads
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

  answerTriadIsCorrect = () =>
    this.state.correctTriad === this.state.answerTriad

  answerIsCorrect = () =>
    this.answerPitchIsCorrect() && this.answerTriadIsCorrect()

  handleClick = placement => event => {
    if (
      typeof this.state.answerRoot !== "number" ||
      typeof this.state.answerTriad !== "number"
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

  setAnswerTriad = studentsAnswer => {
    this.setState({
      answerTriad: studentsAnswer,
    })
  }

  nextExercise = () => {
    const correctRoot = randomInt(0, roots.length)
    const correctPitch = roots[correctRoot].pitch
    const correctTriad = randomInt(0, triads.length)
    // const notation = triads[correctTriad].notation(roots[correctRoot])
    const notation = "ACGDEAEGFDFGADC"

    this.setState({
      correctRoot,
      correctPitch,
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

    const selectionOptions = [
      {
        className: "scaleDropdown1",
        setAnswer: this.setAnswerRootAndPitch,
        answers: roots,
        label: "Pohjasävel",
        selectedIndex: this.state.answerRoot,
        bordercolor: this.state.answerWasSubmitted
          ? this.answerRootIsCorrect()
            ? "green"
            : "red"
          : "",
      },
      {
        className: "scaleDropdown2",
        setAnswer: this.setAnswerTriad,
        answers: triads,
        label: "Laatu",
        selectedIndex: this.state.answerTriad,
        bordercolor: this.state.answerWasSubmitted
          ? this.answerTriadIsCorrect()
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
                triads[this.state.correctTriad].label.toLowerCase()
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
