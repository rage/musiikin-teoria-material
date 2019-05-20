import React from "react"
import styled from "styled-components"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"

import LoginStateContext from "../contexes/LoginStateContext"
import LoginControls from "../components/LoginControls"

import MusicSheet from "./MusicSheet"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt as icon } from "@fortawesome/free-solid-svg-icons"
import { Divider, Grid } from "@material-ui/core"
import IconProgressBar from "../components/IconProgressBar"
import LinearProgress from "@material-ui/core/LinearProgress"
import Loading from "../components/Loading"

import { roots, interval } from "../util/musicUtils"
import { randomInt } from "../util/random"

// Exercises
import MusicExercise from "./MusicExercise"

const accentColor = "#38b6fa"

const MusicExerciseWrapper = styled.section`
  padding 1rem;
  margin-bottom: 2rem;
  border-left: 0.2rem solid ${accentColor};
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
`

const StyledIcon = styled(FontAwesomeIcon)`
  vertical-align: middle;
  margin-right: 1rem;
  margin-left: 0.5rem;
  color: ${accentColor};
`

const Header = styled.h3`
  font-size: 1.3rem;
  font-weight: normal;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f7f7f9;
`

const HeaderMuted = styled.span`
  color: #818a91 !important;
  font-size: 80%;
  font-weight: 400;
  margin-right: 0.2rem;
`

const Body = styled.div`
  padding-bottom: 0.5rem;
  min-height: 300px;
`

const LoginNag = styled.div`
  margin-bottom: 1rem;
`

const LoginNagWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-content: center;
  justify-content: center;
`

const StyledDivider = styled(Divider)`
  margin: 1rem 16px !important;
`

class MusicMultiExercise extends React.Component {
  static contextType = LoginStateContext

  state = {
    render: false,
    correctAnswers: 0,
    requiredAnswers: 10,
    name: "Not set",
  }

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.setState({ name: this.props.name, render: true })

    const required_answers = this.props.required_answers

    if (required_answers && required_answers > 0) {
      this.setState({ requiredAnswers: required_answers })
    }
  }

  renderHeader() {
    return (
      <Header>
        <StyledIcon icon={icon} size="1x" />
        <HeaderMuted>Tehtävä: </HeaderMuted>
        {this.state.name}
      </Header>
    )
  }

  onCorrectAnswer = () => {
    this.setState({ correctAnswers: this.state.correctAnswers + 1 })
  }

  onIncorrectAnswer = () => {
    this.setState({ correctAnswers: 0 })
  }

  renderBody() {
    // Pass these as props to the exercise so that it can notify of
    // answers (TODO)
    const onCorrectAnswerFunction = this.onCorrectAnswer
    const onIncorrectAnswerFunction = this.onIncorrectAnswer

    return (
      <Body>
        <div>
          {this.context.loggedIn ? (
            <></>
          ) : (
            <div>
              <LoginNag>Kirjaudu sisään nähdäksesi tehtävanannon.</LoginNag>
              <LoginNagWrapper>
                <LoginControls />
              </LoginNagWrapper>
            </div>
          )}
        </div>

        {this.context.loggedIn && (
          <Loading loading={false} heightHint="305px">
            <MusicExercise />
            <StyledDivider />
            <Grid container spacing={16}>
              <Grid item xs={8}>
                {/* TODO Remove example buttons */}
                <button onClick={onCorrectAnswerFunction}>Correct</button>
                <button onClick={onIncorrectAnswerFunction}>Incorrect</button>
              </Grid>
              <Grid item xs={4}>
                <p>
                  <IconProgressBar
                    style={{ marginTop: "1em", color: "green" }}
                    correct={this.state.correctAnswers}
                    total={this.state.requiredAnswers}
                  />
                  Correct Answers: {this.state.correctAnswers} /{" "}
                  {this.state.requiredAnswers}
                </p>
              </Grid>
            </Grid>
          </Loading>
        )}
      </Body>
    )
  }

  render() {
    if (!this.state.render) {
      return <div>Loading</div>
    }

    return (
      <>
        <MusicExerciseWrapper>
          {this.renderHeader()}
          {this.renderBody()}
        </MusicExerciseWrapper>
      </>
    )
  }
}

export default withSimpleErrorBoundary(MusicMultiExercise)
