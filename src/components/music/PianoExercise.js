import React from "react"
import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import { Paper, Button, Icon } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import { concatenateNotes } from "../../util/music/intervals"
import Piano from "./Piano"
import Loading from "../Loading"
import SubmitButton from "./SubmitButton"
import ExerciseInstruction from "./ExerciseInstruction"

class PianoExercise extends React.Component {
  state = {
    render: false,

    // For "wrong answer" or "input x notes" popper
    popper: {
      open: false,
      placement: undefined,
      anchorEl: undefined,
      message: null,
    },
    showCorrectOnButton: false,
    checked: false,

    // Answer given by student, parts are set in setAnswer.
    // Contains pitch numbers.
    givenAnswer: [],
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

    // Array of objects; each note has a string, "notation", which is abc
    // notation, and a number "pitch", which is the note's pitch in the central
    // octave, meaning that pitches go from 0 (C) to 11 (B)
    notes: [],

    // Is midi playing (music on the staff), this is set in MusiSheet
    isPlaying: false,
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

    const minNotes = this.props.exerciseKind.getNoteLimits().min
    // don't accept a score with less then the minimum required amount of notes
    if (this.state.notes.length < minNotes) {
      this.setState({
        popper: {
          anchorEl: currentTarget,
          open: true,
          placement: "top",
          message: <>Syötä {minNotes} nuottia</>,
        },
      })
      return
    }

    const givenAnswer = this.state.notes.map(n => n.pitch)
    const currentExercise = this.state.exerciseSet.exercises[
      this.state.currentExerciseIndex
    ]
    const correctAnswer = this.props.exerciseKind.getAnswerAsNotes(
      currentExercise,
    )

    const correct = this.isAnswerCorrect(givenAnswer, correctAnswer)
    const payload = this.props.exerciseKind.makePianoAnswerPayload(
      this.state.notes,
      correctAnswer,
      this.props.exerciseKind.readableAnswerString(currentExercise),
      correct,
    )

    if (correct) {
      this.props.onCorrect(payload)
      if (
        this.state.currentExerciseIndex + 1 <
        this.state.exerciseSet.exercises.length
      )
        setTimeout(() => {
          // Show checkmark
          this.setState({ showCorrectOnButton: true })
          // Hide checkmark later
          setTimeout(() => {
            this.setState({ showCorrectOnButton: false })
          }, 1000)
        }, 100)
      this.nextExercise()
    } else {
      this.props.onIncorrect(payload)
      this.setState(oldState => ({
        popper: {
          anchorEl: currentTarget,
          open: oldState.popper.placement !== "top" || !oldState.popper.open,
          placement: "top",
          message: <>Vastauksesi ei ollut oikein.</>,
        },
        answerWasSubmitted: true,
      }))
    }
  }

  /**
   * Check that the given answer is correct
   */
  isAnswerCorrect = (givenAnswer, correctAnswer) => {
    if (givenAnswer.length === correctAnswer.length) {
      return correctAnswer.every(pitch => givenAnswer.includes(pitch))
    }
    return false
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
      notes: [],
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
      notes: [],
    })
  }

  handleChange = () => this.setState({ checked: !this.state.checked })

  appendNote = note => {
    const { notes } = this.state

    if (notes.length > this.props.exerciseKind.getNoteLimits().max) {
      return
    }

    //Add the same note only once
    if (notes.map(n => n.notation).includes(note.notation)) return

    notes.push(note)
    this.setState({ notes, popper: { open: false } })
  }

  undoNote = () => {
    const notes = this.state.notes
    notes.pop()
    this.setState({ notes })
  }

  clearNotes = () => this.setState({ notes: [] })

  setIsPlaying = status => {
    this.setState({ isPlaying: status })
  }

  render() {
    if (!this.state.render) {
      return null
    }
    const currentExercise = this.state.exerciseSet.exercises[
      this.state.currentExerciseIndex
    ]
    const currentExerciseAsString = this.props.exerciseKind.readableAnswerString(
      currentExercise,
    )

    return (
      <Loading loading={!this.state.render}>
        <CheckAnswerPopper options={this.state.popper} />
        <Paper>
          <ExerciseInstruction>
            <>
              Muodosta pianon avulla <b>{currentExerciseAsString}</b>{" "}
              kolmisointuna
            </>
          </ExerciseInstruction>
          <div className="overall-container">
            <MusicSheet
              notation={
                this.state.notes.length
                  ? "L:1/1\n[" +
                    concatenateNotes(this.state.notes.map(n => n.notation)) +
                    "]"
                  : "L:1/1\nz"
              }
              onlynotes={this.props.onlyNotes}
              onlysound={this.props.onlySound}
              engraverParams={this.props.exerciseKind.getEngraverParams()}
              playButtonStyle={"playButtonPiano"}
              isPlaying={this.state.isPlaying}
              onPlayStatusUpdate={this.setIsPlaying}
            />
            <div className="dropDown1">
              <Button
                disabled={!this.state.notes.length}
                variant="outlined"
                onClick={this.undoNote}
              >
                <Icon>undo</Icon> &nbsp;Peruuta
              </Button>
            </div>
            <div className="dropDown2">
              <Button
                disabled={!this.state.notes.length}
                variant="outlined"
                title="Tyhjennä"
                onClick={this.clearNotes}
              >
                <Icon>delete</Icon> Tyhjennä
              </Button>
            </div>
            <SubmitButton
              showCorrectOnButton={this.state.showCorrectOnButton}
              answerWasWrong={this.state.answerWasSubmitted}
              nextExerciseSet={this.nextExerciseSet}
              onClick={this.onSubmit}
              isPiano={true}
            />
          </div>
          <Piano
            appendNote={this.appendNote}
            isPlaying={this.state.isPlaying}
          />
        </Paper>
      </Loading>
    )
  }
}

export default withSimpleErrorBoundary(PianoExercise)
