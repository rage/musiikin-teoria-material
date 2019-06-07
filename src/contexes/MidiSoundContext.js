import React from "react"

export const MidiSoundContext = React.createContext()

export class MidiSoundContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidMount() {
    if (!this.state.react_abc) {
      import("react-abc").then(react_abc => {
        this.setState({ render: true, react_abc })
      })
    }
  }

  componentDidUpdate() {
    if (this.state.render && !this.state.soundLoaded) {
      this.loadPianoSound()
    }
  }

  loadPianoSound() {
    const div = document.querySelector("#empty-abcjs-midi")
    if (!div) {
      return
    }
    const original = div.querySelector(".abcjs-midi-start.abcjs-btn")
    if (original) {
      original.click()
      // Wait one second for the piano sound to load
      // The sound doesn't fire for some reason, even with voicesOff
      setTimeout(() => this.setState({ soundLoaded: true }), 1000)
    }
  }

  renderEmptyMidi() {
    return (
      <div id="empty-abcjs-midi" style={{ display: "none" }}>
        <this.state.react_abc.Midi
          midiParams={{ voicesOff: true }}
          notation="L:1/1\n[]"
        />
      </div>
    )
  }

  render() {
    return (
      <MidiSoundContext.Provider
        value={{ soundLoaded: this.state.soundLoaded }}
      >
        {this.state.render && this.renderEmptyMidi()}
        {this.props.children}
      </MidiSoundContext.Provider>
    )
  }
}
