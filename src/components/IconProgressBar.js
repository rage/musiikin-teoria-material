import React from "react"
import PropTypes from "prop-types"
import { Fragment } from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle as correct } from "@fortawesome/free-solid-svg-icons"
import { faCircle as unanswered } from "@fortawesome/free-regular-svg-icons"

import green from "@material-ui/core/colors/green"

class IconProgressBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    // Create array [1, 2, 3, ..., correct] to use
    // when creating x number of components
    const correctIterator = Array.from(
      { length: this.props.correct },
      (x, i) => i,
    )
    // Create array [1, 2, 3, ..., total-correct] to use
    // when creating x number of components
    const totalIterator = Array.from(
      { length: this.props.total - this.props.correct },
      (x, i) => i,
    )

    return (
      <>
        {correctIterator.map(i => {
          return (
            <Fragment key={"correct-" + i}>
              <FontAwesomeIcon style={{ color: green[600] }} icon={correct} />{" "}
            </Fragment>
          )
        })}
        {totalIterator.map(i => {
          return (
            <Fragment key={"unanswered-" + i}>
              <FontAwesomeIcon
                style={{ color: green[500] }}
                icon={unanswered}
              />{" "}
            </Fragment>
          )
        })}{" "}
      </>
    )
  }
}

IconProgressBar.propTypes = {
  correct: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
}

export default IconProgressBar
