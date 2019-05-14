import React from "react"
import styled from "styled-components"
import { Notation, Midi } from 'react-abc';

import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"

const Wrapper = styled.aside`
  padding 1rem;
  margin-bottom: 2rem;
  border-left: 0.2rem solid var(--color);
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
`

const Header = styled.h3`
  font-size: 1.3rem;
  font-weight: normal;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f7f7f9;
`

const Body = styled.div`
  padding-bottom: 0.5rem;
`

const variantToColor = {
  hint: "#528afc",
  learningObjectives: "#57b181",
  example: "#528afc",
}

const id = 'a-random-id';

const notation = 'CDEF GABc|';

const MusicSheet = props => {
  return (
    <Wrapper style={{ "--color": variantToColor[props.variant] }}>
      <Header>
        {props.name}
      </Header>
      <Body>
      <Notation notation={notation} />
      <Midi notation={notation}/>
      </Body>
    </Wrapper>
  )
}

export default withSimpleErrorBoundary(MusicSheet)
