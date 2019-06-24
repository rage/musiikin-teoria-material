import React from "react"
import PropTypes from "prop-types"
import Soundfont from "soundfont-player"

// from https://codesandbox.io/s/7wq15pm1n1

class SoundfontProvider extends React.Component {
  static propTypes = {
    instrumentName: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
    format: PropTypes.oneOf(["mp3", "ogg"]),
    soundfont: PropTypes.oneOf(["MusyngKite", "FluidR3_GM"]),
    render: PropTypes.func,
  }

  static defaultProps = {
    instrumentName: "acoustic_grand_piano",
    format: "ogg",
    soundfont: "MusyngKite",
  }

  constructor(props) {
    super(props)
    this.state = {
      activeAudioNodes: {},
      instrument: null,
    }
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.instrumentName !== this.props.instrumentName) {
      this.loadInstrument(this.props.instrumentName)
    }
  }

  loadInstrument = instrumentName => {
    // Re-trigger loading state
    this.setState({
      instrument: null,
    })
    Soundfont.instrument(this.props.audioContext, instrumentName, {
      format: this.props.format,
      soundfont: this.props.soundfont,
      nameToUrl: (name, soundfont, format) => {
        return `${this.props.hostname}/${name}-${format}.js`
      },
    }).then(instrument => {
      this.setState({
        instrument,
      })
    })
  }

  playNote = midiNumber => {
    this.props.audioContext.resume().then(() => {
      const audioNode = this.state.instrument.play(midiNumber)
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: audioNode,
        }),
      })
    })
    // here starts the logic to write the score
    this.props.appendNote(midiNumber)
  }

  stopNote = midiNumber => {
    this.props.audioContext.resume().then(() => {
      if (!this.state.activeAudioNodes[midiNumber]) {
        return
      }
      const audioNode = this.state.activeAudioNodes[midiNumber]
      // enforce a minumum playback duration when clicking a key very quickly
      setTimeout(() => audioNode.stop(), 230)
      this.setState({
        activeAudioNodes: Object.assign({}, this.state.activeAudioNodes, {
          [midiNumber]: null,
        }),
      })
    })
  }

  // Clear any residual notes that don't get called with stopNote
  stopAllNotes = () => {
    this.props.audioContext.resume().then(() => {
      const activeAudioNodes = Object.values(this.state.activeAudioNodes)
      activeAudioNodes.forEach(node => {
        if (node) {
          node.stop()
        }
      })
      this.setState({
        activeAudioNodes: {},
      })
    })
  }

  render() {
    return this.props.render({
      isLoading: !this.state.instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes,
    })
  }
}

export default SoundfontProvider
