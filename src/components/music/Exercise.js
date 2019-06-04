import React from "react"
import { Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import SelectionBar from "./SelectionBar"
import Loading from "../Loading"

class Exercise extends React.Component {
  state = {
    render: false,

    open: false,
    placement: undefined,

    answer: {},
    exerciseSet: {
      answerKeys: undefined,
      answerOptions: {},
      exercises: [],
    },
    currentExerciseIndex: 0,

    answerWasSubmitted: false,
  }

  componentDidMount() {
    this.setState({ render: true })
    this.nextExerciseSet()
  }

  constructor(props) {
    super(props)
  }

  /**
   * Method to call when submit answer button is pressed.
   * @returns false if not all answers are selected, true if the answer was submitted
   */
  handleClick = placement => event => {
    if (!this.isAnswerSet()) {
      return false
    }
    const { currentTarget } = event
    if (this.isAnswerCorrect()) {
      this.props.onCorrect()
      this.nextExercise()
    } else {
      this.props.onIncorrect()
      this.setState(state => ({
        anchorEl: currentTarget,
        open: state.placement !== placement || !state.open,
        placement,
        answerWasSubmitted: true,
      }))
    }
    return true
  }

  isAnswerSet = () => {
    return (
      this.state.exerciseSet.answerKeys.length ===
      Object.keys(this.state.answer).length
    )
  }

  isAnswerCorrect = () => {
    const answer = this.state.answer
    const correctAnswer = this.state.exerciseSet.exercises[
      this.state.currentExerciseIndex
    ]

    const answerKeysThatAreCorrect = this.props.exerciseKind.getCorrectAnswerKeys(
      answer,
      correctAnswer,
    )

    return this.state.exerciseSet.answerKeys.every(answer =>
      answerKeysThatAreCorrect.includes(answer),
    )
  }

  // <Dropdown setAnswer("root") /> in Dropwdown: setAnswer(studentAnswer)
  setAnswer = answerOption => studentAnswer => {
    const answer = this.state.answer
    answer[answerOption] = studentAnswer
    this.setState({ answer })
  }

  nextExerciseSet = () => {
    this.setState({
      currentExerciseIndex: 0,
      exerciseSet: this.props.exerciseKind.generateExerciseSet(
        this.props.requiredAnswers,
      ),
      render: true,
      open: false,
      answerWasSubmitted: false,
      answer: {},
    })
  }

  nextExercise = () => {
    this.setState({
      currentExerciseIndex: this.state.currentExerciseIndex + 1,
      open: false,
      answerWasSubmitted: false,
      answer: {},
    })
  }

  render() {
    if (!this.state.render) {
      return null
    }

    const exerciseSet = this.state.exerciseSet
    const correctAnswer = exerciseSet.exercises[this.state.currentExerciseIndex]

    const selectionOptions = exerciseSet.answerKeys.map(key => {
      const answerOptions = exerciseSet.answerOptions[key]

      const answerKeysThatAreCorrect = this.props.exerciseKind.getCorrectAnswerKeys(
        this.state.answer,
        correctAnswer,
      )

      return {
        setAnswer: this.setAnswer(key),
        answers: answerOptions,
        label: exerciseSet.answerLabels[key],
        selectedIndex: this.state.answer[key],
        borderColor: this.state.answerWasSubmitted
          ? answerKeysThatAreCorrect.includes(key)
            ? "green"
            : "red"
          : "",
      }
    })

    return (
      <Loading loading={!this.state.render}>
        <CheckAnswerPopper
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          placement={this.state.placement}
          correctAnswer={
            // pass correct answer only after the answer was sent; otherwise the
            // student could read the correct answer using React Developer Tools
            this.state.answerWasSubmitted
              ? this.props.exerciseKind.readableAnswerString(correctAnswer)
              : ""
          }
        />
        <Paper>
          <div className="overall-container">
            <MusicSheet
              notation={correctAnswer.notation}
              onlynotes={this.props.onlyNotes}
              onlysound={this.props.onlySound}
              engraverParams={this.props.exerciseKind.getEngraverParams()}
              playbuttonstyle={"playButton"}
            />
            <SelectionBar
              options={selectionOptions}
              answerWasWrong={this.state.answerWasSubmitted}
              nextExerciseSet={this.nextExerciseSet}
              handleClick={this.handleClick("top")}
            />
          </div>
        </Paper>
      </Loading>
    )
  }
}

export default withSimpleErrorBoundary(Exercise)
