import React from "react"
import styled from "styled-components"
import { Notation, Midi } from 'react-abc';

import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"

const id = 'a-random-id';

const MusicSheet = props => {
  return (
    <div>
      <Notation notation={props.notation} />
      <Midi notation={props.notation}/>
    </div>
  )
}

export default withSimpleErrorBoundary(MusicSheet)
