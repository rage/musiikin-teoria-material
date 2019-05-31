import React from "react"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import Fab from "@material-ui/core/Fab"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"
import Loading from "../Loading"

/**
 * In charge of rendering Music Sheet notes and play button based on parameters passed to it.
 *
 * Use src/partials/MusicSheet when using MusicSheet inside other components
 */
class MusicSheet extends React.Component {
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
      playbuttonstyle: props.playbuttonstyle
        ? props.playbuttonstyle
        : "playbutton",
      pianoSoundLoaded: false,
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
      if (!this.state.pianoSoundLoaded) {
        this.loadPianoSound()
      }
    }
  }

  loadPianoSound() {
    const div = document.querySelector("#" + this.state.id + "-empty")
    if (!div) {
      return
    }
    const original = div.querySelector(".abcjs-midi-start.abcjs-btn")
    if (original) {
      this.setState({ pianoSoundLoaded: true })
      original.click()
    }
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
      <this.state.react_abc.Notation
        notation={notation}
        engraverParams={this.state.engraverParams}
      />
    )
  }

  renderPlayButton(notation) {
    return (
      <>
        <div id={this.state.id + "-empty"} style={{ display: "none" }}>
          <this.state.react_abc.Midi notation={"L:1/1\n[]"} />
        </div>
        <div id={this.state.id} style={{ display: "none" }}>
          <this.state.react_abc.Midi notation={notation} />
        </div>
        <div className={this.state.playbuttonstyle}>
          <Fab size="small" color="primary" onClick={() => this.onPlay()}>
            <PlayArrowIcon fontSize="small" />
          </Fab>
        </div>
      </>
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

export default withSimpleErrorBoundary(MusicSheet)
