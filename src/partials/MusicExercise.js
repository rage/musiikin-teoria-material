import React, { Fragment } from "react"
import styled from "styled-components"

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPencilAlt as icon } from "@fortawesome/free-solid-svg-icons"
import { OutboundLink } from "gatsby-plugin-google-analytics"

import {
  fetchProgrammingExerciseDetails,
  fetchProgrammingExerciseModelSolution,
} from "../services/moocfi"
import {
  Button,
  Paper,
  Card,
  CardContent,
  Divider,
  Icon,
} from "@material-ui/core"
import Modal from "@material-ui/core/Modal"
import LoginStateContext from "../contexes/LoginStateContext"
import LoginControls from "../components/LoginControls"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"
import { normalizeExerciseId } from "../util/strings"
import Loading from "../components/Loading"

import MusicSheet from "./MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
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
    anchorEl: null,
    open: false,
    placement: null,
    nextQuestion: false,
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

  onShowModelSolution = async () => {
    try {
      let modelSolution = this.state.modelSolution
      if (!modelSolution) {
        modelSolution = await fetchProgrammingExerciseModelSolution(
          this.state.exerciseDetails.id,
        )
      }

      this.setState({ modelSolutionModalOpen: true, modelSolution })
    } catch (err) {
      console.error("Could not fetch model solution", err)
    }
  }

  onModelSolutionModalClose = () => {
    this.setState({ modelSolutionModalOpen: false })
  }

  onUpdate = async () => {
    this.setState({
      exerciseDetails: undefined,
      modelSolutionModalOpen: false,
      modelSolution: undefined,
    })
    await this.fetch()
  }

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

  handleClick = placement => event => {
    const { currentTarget } = event
    this.setState(state => ({
      anchorEl: currentTarget,
      open: state.placement !== placement || !state.open,
      placement,
      nextQuestion: true,
    }))
  }

  render() {
    const { children, name } = this.props
    const tokenThreshHold = this.state?.exerciseDetails?.course
      ?.grant_model_solution_token_every_nth_completed_exercise
    //const _totalTokens = this.state?.exerciseDetails?.course?.total_model_solution_tokens
    const availableTokens = this.state?.exerciseDetails?.course
      ?.available_model_solution_tokens
    const modelSolutionTokenUsedOnThisExercise = this.state?.exerciseDetails
      ?.model_solution_token_used_on_this_exercise

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
          <CheckAnswerPopper
            anchorEl={this.state.anchorEl}
            open={this.state.open}
            placement={this.state.placement}
            isCorrect={this.answerIsCorrect()}
          />
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
                {tokenThreshHold && (
                  <Fragment>
                    <StyledDivider />
                    <Modal
                      open={this.state.modelSolutionModalOpen}
                      onClose={this.onModelSolutionModalClose}
                    >
                      {this.state.modelSolution && (
                        <ModalContent>
                          <h1>Mallivastaus</h1>
                          {this.state.modelSolution.solution.files.map(
                            fileEntry => {
                              console.log(fileEntry)
                              return (
                                <Card>
                                  <CardContent>
                                    <h2>{fileEntry.path}</h2>
                                    <p>TODO mallivastaus</p>
                                  </CardContent>
                                </Card>
                              )
                            },
                          )}
                        </ModalContent>
                      )}
                    </Modal>
                  </Fragment>
                )}
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
                          <DropDownForAnswers answers={answerOptions} />
                        </div>
                        <div className="dropdown2">
                          <DropDownForAnswers answers={answerOptions} />
                        </div>
                        <div className="submitbutton">
                          {this.state.nextQuestion && this.answerIsCorrect() ? (
                            // once we have submitted the answer and nextQuestion is true
                            // we also check if answer is correct and if it is we show next question
                            // button. We then change nextQuestion back to false.
                            <Button
                            variant="contained"
                            color="primary">
                            Seuraava kysymys</Button>
                          ) : this.state.nextQuestion && !this.answerIsCorrect() ?
                          (
                            // if answer is not correct we show start over button
                            // We then change nextQuestion back to false.
                            <Button
                            variant="contained"
                            color="primary">
                            Aloita alusta</Button>
                          ) : (
                            // nextQuestion is by default false and after submitting answer below
                            // we change it to true
                            <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleClick("top")}
                          >
                            Lähetä vastaukset
                            &nbsp;
                            <Icon>send</Icon>
                          </Button>
                          )}
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

const studentsAnswer = [1, 2, 3]
const correctAnswer = [1, 2, 3]

export default withSimpleErrorBoundary(MusicExercise)
