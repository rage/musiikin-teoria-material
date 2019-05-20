import React from "react"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckCircle as correct } from "@fortawesome/free-solid-svg-icons"
import { faCircle as unanswered } from "@fortawesome/free-regular-svg-icons"

import green from "@material-ui/core/colors/green"

class IconProgressBar extends React.Component {
  /* 
    {
      correct: Integer,
      total: Integer
    }
  */
  constructor(props) {
    super(props)
  }

  render() {
    const correctIterator = Array.from(
      { length: this.props.correct },
      (x, i) => i,
    )
    const totalIterator = Array.from(
      { length: this.props.total - this.props.correct },
      (x, i) => i,
    )

    return (
      <>
        {correctIterator.map(i => {
          return (
            <>
              <FontAwesomeIcon
                style={{ color: green[600] }}
                key={i}
                icon={correct}
              />{" "}
            </>
          )
        })}
        {totalIterator.map(i => {
          return (
            <>
              <FontAwesomeIcon
                style={{ color: green[200] }}
                key={i}
                icon={unanswered}
              />{" "}
            </>
          )
        })}{" "}
      </>
    )
  }
}

export default IconProgressBar
