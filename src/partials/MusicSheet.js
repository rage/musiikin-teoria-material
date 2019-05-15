import React from "react"

// abcjs uses API from Browsers (Element) that is not available
// in a node.js environment (used during build)
// jsdom-global allows using DOM api in node.js environment
// This is a hacky way of fixing react-abc
import cleanup from "jsdom-global"

import { Notation, Midi } from "react-abc"

import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"

const MusicSheet = props => {
  return (
    <div>
      <Notation notation={props.notation} />
      <Midi notation={props.notation} />
    </div>
  )
}

cleanup()

export default withSimpleErrorBoundary(MusicSheet)
