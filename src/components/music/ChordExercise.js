import React from "react"
import { Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import SelectionBar from "./SelectionBar"
import Loading from "../Loading"

import { roots, answerOptionsForRoots } from "../../util/music/roots"
import { triads } from "../../util/music/chords"
import { randomInt } from "../../util/random"

class ChordExercise extends React.Component {
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
    const notation = triads[correctTriad].notation(roots[correctRoot])

    this.setState({
      correctPitch,
      correctRoot,
      correctTriad,
      notation,
      answerWasWrong: false,
      open: false,
      answerPitch: null,
      answerRoot: null,
      answerTriad: null,
    })
  }

  render() {
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
        setAnswer: this.setAnswerTriad,
        answers: triads,
        label: "Laatu",
        selectedIndex: this.state.answerTriad,
        borderColor: this.state.answerWasWrong
          ? this.answerTriadIsCorrect()
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
                triads[this.state.correctTriad].label.toLowerCase()
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
              nextExercise={this.nextExercise}
              handleClick={this.handleClick("top")}
            />
          </div>
        </Paper>
      </Loading>
    )
  }
}

export default withSimpleErrorBoundary(ChordExercise)
