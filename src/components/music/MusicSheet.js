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
    }
  }

  componentDidMount() {
    // react-abc can not be imported directly since it uses
    // abcjs that is a non react library.
    // abcjs attempts to use DOM api that is not available when
    // gatsby runs build, so it's server side rendering had to be
    // disabled.
    // -> Dynamic import is used instead.
    import("react-abc").then(react_abc => {
      this.setState({ render: true, react_abc })
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.notation !== prevProps.notation) {
      this.setState({
        react_abc: null,
        read_abc_modified: null,
        render: false,
      })
    }
    if (!this.state.render) {
      import("react-abc").then(react_abc => {
        this.setState({ render: true, react_abc })
      })
    } else {
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
    const notation = this.props.notation

    return (
      <>
        {renderNotes && this.renderNotation(notation)}
        {renderSound && this.renderPlayButton(notation)}
        {!renderSound && <div className="emptyPlayButton" />}
      </>
    )
  }

  renderNotation(notation) {
    return (
      <div id={"midi-" + this.state.id} className="staffContainer">
        <this.state.react_abc.Notation
          notation={notation}
          engraverParams={this.state.engraverParams}
        />
      </div>
    )
  }

  renderPlayButton(notation) {
    // MidiSoundContext is used to load the piano sound
    return (
      <MidiSoundContext.Consumer>
        {value => {
          return (
            <>
              <div id={this.state.id} style={{ display: "none" }}>
                <this.state.react_abc.Midi notation={notation} />
              </div>
              <div className={this.state.playButtonStyle}>
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
    const originalStart = document
      .querySelector("#" + this.state.id)
      .querySelector(".abcjs-midi-start.abcjs-btn")
    /*
      Check if the play button is not pushed, in which case push it;
      otherwise push the reset button, to play from the beginning.
      The check is performed in the same way as in the original abcjs library:
      https://github.com/paulrosen/abcjs/blob/master/src/midi/abc_midi_controls.js
    */
    if (
      originalStart &&
      (" " + originalStart.className + " ").indexOf(" abcjs-pushed ") === -1
    ) {
      originalStart.click()
    } else {
      const originalReset = document
        .querySelector("#" + this.state.id)
        .querySelector(".abcjs-midi-reset.abcjs-btn")
      if (originalReset) {
        originalReset.click()
      }
    }
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
