import React from "react"
import styled from "styled-components"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"

import LoginStateContext from "../contexes/LoginStateContext"
import LoginControls from "../components/LoginControls"

import MusicSheet from "./MusicSheet"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt as icon } from "@fortawesome/free-solid-svg-icons"
import { Divider, Grid } from "@material-ui/core"
import LinearProgress from "@material-ui/core/LinearProgress"
import Loading from "../components/Loading"

import { roots, interval } from "../util/musicUtils"
import { randomInt } from "../util/random"

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

  renderBody() {
    // TODO Move out of here
    const rootNmr = randomInt(0, roots.length)
    const notation =
      "L:1/1\n[" +
      roots[rootNmr].name +
      interval(roots[rootNmr], 3, "maj") +
      interval(roots[rootNmr], 5, "perf") +
      "]"

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
            {/* TODO Replace with Exercise component */}
            <p>Seuraavassa tehtävässä on tarkoitus opetella sointuja</p>
            <div className="overall-container">
              <div className="left-container">
                <MusicSheet notation={notation} />
              </div>
              <div className="right-container" />
            </div>
            <StyledDivider />
            <Grid container spacing={16}>
              <Grid item xs={8} />
              <Grid item xs={4}>
                <p>
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
