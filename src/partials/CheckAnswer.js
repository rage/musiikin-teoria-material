import React, { Fragment } from "react"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"
import CorrectIcon from "@material-ui/icons/Check"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTimes as incorrectIcon } from "@fortawesome/free-solid-svg-icons"
import green from "@material-ui/core/colors/green"
import styled from "styled-components"

class CheckAnswer extends React.Component {
  answerIsCorrect = () => {
    console.log("a", correctAnswer)
    if (!correctAnswer || !studentsAnswer) return false

    if (correctAnswer.length !== studentsAnswer.length) return false

    console.log("t")
    let i
    for (i = 0; i <= correctAnswer.length; i++) {
      if (correctAnswer[i] !== studentsAnswer[i]) {
        return false
      }
    }
    console.log("jee")
    return true
  }

  render() {
    const isCorrect = true
    if (isCorrect) {
      return (
        <Wrapper>
          <Fragment>
            Oikein!
            <CorrectIcon color="#4caf50" style={{ fontSize: 30 }} />
          </Fragment>
        </Wrapper>
      )
    } else {
      return (
        <Wrapper>
          <Fragment>
            Väärin
            <FontAwesomeIcon
              icon={incorrectIcon}
              color="#f44336"
              style={{ fontSize: 30 }}
            />
          </Fragment>
        </Wrapper>
      )
    }
  }
}

const Wrapper = styled.div`
  margin-bottom: 1rem;
`

export default withSimpleErrorBoundary(CheckAnswer)
