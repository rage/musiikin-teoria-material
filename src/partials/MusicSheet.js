import React from "react"
import styled from "styled-components"
import { Notation, Midi } from 'react-abc';

import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"

const id = 'a-random-id';

const MusicSheet = props => {
  return (
    <div>
      {/* adjust scale of notation component in \node_modules\react-abc\dist\defaults\props.js  */}
      <Notation notation={props.notation}/>
      {/* edit playback button styling in \node_modules\react-abc\dist\midi\style.css */}
      <Midi notation={props.notation}/>
    </div>
  )
}

export default withSimpleErrorBoundary(MusicSheet)
