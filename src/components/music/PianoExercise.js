import React from "react"
import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import {
  Paper,
  Button,
  ButtonGroup,
  Icon,
  Collapse,
  Divider,
  Typography,
} from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import { concatenateNotes } from "../../util/music/intervals"
import Piano from "./Piano"
import Loading from "../Loading"
import Scale from "./Scale"

class PianoExercise extends React.Component {
  state = {
    render: false,

    // For "wrong answer" popper
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

    const givenAnswer = this.state.notes.map(n => n.pitch)
    const correctAnswer = this.props.exerciseKind.isTriadCorrect(
      this.state.exerciseSet.exercises[this.state.currentExerciseIndex],
    )

    const correct = this.isAnswerCorrect(givenAnswer, correctAnswer)
    const payload = this.props.exerciseKind.makePianoAnswerPayload(
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
      // remove the following row when "Aloita alusta" nappi is implemented
      this.nextExerciseSet()
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

    //Add the same note only once
    if (notes.map(n => n.notation).includes(note.notation)) return

    notes.push(note)
    this.setState({ notes })
  }

  undoNote = () => {
    const notes = this.state.notes
    notes.pop()
    this.setState({ notes })
  }

  clearNotes = () => this.setState({ notes: [] })

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
          <br />
          <Typography variant="subtitle1" align="center">
            Muodosta pianon avulla <b>{currentExerciseAsString}</b>{" "}
            kolmisointuna
          </Typography>
          <br />
          <Divider light />
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
              engraverParams={new Scale().getEngraverParams()}
              playButtonStyle={"playButtonPiano"}
            />
            <div className="dropDown1">
              <Button
                variant="outlined"
                onClick={this.handleChange}
                style={{
                  width: 150,
                  justifyContent: "space-between",
                }}
              >
                {this.state.checked ? "Piilota piano" : "Näytä piano"}
                <Icon>
                  {this.state.checked ? "expand_less" : "expand_more"}
                </Icon>
              </Button>
            </div>
            <div className="dropDown2">
              <ButtonGroup aria-label="Undo / Clear buttons">
                <Button title="Peruuta" onClick={this.undoNote}>
                  <Icon>undo</Icon>
                </Button>
                <Button title="Tyhjennä" onClick={this.clearNotes}>
                  <Icon>delete</Icon>
                </Button>
              </ButtonGroup>
            </div>
            <div className="submitButton">
              <Button
                variant="contained"
                color="primary"
                onClick={this.onSubmit}
              >
                Lähetä &nbsp;
                <Icon fontSize="small">send</Icon>
              </Button>
            </div>
          </div>
          <Collapse in={this.state.checked}>
            <Piano appendNote={this.appendNote} />
          </Collapse>
        </Paper>
      </Loading>
    )
  }
}

export default withSimpleErrorBoundary(PianoExercise)
