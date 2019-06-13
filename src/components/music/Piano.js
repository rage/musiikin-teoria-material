import React from "react"
import Dimensions from "react-dimensions"
import {
  Piano as ReactPiano,
  KeyboardShortcuts,
  MidiNumbers,
} from "react-piano"
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

// webkitAudioContext fallback needed to support Safari
const audioContext = new (window.AudioContext || window.webkitAudioContext)()

const soundfontHostname = "https://d1pzp51pvbm36p.cloudfront.net"

const noteRange = {
  first: MidiNumbers.fromNote("c3"),
  last: MidiNumbers.fromNote("b4"),
}

const keyboardShortcuts = KeyboardShortcuts.create({
  firstNote: noteRange.first,
  lastNote: noteRange.last,
  keyboardConfig: KeyboardShortcuts.HOME_ROW,
})

const Piano = props => {
  return (
    <DimensionsProvider>
      {({ containerWidth, containerHeight }) => (
        <SoundfontProvider
          hostname={soundfontHostname}
          audioContext={audioContext}
          render={({ isLoading, playNote, stopNote }) => (
            <ReactPiano
              noteRange={noteRange}
              width={containerWidth}
              playNote={playNote}
              stopNote={stopNote}
              disabled={isLoading}
              keyboardShortcuts={keyboardShortcuts}
              {...props}
            />
          )}
        />
      )}
    </DimensionsProvider>
  )
}

export default Piano
