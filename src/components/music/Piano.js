import React from "react"
import Dimensions from "react-dimensions"
import {
  Piano as ReactPiano,
  KeyboardShortcuts,
  MidiNumbers,
} from "react-piano"
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
        <ReactPiano
          noteRange={noteRange}
          width={containerWidth}
          playNote={() => {}}
          stopNote={() => {}}
          disabled={() => {}}
          keyboardShortcuts={keyboardShortcuts}
          {...props}
        />
      )}
    </DimensionsProvider>
  )
}

export default Piano
