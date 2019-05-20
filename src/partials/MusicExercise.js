import React, { Fragment } from "react"
import styled from "styled-components"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt as icon } from "@fortawesome/free-solid-svg-icons"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import {
  fetchProgrammingExerciseDetails,
  fetchProgrammingExerciseModelSolution,
} from "../services/moocfi"
import { Button, Paper, Card, CardContent, Divider } from "@material-ui/core"
import Modal from "@material-ui/core/Modal"
import Icon from "@material-ui/core/Icon"
import LoginStateContext from "../contexes/LoginStateContext"
import LoginControls from "../components/LoginControls"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"
import { normalizeExerciseId } from "../util/strings"
import Loading from "../components/Loading"

import MusicSheet from "./MusicSheet"
import DropDownForAnswers from "./DropDownForAnswers"
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

const ModalContent = styled(Paper)`
  padding: 5rem;
  overflow-y: scroll;
  max-height: 100vh;
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

const TokenContainer = styled.div`
  margin-bottom: 1rem;
  p {
    font-size: 1rem;
    color: #2e3032;
  }
`

class MusicExercise extends React.Component {
  static contextType = LoginStateContext

  // {
  //   "id": 55219,
  //   "available_points": [
  //     {
  //       "id": 619839,
  //       "exercise_id": 55219,
  //       "name": "01-01",
  //       "requires_review": false
  //     }
  //   ],
  //   "name": "osa01-Osa01_01.Hiekkalaatikko",
  //   "publish_time": null,
  //   "deadline": null,
  //   "soft_deadline": null,
  //   "expired": false,
  //   "disabled": false,
  //   "completed": false
  // }
  state = {
    exerciseDetails: {
      id: 55219,
      available_points: [
        {
          id: 619839,
          exercise_id: 55219,
          name: "01-01",
          requires_review: false,
        },
      ],
      name: "osa01-Osa01_01.Hiekkalaatikko",
      publish_time: null,
      deadline: null,
      soft_deadline: null,
      expired: false,
      disabled: false,
      completed: false,
    },
    modelSolutionModalOpen: false,
    modelSolution: undefined,
    render: false,
    answerBaseKey: null,
    answerChordType: null,
  }

  async componentDidMount() {
    this.setState({ render: true })
    if (!this.context.loggedIn) {
      return
    }
    await this.fetch()
  }

  fetch = async () => {
    if (!this.props.tmcname) {
      return
    }
    let exerciseDetails = null
    try {
      exerciseDetails = { id: "a7df8dd4-e7fd-4038-8d67-4f8880e160f0" }
      // await fetchProgrammingExerciseDetails(
      //   this.props.tmcname,
      // )
    } catch (error) {
      console.error(error)
    }
    this.setState({
      exerciseDetails,
    })
  }

  onUpdate = async () => {
    this.setState({
      exerciseDetails: undefined,
      modelSolutionModalOpen: false,
      modelSolution: undefined,
    })
    await this.fetch()
  }

  setAnswerBaseKey = studentsAnswer => {
    this.setState({
      answerBaseKey: studentsAnswer,
    })
  }

  setAnswerChordType = studentsAnswer => {
    this.setState({
      answerChordType: studentsAnswer,
    })
  }

  setAnswerInterval = studentsAnswer => {
    this.setState({
      answerInterval: studentsAnswer,
    })
  }

  setAnswerScaleType = studentsAnswer => {
    this.setState({
      answerScaleType: studentsAnswer,
    })
  }

  render() {
    const { children, name } = this.props

    if (!this.state.render) {
      return <div>Loading</div>
    }

    const engraverParams = {
      add_classes: false,
      editable: false,
      listener: null,
      paddingbottom: 1,
      paddingleft: 30,
      paddingright: 50,
      paddingtop: 15,
      responsive: undefined,
      scale: 3,
      staffwidth: 250,
    }

    const rootNmr = randomInt(0, roots.length)
    const notation =
      "L:1/1\n[" +
      roots[rootNmr].name +
      interval(roots[rootNmr], 3, "maj") +
      interval(roots[rootNmr], 5, "perf") +
      "]"

    const answerOptions = [
      { id: 0, label: "duuri" },
      { id: 1, label: "luonnollinen molli" },
      { id: 2, label: "harmoninen molli" },
      { id: 3, label: "melodinen molli" },
    ]

    return (
      <MusicExerciseWrapper
        id={normalizeExerciseId(`programming-exercise-${name}`)}
      >
        <Header>
          <StyledIcon icon={icon} size="1x" />
          <HeaderMuted>Tehtävä: </HeaderMuted>
          {name}
        </Header>
        <Body>
          <div>
            {this.context.loggedIn ? (
              <div>
                {children}
                {this.state.exerciseDetails === null && (
                  <div>Error loading exercise details</div>
                )}
              </div>
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
            <Loading
              loading={this.state.exerciseDetails === undefined}
              heightHint="305px"
            >
              <div>
                {this.state.exerciseDetails && (
                  <Fragment>
                    <p>
                      TODO Tehtävät, esim: Seuraavassa tehtävässä on tarkoitus
                      opetella sointuja
                    </p>
                    <div className="overall-container">
                      <div className="left-container">
                        <MusicSheet
                          notation={notation}
                          engraverParams={engraverParams}
                        />
                      </div>
                      <div className="right-container">
                        <div className="dropdown1">
                          <DropDownForAnswers
                            setStudentsAnswer={this.setAnswerBaseKey}
                            answers={answerOptions}
                          />
                        </div>
                        <div className="dropdown2">
                          <DropDownForAnswers
                            setStudentsAnswer={this.setAnswerChordType}
                            answers={answerOptions}
                          />
                        </div>
                        <div className="submitbutton">
                          <Button variant="contained" color="primary">
                            Lähetä vastaukset
                            <Icon>send</Icon>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                )}
              </div>
            </Loading>
          )}
        </Body>
      </MusicExerciseWrapper>
    )
  }
}

export default withSimpleErrorBoundary(MusicExercise)
