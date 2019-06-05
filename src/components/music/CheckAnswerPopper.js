import React from "react"
import PropTypes from "prop-types"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import { Popper, Fade, Typography, Paper } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSortDown } from "@fortawesome/free-solid-svg-icons"
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
              <>
                <Paper>
                  <Typography>
                    <MarginInPaper>
                      Vastauksesi ei ollut oikein.
                      <br />
                      Kyseessä oli {this.props.correctAnswer}.
                    </MarginInPaper>
                  </Typography>
                </Paper>
                <CenterArrowIcon>
                  <FontAwesomeIcon
                    icon={faSortDown}
                    color="grey"
                    size="2x"
                    style={{
                      position: "relative",
                      top: "-20px",
                    }}
                  />
                </CenterArrowIcon>
              </>
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

const MarginInPaper = styled.div`
  padding: 1rem;
`

const CenterArrowIcon = styled.div`
  text-align: center;
  height: 11.75px;
`

CheckAnswerPopper.propTypes = {
  open: PropTypes.bool.isRequired,
  anchorEl: PropTypes.element,
  placement: PropTypes.string,
}

export default withSimpleErrorBoundary(CheckAnswerPopper)
