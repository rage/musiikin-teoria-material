import React from "react"
import PropTypes from "prop-types"
import MusicSheet from "../../partials/MusicSheet"
import { Paper, Button, Icon } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import { concatenateNotes } from "../../util/music/intervals"
import Piano from "./Piano"
import Scale from "./Scale"

class PianoExercise extends React.Component {
  state = {
    render: false,

    // For "wrong answer" popper
    popper: {
      open: false,
      placement: undefined,
      anchorEl: undefined,
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

    // Array of strings, each string is a note in abc notation
    notes: [],
  }

  componentDidMount() {
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
      this.setState(oldState => ({
        popper: {
          anchorEl: currentTarget,
          open: oldState.popper.placement !== "top" || !oldState.popper.open,
          placement: "top",
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

  appendNote = note => {
    const notes = this.state.notes
    notes.push(note)
    this.setState({ notes })
  }

  render() {
    return (
      <Paper>
        <div className="overall-container">
          <MusicSheet
            notation={
              this.state.notes.length
                ? "L:1/1\n[" + concatenateNotes(this.state.notes) + "]"
                : "L:1/1\nz"
            }
            onlynotes={this.props.onlyNotes}
            onlysound={this.props.onlySound}
            engraverParams={new Scale().getEngraverParams()}
            playButtonStyle={"playButton"}
          />
          <div className="submitButton">
            <Button variant="contained" color="primary" onClick={this.onClick}>
              Lähetä &nbsp;
              <Icon fontSize="small">send</Icon>
            </Button>
          </div>
        </div>
        <Piano appendNote={this.appendNote} />
      </Paper>
    )
  }
}

export default withSimpleErrorBoundary(PianoExercise)
