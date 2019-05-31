import React from "react"
import { Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import SelectionBar from "./SelectionBar"
import Loading from "../Loading"

import { roots, answerOptionsForRoots } from "../../util/music/roots"
import { triads } from "../../util/music/chords"
import { randomIntArray } from "../../util/random"

class ChordExercise extends React.Component {
  state = {
    render: false,
    anchorEl: null,
    open: false,
    placement: null,
    answerRoot: null, // index of array answerOptionsForRoots
    answerTriad: null, // index of array triads
    correctRoots: null, // array with indexes of array roots
    correctTriads: null, // array with indexes of array triads
    currentExercise: null, // index for correctRoots and correctTriads
    answerWasWrong: false,
  }

  async componentDidMount() {
    this.setState({ render: true })
    this.nextExerciseSet()
  }

  constructor(props) {
    super(props)
  }

  correctRoot = () => this.state.correctRoots[this.state.currentExercise]

  correctTriad = () => this.state.correctTriads[this.state.currentExercise]

  answerPitchIsCorrect = () =>
    roots[this.correctRoot()].pitch ===
    answerOptionsForRoots[this.state.answerRoot].pitch

  answerTriadIsCorrect = () => this.correctTriad() === this.state.answerTriad

  answerIsCorrect = () =>
    this.answerPitchIsCorrect() && this.answerTriadIsCorrect()

  /**
   * Method to call when submit answer button is pressed.
   * @returns false if not all answers are selected, true if the answer was submitted
   */
  handleClick = placement => event => {
    if (
      typeof this.state.answerRoot !== "number" ||
      typeof this.state.answerTriad !== "number"
    ) {
      return false
    }
    const { currentTarget } = event
    if (this.answerIsCorrect()) {
      this.props.onCorrect()
      // check that this wasn't the last exercise in the set
      if (this.state.currentExercise < this.props.requiredAnswers - 1)
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

  setAnswerRoot = studentsAnswer =>
    this.setState({
      answerRoot: studentsAnswer,
    })

  setAnswerTriad = studentsAnswer =>
    this.setState({
      answerTriad: studentsAnswer,
    })

  setExercise = (
    currentExercise,
    correctRoots = this.state.correctRoots,
    correctTriads = this.state.correctTriads,
  ) => {
    const notation = triads[correctTriads[currentExercise]].notation(
      roots[correctRoots[currentExercise]],
    )
    this.setState({
      notation,
      answerWasWrong: false,
      open: false,
      answerRoot: null,
      answerTriad: null,
      correctRoots,
      correctTriads,
      currentExercise,
    })
  }

  nextExerciseSet = () => {
    const correctRoots = randomIntArray(
      0,
      roots.length,
      this.props.requiredAnswers,
    )
    const correctTriads = randomIntArray(
      0,
      triads.length,
      this.props.requiredAnswers,
    )
    this.setExercise(0, correctRoots, correctTriads)
  }

  nextExercise = () => this.setExercise(this.state.currentExercise + 1)

  render() {
    const selectionOptions = [
      {
        setAnswer: this.setAnswerRoot,
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
              ? roots[this.correctRoot()].label +
                " " +
                triads[this.correctTriad()].label.toLowerCase()
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
              nextExerciseSet={this.nextExerciseSet}
              handleClick={this.handleClick("top")}
            />
          </div>
        </Paper>
      </Loading>
    )
  }
}

export default withSimpleErrorBoundary(ChordExercise)
