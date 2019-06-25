import React from "react"
import Dimensions from "react-dimensions"
import { Piano as ReactPiano, MidiNumbers } from "react-piano"
import SoundfontProvider from "./SoundfontProvider"
import "react-piano/dist/styles.css"

// from https://codesandbox.io/s/7wq15pm1n1

class Provider extends React.Component {
  render() {
    return (
      <div>
        {this.props.children({
          containerWidth: this.props.containerWidth,
          containerHeight: this.props.containerHeight,
        })}
      </div>
    )
  }
}

const DimensionsProvider = Dimensions()(Provider)

const soundfontHostname = ""

const noteRange = {
  first: MidiNumbers.fromNote("c4"),
  last: MidiNumbers.fromNote("b5"),
}

class Piano extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      audioContext: undefined,
    }
  }

  componentDidMount() {
    // webkitAudioContext fallback needed to support Safari
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)()
    this.setState({ audioContext })
  }

  render() {
    const showNotes =
      this.props.showNotes && this.props.showNotes.length
        ? this.props.showNotes
        : undefined

    return (
      <div style={showNotes ? { pointerEvents: "none" } : {}}>
        <DimensionsProvider>
          {({ containerWidth, containerHeight }) => (
            <SoundfontProvider
              disabled={showNotes}
              appendNote={this.props.appendNote}
              hostname={soundfontHostname}
              audioContext={this.state.audioContext}
              render={({ isLoading, playNote, stopNote }) => (
                <ReactPiano
                  className={"react-piano"}
                  activeNotes={showNotes}
                  noteRange={noteRange}
                  width={containerWidth}
                  playNote={playNote}
                  stopNote={stopNote}
                  disabled={isLoading || this.props.isPlaying}
                  {...this.props}
                />
              )}
            />
          )}
        </DimensionsProvider>
      </div>
    )
  }
}

export default Piano
