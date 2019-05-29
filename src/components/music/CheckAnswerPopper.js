import React from "react"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import { Popper, Fade, Typography } from "@material-ui/core"
import styled from "styled-components"

class CheckAnswerPopper extends React.Component {
  render() {
    const open = this.props.open
    const anchorEl = this.props.anchorEl
    const placement = this.props.placement

    return (
      <Wrapper>
        <Popper
          open={open}
          anchorEl={anchorEl}
          placement={placement}
          transition
        >
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Typography>
                Vastauksesi ei ollut oikein.
                <br />
                Kyseessä oli {this.props.correctAnswer}.
              </Typography>
            </Fade>
          )}
        </Popper>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  margin-bottom: 1rem;
`

export default withSimpleErrorBoundary(CheckAnswerPopper)
