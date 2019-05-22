import React, { Fragment } from "react"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"
import { Popper, Fade, Typography } from "@material-ui/core"
import styled from "styled-components"

class CheckAnswerPopper extends React.Component {
  render() {
    const open = this.props.open
    const anchorEl = this.props.anchorEl
    const placement = this.props.placement

    if (this.props.isCorrect) {
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
                <Typography>Vastauksesi on oikein!</Typography>
              </Fade>
            )}
          </Popper>
        </Wrapper>
      )
    } else {
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
                  Vastauksesi on väärin.
                  <br />
                  Oikea vastaus on {this.props.correctAnswer}.
                </Typography>
              </Fade>
            )}
          </Popper>
        </Wrapper>
      )
    }
  }
}

const Wrapper = styled.div`
  margin-bottom: 1rem;
`

export default withSimpleErrorBoundary(CheckAnswerPopper)
