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
import { roots, triads } from "../util/musicUtils"
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

  state = {
    render: false,
    anchorEl: null,
    open: false,
    placement: null,
    toggleSubmitButton: false,
    answerBaseKey: null,
    answerChordType: null,
    rootNmr: null,
    triadNmr: null,
  }

  async componentDidMount() {
    this.setState({
      rootNmr: randomInt(0, roots.length),
      triadNmr: randomInt(0, triads.length),
      render: true,
    })
    onCorrect: undefined, // Function
    onIncorrect: undefined, // Function
    notation: "",
  }

  constructor(props) {
    super(props)
  }

  async componentDidMount() {
    this.nextExercise()
    this.setState({ render: true })
    if (!this.context.loggedIn) {
      return
    }
  }

  answerIsCorrect = () => {
    if (
      this.state.rootNmr == this.state.answerBaseKey &&
      this.state.triadNmr == this.state.answerChordType
    ) {
      return true
    } else {
      return false
    }
  }

  handleClick = placement => event => {
    const { currentTarget } = event
    this.setState(state => ({
      anchorEl: currentTarget,
      open: state.placement !== placement || !state.open,
      placement,
      toggleSubmitButton: true,
    }))
    if (this.answerIsCorrect()) {
      this.props.onCorrect()
    } else {
      this.props.onIncorrect()
    }
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

  nextExercise = () => {
    const rootNmr = randomInt(0, roots.length)
    const triadNmr = randomInt(0, triads.length)
    const notation = triads[triadNmr].notation(roots[rootNmr])

    this.setState({ notation })
  }

  render() {
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

    const answerOptions = [
      { id: 0, label: "duuri" },
      { id: 1, label: "luonnollinen molli" },
      { id: 2, label: "harmoninen molli" },
      { id: 3, label: "melodinen molli" },
    ]

    return (
      <Fragment>
        <CheckAnswerPopper
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          placement={this.state.placement}
          isCorrect={this.answerIsCorrect()}
        />
        <p>
          TODO Tehtävät, esim: Seuraavassa tehtävässä on tarkoitus opetella
          sointuja
        </p>
        <div className="overall-container">
          <div className="left-container">
            <MusicSheet
              notation={this.state.notation}
              name={roots[rootNmr].label + triads[triadNmr].label}
              only_notes={this.props.onlyNotes}
              only_sound={this.props.onlySound}
              engraverParams={engraverParams}
            />
          </div>
          <div className="right-container">
            <div className="dropdown1">
              <DropDownForAnswers
                setStudentsAnswer={this.setAnswerBaseKey}
                answers={roots}
              />
            </div>
            <div className="dropdown2">
              <DropDownForAnswers
                setStudentsAnswer={this.setAnswerChordType}
                answers={triads}
              />
            </div>
            <div className="submitbutton">
              {this.state.toggleSubmitButton && this.answerIsCorrect() ? (
                // once we have submitted the answer and toggleSubmitButton is true
                // we also check if answer is correct and if it is we show next question
                // button. We then change toggleSubmitButton back to false.
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.nextExercise}
                >
                  Seuraava kysymys
                </Button>
              ) : this.state.toggleSubmitButton && !this.answerIsCorrect() ? (
                // if answer is not correct we show start over button
                // We then change toggleSubmitButton back to false.
                <Button variant="contained" color="primary">
                  Aloita alusta
                </Button>
              ) : (
                // toggleSubmitButton is by default false and after submitting answer below
                // we change it to true
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.handleClick("top")}
                >
                  Lähetä vastaukset &nbsp;
                  <Icon>send</Icon>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Fragment>
    )
  }
}

export default withSimpleErrorBoundary(MusicExercise)
