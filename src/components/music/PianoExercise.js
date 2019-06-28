import React from "react"
import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import { Paper, Button, Icon } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import { notes as notesByPitch } from "../../util/music/roots"
import { convertMidiNumberToNote } from "../../util/music/pianoToNotation"
import Piano from "./Piano"
import Loading from "../Loading"
import SubmitButton from "./SubmitButton"
import ExerciseInstruction from "./ExerciseInstruction"
import styled from "styled-components"
import { MidiSoundContext } from "../../contexes/MidiSoundContext"

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

    windowWidth: undefined,
  }

  componentDidMount() {
    this.nextExerciseSet()
    window.addEventListener("resize", () =>
      this.setState({ windowWidth: window.innerWidth }),
    )
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () =>
      this.setState({ windowWidth: window.innerWidth }),
    )
  }

  constructor(props) {
    super(props)
  }

  /**
   * Method to call when submit answer button is pressed.
   */
  onSubmit = clickEvent => {
    const { currentTarget } = clickEvent

    if (this.onPlaying) this.onPlaying(false)

    // Functions from ExerciseKind (Chord, Interval, Scale)
    const {
      getNoteLimits,
      isPianoAnswerCorrect,
      makePianoAnswerPayload,
      getAnswerAsNotes,
      readableAnswerString,
    } = this.props.exerciseKind

    const minNotes = getNoteLimits().min
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

    const givenAnswer = this.state.notes
    const currentExercise = this.state.exerciseSet.exercises[
      this.state.currentExerciseIndex
    ]

    const correct = isPianoAnswerCorrect(givenAnswer, currentExercise)
    const payload = makePianoAnswerPayload(
      this.state.notes,
      getAnswerAsNotes(currentExercise),
      readableAnswerString(currentExercise),
      correct,
    )

    if (correct) {
      this.props.onCorrect(payload)
      if (
        this.state.currentExerciseIndex + 1 <
        this.state.exerciseSet.exercises.length
      ) {
        setTimeout(() => {
          // Show checkmark
          this.setState({ showCorrectOnButton: true })
          // Hide checkmark later
          setTimeout(() => {
            this.setState({ showCorrectOnButton: false })
          }, 1000)
        }, 100)
        this.nextExercise()
      }
    } else {
      this.props.onIncorrect(payload)
      this.setState(oldState => ({
        popper: {
          anchorEl: currentTarget,
          open: oldState.popper.placement !== "top" || !oldState.popper.open,
          placement: "top",
          message: (
            <>
              Vastauksesi ei ollut oikein. <br /> Oikea vastaus näkyy pianolla.
            </>
          ),
        },
        answerWasSubmitted: true,
      }))
    }
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

  appendNote = midiNumber => {
    if (this.state.answerWasSubmitted) {
      return // Don't add notes that display correct answer
    }

    const { notes } = this.state
    const { shouldAddNote, getAnswerAsNotes } = this.props.exerciseKind

    const currentExercise = this.state.exerciseSet.exercises[
      this.state.currentExerciseIndex
    ]

    // here decide how to write each of the 12 notes to the score
    // for example, should we write D# or Eb
    const notesForMidi = getAnswerAsNotes(currentExercise)
    const noteOptions = []
    // set the correct notation for the notes in the correct answer
    notesForMidi.forEach(note => (noteOptions[note.pitch] = note.zeroNotation))
    // set the default choice for the notes not in the correct answer
    for (let i = 0; i < notesByPitch.length; i++)
      if (!noteOptions[i]) noteOptions[i] = notesByPitch[i][0]
    const note = convertMidiNumberToNote(midiNumber, noteOptions)

    if (!shouldAddNote(note, notes)) return

    notes.push(note)
    this.setState({ notes, popper: { open: false } })
  }

  undoNote = () => {
    const notes = this.state.notes
    notes.pop()
    this.setState({ notes })
  }

  clearNotes = () => this.setState({ notes: [] })

  renderPiano = (isPlaying, answerMidiNotes) => {
    if (window.innerWidth > 1200) {
      return (
        <MarginInPaper>
          <Piano
            appendNote={this.appendNote}
            isPlaying={isPlaying}
            showNotes={answerMidiNotes}
          />
        </MarginInPaper>
      )
    } else {
      return (
        <Piano
          appendNote={this.appendNote}
          isPlaying={isPlaying}
          showNotes={answerMidiNotes}
        />
      )
    }
  }

  render() {
    if (!this.state.render) {
      return null
    }
    const currentExercise = this.state.exerciseSet.exercises[
      this.state.currentExerciseIndex
    ]

    const {
      getPianoInstructions,
      getEngraverParams,
      getAnswerAsNotes,
      getNotesAsNotation,
    } = this.props.exerciseKind

    const answerMidiNotes = this.state.answerWasSubmitted
      ? getAnswerAsNotes(currentExercise).map(note => note.midiNumber)
      : []

    return (
      <Loading loading={!this.state.render}>
        <MidiSoundContext.Consumer>
          {context => {
            this.onPlaying = context.onPlaying
            return (
              <>
                <CheckAnswerPopper options={this.state.popper} />
                <Paper>
                  <ExerciseInstruction>
                    <>{getPianoInstructions(currentExercise)}</>
                  </ExerciseInstruction>
                  <div className="overall-container">
                    <MusicSheet
                      onlynotes={this.props.onlyNotes}
                      onlysound={this.props.onlySound}
                      engraverParams={getEngraverParams()}
                      playButtonStyle={"playButton"}
                      isExercise
                    >
                      {this.state.notes.length
                        ? getNotesAsNotation(this.state.notes)
                        : "L:1/1\nz"}
                    </MusicSheet>
                    <div className="dropDown1">
                      <Button
                        disabled={
                          !this.state.notes.length ||
                          context.isPlaying ||
                          this.state.answerWasSubmitted
                        }
                        variant="outlined"
                        onClick={this.undoNote}
                      >
                        <Icon>undo</Icon> &nbsp;Peruuta
                      </Button>
                    </div>
                    <div className="dropDown2">
                      <Button
                        disabled={
                          !this.state.notes.length ||
                          context.isPlaying ||
                          this.state.answerWasSubmitted
                        }
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
                  {this.renderPiano(context.isPlaying, answerMidiNotes)}
                </Paper>
              </>
            )
          }}
        </MidiSoundContext.Consumer>
      </Loading>
    )
  }
}

const MarginInPaper = styled.div`
  padding: 1.5rem;
`

export default withSimpleErrorBoundary(PianoExercise)
