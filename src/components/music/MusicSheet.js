import React from "react"
import PropTypes from "prop-types"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import { MidiSoundContext } from "../../contexes/MidiSoundContext"
import Fab from "@material-ui/core/Fab"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import Loading from "../Loading"
import CircularProgress from "@material-ui/core/CircularProgress"

/**
 * In charge of rendering Music Sheet notes and play button based on parameters passed to it.
 *
 * Use src/partials/MusicSheet when using MusicSheet inside other components
 */
class MusicSheet extends React.Component {
  static contextType = MidiSoundContext

  constructor(props) {
    super(props)

    this.state = {
      render: false,
      id: "music-midi-" + Math.floor(Math.random() * 10000),
      renderNotes: props.renderNotes ? true : false,
      renderSound: props.renderSound ? true : false,
      abcjs: undefined,
      abcjsMidi: undefined,
      abcRendered: false,
    }
  }

  componentDidMount() {
    // react-abc can not be imported directly since it uses
    // abcjs that is a non react library.
    // abcjs attempts to use DOM api that is not available when
    // gatsby runs build, so it's server side rendering had to be
    // disabled.
    // -> Dynamic import is used instead.
    import("abcjs/midi").then(abcjsMidi => {
      this.setState({ render: true, abcjsMidi })
    })
  }

  componentDidUpdate(prevProps) {
    if (this.state.render) {
      if (
        !this.state.abcRendered ||
        prevProps.notation !== this.props.notation
      ) {
        this.state.abcjsMidi.renderAbc(this.notes, this.props.notation, {
          ...this.props.engraverParams,
        })
        this.state.abcjsMidi.renderMidi(this.midi, this.props.notation, {})
        this.setState({ abcRendered: true })
      }
      if (this.state.renderNotes) {
        this.updateCanvasWidth()
      }
    }
  }

  updateCanvasWidth() {
    const midiDiv = document.querySelector("#midi-" + this.state.id)
    if (!midiDiv) return
    const canvas = midiDiv.querySelector("svg")
    if (!canvas) return

    midiDiv.style.overflow = null // abcjs div comes with "overflow: hidden" that has to be removed.
    canvas.setAttribute("preserveAspectRatio", "xMidYMid meet")
  }

  render() {
    if (!this.state.render) {
      return <Loading loading={!this.state.render} heightHint="200px" />
    }

    const renderNotes = this.state.renderNotes
    const renderSound = this.state.renderSound

    return (
      <>
        {renderNotes && this.renderNotation()}
        {renderSound && this.renderPlayButton()}
        {!renderSound && <div className="emptyPlayButton" />}
      </>
    )
  }

  renderNotation() {
    return (
      <div
        id={"midi-" + this.state.id}
        className="staffContainer"
        ref={input => {
          this.notes = input
        }}
      />
    )
  }

  renderPlayButton() {
    const playButtonStyle = this.props.playButtonStyle
      ? this.props.playButtonStyle
      : "playButton"
    // MidiSoundContext is used to load the piano sound
    return (
      <MidiSoundContext.Consumer>
        {value => {
          return (
            <>
              <div
                ref={input => {
                  this.midi = input
                }}
                id={this.state.id}
                style={{ display: "none" }}
              />
              <div className={playButtonStyle}>
                {!value.soundLoaded ? (
                  <CircularProgress variant="indeterminate" />
                ) : (
                  <Fab
                    size="small"
                    color="primary"
                    onClick={() => this.onPlay()}
                  >
                    <PlayArrowIcon fontSize="small" />
                  </Fab>
                )}
              </div>
            </>
          )
        }}
      </MidiSoundContext.Consumer>
    )
  }

  onPlay() {
    const orig = document
      .querySelector("#" + this.state.id)
      .querySelector(".abcjs-inline-midi")
    this.state.abcjsMidi.midi.startPlaying(orig)
  }
}

MusicSheet.propTypes = {
  notation: PropTypes.string.isRequired,
  engraverParams: PropTypes.object.isRequired,
  playButtonStyle: PropTypes.string,
}

export default withSimpleErrorBoundary(MusicSheet)
