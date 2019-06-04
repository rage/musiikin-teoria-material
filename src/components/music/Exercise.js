import React from "react"
import { Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import CorrectIcon from "@material-ui/icons/CheckCircle"
import ErrorIcon from "@material-ui/icons/Error"
import green from "@material-ui/core/colors/green"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import SelectionBar from "./SelectionBar"
import Loading from "../Loading"

class Exercise extends React.Component {
  state = {
    render: false,

    // For "wrong answer" popper
    open: false,
    placement: undefined,

    // Answer given by student, parts are set in setAnswer.
    // Contains index numbers.
    answer: {},
    // Correct answers generated based on props.exerciseKind
    exerciseSet: {
      // Keys that define how the answer, options and correct answers
      // are formatted, eg. ["root", "triad"]
      answerKeys: undefined,
      // All possible options for each answer eg {root: [], triad: []}
      answerOptions: {},
      // Correct answers for each exercise
      exercises: [],
    },
    // Current exercise in exerciseSet.exercises
    currentExerciseIndex: 0,

    // When the user clicks "Send answer"
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

  /**
   * Check that all needed answers are set in this.state.answer
   */
  isAnswerSet = () => {
    return (
      this.state.exerciseSet.answerKeys.length ===
      Object.keys(this.state.answer).length
    )
  }

  /**
   * Check that the given answer is correct
   */
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

  /**
   * Function to create a setAnswer function for a dropdown
   * @param {*} answerOption Key in this.state.exerciseSet.answerKeys
   * @returns A function that sets given answer to the correct key in this.state.answer
   */
  setAnswer = answerOption => studentAnswer => {
    const answer = this.state.answer
    answer[answerOption] = studentAnswer
    this.setState({ answer })
  }

  /**
   * Generate new set of exercises and reset answer
   */
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

  /**
   * Take next exercise from the exercise set and reset answer
   *
   * Duplicate code can not be removed (Similar above), because
   * multiple setState calls within same method cause overrides
   */
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
    // answerKeys that were same in answer and correctAnswer
    const answerKeysThatAreCorrect = this.props.exerciseKind.getCorrectAnswerKeys(
      this.state.answer,
      correctAnswer,
    )

    const correctIndicators = {
      borderColor: "green",
      icon: <CorrectIcon style={{ color: green[600] }} />,
    }

    const errorIndicators = {
      borderColor: "red",
      icon: <ErrorIcon color="error" />,
    }

    const noIndicators = {
      borderColor: "",
      icon: null,
    }

    const selectionOptions = exerciseSet.answerKeys.map(key => {
      const answerOptions = exerciseSet.answerOptions[key]

      const correctnessIndicators = this.state.answerWasSubmitted
        ? answerKeysThatAreCorrect.includes(key)
          ? correctIndicators
          : errorIndicators
        : noIndicators

      return {
        setAnswer: this.setAnswer(key),
        answers: answerOptions,
        label: exerciseSet.answerLabels[key],
        selectedIndex: this.state.answer[key],
        borderColor: correctnessIndicators.borderColor,
        icon: correctnessIndicators.icon,
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
