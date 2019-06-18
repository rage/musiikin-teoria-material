import React from "react"
import PropTypes from "prop-types"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import { Popper, Paper, Typography } from "@material-ui/core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSortDown } from "@fortawesome/free-solid-svg-icons"
import styled from "styled-components"

class CheckAnswerPopper extends React.Component {
  render() {
    const { open, anchorEl, placement, message } = this.props.options

    return (
      <Wrapper>
        <Popper open={open} anchorEl={anchorEl} placement={placement}>
          <Paper>
            <MarginInPaper>
              <Typography>{message}</Typography>
            </MarginInPaper>
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
  options: PropTypes.object.isRequired,
}

export default withSimpleErrorBoundary(CheckAnswerPopper)
