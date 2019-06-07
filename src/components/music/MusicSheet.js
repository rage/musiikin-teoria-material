import React from "react"
import PropTypes from "prop-types"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import Fab from "@material-ui/core/Fab"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import Loading from "../Loading"
import abcjsMidi from "abcjs/midi"
import abcjs from "abcjs"

/**
 * In charge of rendering Music Sheet notes and play button based on parameters passed to it.
 *
 * Use src/partials/MusicSheet when using MusicSheet inside other components
 */
class MusicSheet extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      render: true,
      engraverParams: props.engraverParams
        ? props.engraverParams
        : {
            add_classes: false,
            editable: false,
            listener: null,
            paddingbottom: 30,
            paddingleft: 15,
            paddingright: 50,
            paddingtop: 15,
            responsive: undefined,
            scale: 1,
            staffwidth: 740,
          },
      id: "music-midi-" + Math.floor(Math.random() * 10000),
      renderNotes: props.renderNotes ? true : false,
      renderSound: props.renderSound ? true : false,
      playButtonStyle: props.playButtonStyle
        ? props.playButtonStyle
        : "playButton",
      pianoSoundLoaded: false,
      loader: false,
    }
  }

  componentDidMount() {
    // react-abc can not be imported directly since it uses
    // abcjs that is a non react library.
    // abcjs attempts to use DOM api that is not available when
    // gatsby runs build, so it's server side rendering had to be
    // disabled.
    // -> Dynamic import is used instead.
    this.midiId = this.state.id
    const midiListener = (abcjsElement, currentEvent) => {
      console.log("c", currentEvent)
      if (currentEvent.newBeat) {
        console.log("f")
        this.setState({ loader: false })
      }
    }

    abcjs.renderAbc(this.notes, this.props.notation, {})
    abcjsMidi.renderMidi(this.midiId, this.props.notation, { midiListener })
  }

  componentDidUpdate(prevProps) {
    if (this.state.render) {
      if (this.state.renderNotes) {
        this.updateCanvasWidth()
      }
    }
  }

  updateCanvasWidth() {
    const midiDiv = document.querySelector("#midi-" + this.state.id)
    if (!midiDiv) return
    const notes = midiDiv.querySelector("div")
    if (!notes) return
    const canvas = notes.querySelector("svg")
    if (!canvas) return

    notes.style.overflow = null // abcjs div comes with "overflow: hidden" that has to be removed.
    canvas.setAttribute("preserveAspectRatio", "xMidYMid meet")
  }

  render() {
    if (!this.state.render) {
      return <Loading loading={!this.state.render} heightHint="200px" />
    }

    const renderNotes = this.state.renderNotes
    const renderSound = this.state.renderSound
    const renderLoader = this.state.loader

    return (
      <>
        {renderNotes && this.renderNotation()}
        {!renderLoader && renderSound && this.renderPlayButton()}
        {renderLoader && this.renderPlayButtonLoader()}
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
      ></div>
    )
  }

  renderPlayButton() {
    return (
      <>
        <div
          ref={input => {
            this.midiId = input
          }}
          id={this.state.id}
          style={{ display: "none" }}
        ></div>
        <div className={this.state.playButtonStyle}>
          <Fab size="small" color="primary" onClick={() => this.onPlay()}>
            <PlayArrowIcon fontSize="small" />
          </Fab>
        </div>
      </>
    )
  }

  renderPlayButtonLoader() {
    return (
      <>
        <div className={this.state.playButtonStyle}>
          <Fab size="small" color="primary"></Fab>
        </div>
      </>
    )
  }

  onPlay() {
    this.setState({ loader: true })
    const orig = document
      .querySelector("#" + this.state.id)
      .querySelector(".abcjs-inline-midi")
    abcjsMidi.midi.startPlaying(orig)
  }
}

MusicSheet.propTypes = {
  notation: PropTypes.string.isRequired,
  engraverParams: PropTypes.object,
  playButtonStyle: PropTypes.string,
  renderNotes: PropTypes.bool,
  renderSound: PropTypes.bool,
}

export default withSimpleErrorBoundary(MusicSheet)
