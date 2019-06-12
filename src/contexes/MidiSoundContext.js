import React from "react"

export const MidiSoundContext = React.createContext()

export class MidiSoundContextProvider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      soundLoaded: false,
    }
  }

  componentDidMount() {
    if (!this.state.abcjsMidi) {
      import("abcjs/midi").then(abcjsMidi => {
        this.setState({ render: true, abcjsMidi })
      })
    }
  }

  componentDidUpdate() {
    const midiListener = (element, event) => {
      if (event.newBeat) {
        this.setState({ soundLoaded: true })
      }
    }

    if (this.state.abcjsMidi && !this.state.soundLoaded) {
      const notation = "L:1/1\n[c]"
      this.state.abcjsMidi.renderMidi(this.midi, notation, {
        voicesOff: true,
        midiListener,
      })
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
    }
  }

  renderEmptyMidi() {
    return (
      <div
        ref={input => {
          this.midi = input
        }}
        id="empty-abcjs-midi"
        style={{ display: "none" }}
      />
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
