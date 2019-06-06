import React from "react"
import PropTypes from "prop-types"
import { Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

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
  onSubmit = clickEvent => {
    const { currentTarget } = clickEvent

    const answer = this.state.answer
    const correctAnswer = this.state.exerciseSet.exercises[
      this.state.currentExerciseIndex
    ]

    const correct = this.isAnswerCorrect()
    const payload = this.props.exerciseKind.makeAnswerPayload(
      answer,
      correctAnswer,
      correct,
    )

    if (correct) {
      this.props.onCorrect(payload)
      if (this.state.currentExerciseIndex + 1 < this.state.exerciseSet.length)
        this.nextExercise()
    } else {
      this.props.onIncorrect(payload)
      this.setState(state => ({
        anchorEl: currentTarget,
        open: state.placement !== "top" || !state.open,
        placement: "top",
        answerWasSubmitted: true,
      }))
    }
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

    const selectionOptions = exerciseSet.answerKeys.map(key => {
      const answerOptions = exerciseSet.answerOptions[key]

      const answerIsCorrect = this.state.answerWasSubmitted
        ? answerKeysThatAreCorrect.includes(key)
          ? true
          : false
        : null

      return {
        setAnswer: this.setAnswer(key),
        answers: answerOptions,
        label: exerciseSet.answerLabels[key],
        selectedIndex: this.state.answer[key],
        answerIsCorrect,
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
              onSubmit={this.onSubmit}
            />
          </div>
        </Paper>
      </Loading>
    )
  }
}

Exercise.propTypes = {
  exerciseKind: PropTypes.object.isRequired,
  requiredAnswers: PropTypes.number.isRequired,
  onCorrect: PropTypes.func.isRequired,
  onIncorrect: PropTypes.func.isRequired,
  onlyNotes: PropTypes.bool,
  onlySound: PropTypes.bool,
}

export default withSimpleErrorBoundary(Exercise)
