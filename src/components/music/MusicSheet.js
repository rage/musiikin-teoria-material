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
      renderNotes: props.renderNotes,
      renderSound: props.renderSound,
      abcjs: undefined,
      abcjsMidi: undefined,
      abcRendered: false,
      previousWindowWidth: undefined,
      isPlaying: false,
    }
  }

  componentDidMount() {
    // abcjs can not be imported directly since it is a non react library.
    // abcjs attempts to use DOM api that is not available when
    // gatsby runs build, so it's server side rendering had to be
    // disabled.
    // -> Dynamic import is used instead.
    import("abcjs/midi").then(abcjsMidi => {
      this.setState({ render: true, abcjsMidi })
    })
    window.addEventListener("resize", () =>
      this.setState({ previousWindowWidth: undefined }),
    )
  }

  componentWillUnmount() {
    window.removeEventListener("resize", () =>
      this.setState({ previousWindowWidth: undefined }),
    )
  }

  componentDidUpdate(prevProps) {
    if (!this.state.render) {
      return
    }

    const windowWidth = window.innerWidth

    const parameters = this.state.renderNotes
      ? {
          /* Engraver parameters */
          ...this.props.engraverParams,
          paddingleft:
            windowWidth < 800 ? 15 : this.props.engraverParams.paddingleft,
          paddingright:
            windowWidth < 800 ? 10 : this.props.engraverParams.paddingright,
          /* Parser parameters */
          oneSvgPerLine: false,
          scrollHorizontal: false,
          startingTune: 0,
          viewportHorizontal: true,
          // wrap: { minSpacing: 1.5, maxSpacing: 2.7, preferredMeasuresPerLine: 4 },
          /* Render parameters */
          header_only: false,
          hint_measures: false,
          print: false,
          stop_on_warning: false,
          responsive:
            windowWidth < this.props.engraverParams.responsivewidth
              ? "resize"
              : undefined,
        }
      : {}

    const midiListener = (element, event) => {
      if (event.progress > 0) {
        this.setState({ isPlaying: true })
      }
      if (event.progress === 0) {
        this.setState({ isPlaying: false })
      }
    }

    if (
      !this.state.abcRendered ||
      prevProps.notation !== this.props.notation ||
      this.state.previousWindowWidth !== windowWidth
    ) {
      this.state.abcjsMidi.renderAbc(
        this.notes,
        this.props.notation,
        parameters,
      )
      this.state.abcjsMidi.renderMidi(this.midi, this.props.notation, {
        midiListener,
      })
      this.setState({
        abcRendered: true,
        previousWindowWidth: windowWidth,
      })
    }

    this.updateCanvasWidth()
  }

  updateCanvasWidth = () => {
    if (!this.state.renderNotes) {
      return
    }
    const midiDiv = document.querySelector("#midi-" + this.state.id)
    if (!midiDiv) return
    const div = midiDiv.querySelector("div")
    if (!div) return
    const canvas = div.querySelector("svg")
    if (!canvas) return

    midiDiv.style.overflow = null // abcjs div comes with "overflow: hidden" that has to be removed.
    div.style.overflow = null // abcjs div comes with "overflow: hidden" that has to be removed.
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
    this.state.isPlaying
      ? this.state.abcjsMidi.midi.restartPlaying()
      : this.state.abcjsMidi.midi.startPlaying(orig)
  }
}

MusicSheet.propTypes = {
  notation: PropTypes.string.isRequired,
  engraverParams: PropTypes.object.isRequired,
  playButtonStyle: PropTypes.string,
}

export default withSimpleErrorBoundary(MusicSheet)
