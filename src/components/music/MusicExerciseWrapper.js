import React from "react"
import PropTypes from "prop-types"
import styled from "styled-components"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import LoginStateContext from "../../contexes/LoginStateContext"
import LoginControls from "../LoginControls"
import { postAnswerData, getQuizData } from "../../services/quizzes"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt as icon } from "@fortawesome/free-solid-svg-icons"
import { Icon } from "@material-ui/core"
import green from "@material-ui/core/colors/green"
import { Grid, Button } from "@material-ui/core"
import IconProgressBar from "../IconProgressBar"
import Loading from "../Loading"

const accentColor = "#38b6fa"

const BorderedExerciseBox = styled.section`
  padding 1rem;
  margin-bottom: 2rem;
  border-left: 0.2rem solid ${accentColor};
  box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 2px 1px -1px rgba(0, 0, 0, 0.12);
  border-radius: 4px;
`

const ExerciseIcon = styled(FontAwesomeIcon)`
  vertical-align: middle;
  margin-right: 1rem;
  margin-left: 0.5rem;
  color: ${accentColor};
`

const DoneIcon = styled(Icon)`
  vertical-align: middle;
  margin-right: 1rem;
  margin-left: 0.5rem;
  color: ${green[600]};
  float: right;
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
  min-height: 115px;
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

class MusicExerciseWrapper extends React.Component {
  static contextType = LoginStateContext

  state = {
    render: false,
    pointsAwarded: false,
    skipLogin: false, // TODO remove at some point
    correctAnswers: 0,
    requiredAnswers: this.props.requiredAnswers,
    name: this.props.name ? this.props.name : "'name' parameter not set",
    quizItemId: undefined,
  }

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    this.setState({ render: true })

    const required_answers = this.props.required_answers

    if (required_answers && required_answers > 0) {
      this.setState({ requiredAnswers: required_answers })
    }

    const res = await getQuizData(this.props.quizId)
    const quizItemId = res.quiz.items[0].id
    this.setState({ quizItemId })
  }

  renderHeader() {
    return (
      <Header>
        <ExerciseIcon icon={icon} size="1x" />
        <HeaderMuted>Tehtävä: </HeaderMuted>
        {this.state.name}
        {this.state.pointsAwarded && <DoneIcon>done_outline</DoneIcon>}
      </Header>
    )
  }

  sendAnswer = (textData, correct) => {
    const answerObject = {
      quizId: this.props.quizId,
      languageId: "fi_FI",
      itemAnswers: [
        {
          quizItemId: this.state.quizItemId,
          textData,
          correct,
        },
      ],
    }
    postAnswerData(answerObject)
  }

  onCorrectAnswer = (answerString, correctAnswerString) => {
    this.setState({ correctAnswers: this.state.correctAnswers + 1 })

    const textData = {
      answerString,
      correctAnswerString,
      answerIsCorrect: true,
    }

    if (this.state.correctAnswers + 1 >= this.state.requiredAnswers) {
      this.setState({ completed: true })

      this.sendAnswer(textData, true)
    } else {
      this.sendAnswer(textData, false)
    }
  }

  onIncorrectAnswer = (answerString, correctAnswerString) => {
    this.setState({ correctAnswers: 0 })

    const textData = {
      answerString,
      correctAnswerString,
      answerIsCorrect: false,
    }
    this.sendAnswer(textData, false)
  }

  onReset = () => {
    this.setState({ correctAnswers: 0, completed: false })
  }

  renderCompleteScreen() {
    return (
      <Body>
        <Grid container spacing={32} direction="column" alignItems="center">
          <Grid item>
            <p>Tehtävä suoritettu</p>
          </Grid>
          <Grid item>
            <IconProgressBar
              style={{ marginTop: "1em" }}
              correct={this.state.correctAnswers}
              total={this.state.requiredAnswers}
            />
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={this.onReset}>
              Harjoittele lisää
            </Button>
          </Grid>
        </Grid>
      </Body>
    )
  }

  renderProgressPart() {
    return (
      <Grid
        container
        spacing={40}
        direction="column"
        alignItems="center"
        style={{ height: 75 }}
      >
        <Grid item style={{ marginTop: "1em" }}>
          <p>
            <IconProgressBar
              style={{ marginTop: "1em" }}
              correct={this.state.correctAnswers}
              total={this.state.requiredAnswers}
            />
          </p>
        </Grid>
      </Grid>
    )
  }

  renderBody() {
    if (this.state.completed) {
      return this.renderCompleteScreen()
    } else {
      return (
        <Body>
          <div>
            {this.context.loggedIn || this.state.skipLogin ? (
              <></>
            ) : (
              <div>
                <LoginNag>Kirjaudu sisään nähdäksesi tehtävanannon.</LoginNag>
                <LoginNagWrapper>
                  <LoginControls />
                </LoginNagWrapper>
                <button onClick={() => this.setState({ skipLogin: true })}>
                  Skip
                </button>
              </div>
            )}
          </div>

          {(this.context.loggedIn || this.state.skipLogin) && (
            <Loading loading={false} heightHint="305px">
              <p>{this.props.description && this.props.description}</p>
              {this.props.renderExercise(
                this.onCorrectAnswer,
                this.onIncorrectAnswer,
              )}
              {/* <StyledDivider /> */}
              {this.renderProgressPart()}
            </Loading>
          )}
        </Body>
      )
    }
  }

  render() {
    if (!this.state.render) {
      return <Loading loading={!this.state.render} heightHint="350px" />
    }
    return (
      <BorderedExerciseBox>
        {this.renderHeader()}
        {this.renderBody()}
      </BorderedExerciseBox>
    )
  }
}

MusicExerciseWrapper.propTypes = {
  renderExercise: PropTypes.func.isRequired,
  requiredAnswers: PropTypes.number,
  required_answers: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string,
}

export default withSimpleErrorBoundary(MusicExerciseWrapper)
