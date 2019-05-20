import React, { Fragment } from "react"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"
import CorrectIcon from "@material-ui/icons/Check"
import { Paper, Popper, Fade, Typography } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes as incorrectIcon } from "@fortawesome/free-solid-svg-icons"
import green from "@material-ui/core/colors/green"
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
                <Paper>
                  <Typography>
                    Sinun vastauksesi on oikein!
                    <CorrectIcon color="#4caf50" style={{ fontSize: 30 }} />
                  </Typography>
                </Paper>
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
                <Paper>
                  <Typography>
                    Vastauksesi on väärin.
                    <FontAwesomeIcon
                      icon={incorrectIcon}
                      color="#f44336"
                      style={{ fontSize: 30 }}
                    />
                  </Typography>
                </Paper>
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

export default withSimpleErrorBoundary(CheckAnswer)
