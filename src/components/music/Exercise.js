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
    popper: {
      open: false,
      placement: undefined,
      anchorEl: undefined,
      message: null,
    },

    // Answer given by student, parts are set in setAnswer.
    // Contains index numbers.
    givenAnswer: {},
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
    this.nextExerciseSet()
  }

  constructor(props) {
    super(props)
  }

  /**
   * Method to call when submit answer button is pressed.
   */
  onSubmit = clickEvent => {
    const { currentTarget } = clickEvent

    const givenAnswer = this.state.givenAnswer
    const correctAnswer = this.state.exerciseSet.exercises[
      this.state.currentExerciseIndex
    ]

    const correct = this.isAnswerCorrect()
    const payload = this.props.exerciseKind.makeAnswerPayload(
      givenAnswer,
      correctAnswer,
      correct,
    )

    if (correct) {
      this.props.onCorrect(payload)
      if (
        this.state.currentExerciseIndex + 1 <
        this.state.exerciseSet.exercises.length
      )
        this.nextExercise()
    } else {
      this.props.onIncorrect(payload)
      // pass correct answer only after the answer was sent; otherwise the
      // student could read the correct answer using React Developer Tools
      const message = (
        <>
          Vastauksesi ei ollut oikein.
          <br />
          {"Kyseessä oli " +
            this.props.exerciseKind.readableAnswerString(correctAnswer) +
            "."}
        </>
      )
      this.setState(oldState => ({
        popper: {
          anchorEl: currentTarget,
          open: oldState.popper.placement !== "top" || !oldState.popper.open,
          placement: "top",
          message,
        },
        answerWasSubmitted: true,
      }))
    }
  }

  /**
   * Check that the given answer is correct
   */
  isAnswerCorrect = () => {
    const givenAnswer = this.state.givenAnswer
    const correctAnswer = this.state.exerciseSet.exercises[
      this.state.currentExerciseIndex
    ]

    const answerKeysThatAreCorrect = this.props.exerciseKind.getCorrectAnswerKeys(
      givenAnswer,
      correctAnswer,
    )

    return this.state.exerciseSet.answerKeys.every(key =>
      answerKeysThatAreCorrect.includes(key),
    )
  }

  /**
   * Function to create a setAnswer function for a dropdown
   * @param {*} answerOption Key in this.state.exerciseSet.answerKeys
   * @returns A function that sets given answer to the correct key in this.state.answer
   */
  setAnswer = answerOption => selectedOptionIndex => {
    const givenAnswer = this.state.givenAnswer
    givenAnswer[answerOption] = selectedOptionIndex
    this.setState({ givenAnswer })
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
      popper: { open: false },
      answerWasSubmitted: false,
      givenAnswer: {},
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
      popper: { open: false },
      answerWasSubmitted: false,
      givenAnswer: {},
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
      this.state.givenAnswer,
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
        selectedIndex: this.state.givenAnswer[key],
        answerIsCorrect,
      }
    })

    return (
      <Loading loading={!this.state.render}>
        <CheckAnswerPopper options={this.state.popper} />
        <Paper>
          <div className="overall-container">
            <MusicSheet
              notation={correctAnswer.notation}
              onlynotes={this.props.onlyNotes}
              onlysound={this.props.onlySound}
              engraverParams={this.props.exerciseKind.getEngraverParams()}
              playButtonStyle={"playButton"}
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
