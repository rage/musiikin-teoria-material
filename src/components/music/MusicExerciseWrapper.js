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
import { Grid, Button, Typography } from "@material-ui/core"
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
    pointsAwarded: null, // this can be either null or 1 (same as in backend)
    skipLogin: false, // TODO remove at some point
    correctAnswers: 0,
    completed: false, // true if an exercise set was completed just now (not before)
    requiredAnswers: this.props.requiredAnswers,
    name: this.props.name ? this.props.name : "'name' parameter not set",
    quizItemId: undefined,
    showProgressBar: false, // if true, progress bar is shown
    pointsError: false, // true if the points were not received by the backend
    textData: null,
    loader: false,
  }

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    if (!this.context.loggedIn) {
      this.setState({ render: true })
      return
    }
    let res
    try {
      res = await getQuizData(this.props.quizId)
    } catch {
      this.setState({ render: true })
      return
    }
    const quizItemId = res.quiz.items[0].id
    const pointsAwarded = res.userQuizState
      ? res.userQuizState.pointsAwarded
      : null
    this.setState({
      render: true,
      quizItemId,
      pointsAwarded,
      completed: pointsAwarded ? true : false,
      showProgressBar: !pointsAwarded,
    })
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

  sendAnswer = async (textData, correct) => {
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
    let res
    try {
      res = await postAnswerData(answerObject)
    } catch {
      res = {}
    }
    return res
  }

  setCompletedState = res => {
    const pointsAwarded = res.userQuizState
      ? res.userQuizState.pointsAwarded
      : null
    this.setState({
      completed: true,
      pointsAwarded,
      pointsError: !pointsAwarded,
    })
  }

  onCorrectAnswer = async payload => {
    const correctAnswers = this.state.correctAnswers + 1

    if (!this.context.loggedIn) {
      this.setState({
        correctAnswers,
        completed: correctAnswers >= this.state.requiredAnswers,
      })
      return
    }

    // update correctAnswers already here (instead of after waiting for the
    // response from backend) to show progress in the progress bar more quickly
    this.setState({ correctAnswers })

    const textData = {
      ...payload,
    }

    // Save textData to state so it can be resent later, in case sending data to backend fails
    this.setState({ textData })

    if (correctAnswers >= this.state.requiredAnswers) {
      this.setState({ loader: true })
      const res = await this.sendAnswer(textData, true)

      this.setCompletedState(res)
      this.setState({ loader: false })
    } else {
      this.sendAnswer(textData, false)
    }
  }

  onIncorrectAnswer = payload => {
    this.setState({ correctAnswers: 0 })

    const textData = {
      ...payload,
    }
    this.sendAnswer(textData, false)
  }

  onResendAnswer = async () => {
    this.setState({ loader: true })
    const res = await this.sendAnswer(this.state.textData, this.state.completed)

    this.setCompletedState(res)
    let timeout = 0
    if (this.state.pointsError) timeout = 1000
    setTimeout(() => this.setState({ loader: false }), timeout)
  }

  onReset = () => {
    this.setState({
      correctAnswers: 0,
      completed: false,
      showProgressBar: true,
    })
  }

  renderErrorScreen() {
    return (
      <Body>
        <Loading loading={this.state.loader} heightHint="305px">
          <Grid container spacing={32} direction="column" alignItems="center">
            <>
              <Grid item>
                <p style={{ color: "red" }}>
                  Vastauksesi ovat oikein, mutta lähettäminen ei onnistunut
                </p>
              </Grid>
              <Grid item>
                <IconProgressBar
                  correct={this.state.correctAnswers}
                  total={this.state.requiredAnswers}
                />
              </Grid>
            </>
            <Grid item>
              <Button
                variant="contained"
                style={{ backgroundColor: "red", color: "white" }}
                onClick={this.onResendAnswer}
              >
                Lähetä uudestaan &nbsp;
                <Icon fontSize="small">send</Icon>
              </Button>
            </Grid>
          </Grid>
        </Loading>
      </Body>
    )
  }

  renderCompleteScreen() {
    return (
      <Body>
        <Grid container spacing={32} direction="column" alignItems="center">
          {!this.state.showProgressBar ? (
            <Grid item>
              <p>
                Olet jo suorittanut tämän tehtävän ja ansainnut kurssipisteen
              </p>
            </Grid>
          ) : (
            <>
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
            </>
          )}
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
      if (this.state.pointsError) {
        return this.renderErrorScreen()
      }
      return this.renderCompleteScreen()
    } else {
      return (
        <Body>
          <div>
            {this.context.loggedIn || this.state.skipLogin ? (
              <></>
            ) : (
              <div>
                <LoginNag>
                  Kirjaudu sisään saadaksesi tehtävästä pisteitä.
                </LoginNag>
                <LoginNagWrapper>
                  <LoginControls />
                </LoginNagWrapper>
                <div style={{ textAlign: "center" }}>
                  <Button
                    variant="outlined"
                    onClick={() =>
                      this.setState({ skipLogin: true, showProgressBar: true })
                    }
                  >
                    Jatka ilman kirjautumista
                  </Button>
                </div>
              </div>
            )}
          </div>

          {(this.context.loggedIn || this.state.skipLogin) && (
            <Loading loading={this.state.loader} heightHint="305px">
              <Typography color="secondary">
                {!this.context.loggedIn
                  ? "Et saa tekemistäsi tehtävistä pisteitä ennen kuin kirjaudut sisään."
                  : !this.state.quizItemId
                  ? "Tapahtui virhe tehtävän tietojen lataamisessa palvelimelta. Ole hyvä ja lataa sivu uudelleen, jos haluat saada tehtävästä pisteitä."
                  : ""}
              </Typography>
              {this.props.description && <p>{this.props.description}</p>}
              {this.props.renderExercise(
                this.onCorrectAnswer,
                this.onIncorrectAnswer,
              )}
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
  quizId: PropTypes.string.isRequired,
}

export default withSimpleErrorBoundary(MusicExerciseWrapper)
