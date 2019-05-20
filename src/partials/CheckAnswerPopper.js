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
                  <Typography>
                    Vastauksesi on oikein!
                    {/* <CorrectIcon color="#4caf50" style={{ fontSize: 30 }} /> */}
                  </Typography>
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
                    {/* <FontAwesomeIcon
                      icon={incorrectIcon}
                      color="#f44336"
                      style={{ fontSize: 30 }}
                    /> */}
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
