import React from "react"
import { Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import SelectionBar from "./SelectionBar"
import Loading from "../Loading"

import { roots } from "../../util/music/roots"
import {
  intervalLabels,
  createRandomInterval,
} from "../../util/music/intervals"
import { qualities } from "../../util/music/qualities"

import { randomInt } from "../../util/random"

class IntervalExercise extends React.Component {
  state = {
    render: false,
    anchorEl: null,
    open: false,
    placement: null,
    answerPitch: null, //pitch from class Root
    answerInterval: undefined,
    answerQuality: undefined,
    correctRoot: undefined, //index of array roots
    correctInterval: undefined,
    correctQuality: undefined,
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

  answerIntervalIsCorrect = () =>
    this.state.correctInterval === this.state.answerInterval

  answerQualityIsCorrect = () =>
    this.state.correctQuality === this.state.answerQuality

  answerIsCorrect = () =>
    this.answerIntervalIsCorrect() && this.answerQualityIsCorrect()

  /**
   * Method to call when submit answer button is pressed.
   * @returns false if not all answers are selected, true if the answer was submitted
   */
  handleClick = placement => event => {
    if (
      typeof this.state.answerInterval !== "number" ||
      typeof this.state.answerQuality !== "number"
    ) {
      return false
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
        answerWasCorrect: this.answerIsCorrect(),
      }))
    }
    return true
  }

  setAnswerInterval = studentsAnswer => {
    this.setState({
      answerInterval: studentsAnswer,
    })
  }

  setAnswerQuality = studentsAnswer => {
    this.setState({
      answerQuality: studentsAnswer,
    })
  }

  nextExercise = () => {
    const correctRoot = randomInt(0, roots.length)
    const interval = createRandomInterval()
    const correctInterval = interval.number - 1 // Number is one higher than index
    const correctQuality = qualities.indexOf(interval.quality)

    const notation = interval.notation(roots[correctRoot])

    this.setState({
      correctRoot,
      correctInterval,
      correctQuality,
      notation,
      answerWasSubmitted: false,
      answerWasCorrect: false,
      open: false,
      answerInterval: null,
      answerQuality: null,
    })
  }

  render() {
    const selectionOptions = [
      {
        setAnswer: this.setAnswerInterval,
        answers: intervalLabels.map(label => {
          return { label: label }
        }),
        label: "Intervalli",
        selectedIndex: this.state.answerInterval,
        borderColor: this.state.answerWasSubmitted
          ? this.answerIntervalIsCorrect()
            ? "green"
            : "red"
          : "",
      },
      {
        setAnswer: this.setAnswerQuality,
        answers: qualities,
        label: "Laatu",
        selectedIndex: this.state.answerQuality,
        borderColor: this.state.answerWasSubmitted
          ? this.answerQualityIsCorrect()
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
          isCorrect={this.state.answerWasCorrect}
          correctAnswer={
            // pass correct answer only after the answer was sent; otherwise the
            // student could read the correct answer using React Developer Tools
            this.state.answerWasSubmitted
              ? roots[this.state.correctRoot].label +
                " " +
                qualities[this.state.correctQuality].label.toLowerCase() +
                " " +
                intervalLabels[this.state.correctInterval]
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
              answerWasSubmitted={this.state.answerWasSubmitted}
              nextExercise={this.nextExercise}
              handleClick={this.handleClick("top")}
            />
          </div>
        </Paper>
      </Loading>
    )
  }
}

export default withSimpleErrorBoundary(IntervalExercise)
