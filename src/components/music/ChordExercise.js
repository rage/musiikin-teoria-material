import React, { Fragment } from "react"
import { Button, Icon, Paper } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"

import MusicSheet from "../../partials/MusicSheet"
import CheckAnswerPopper from "./CheckAnswerPopper"
import DropDownForAnswers from "./DropDownForAnswers"
import { roots, triads } from "../../util/musicUtils"
import { randomInt } from "../../util/random"

class ChordExercise extends React.Component {
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
      onCorrect: undefined, // Function
      onIncorrect: undefined, // Function
      notation: "",
    })
    this.nextExercise()
  }

  constructor(props) {
    super(props)
  }

  answerBaseKeyIsCorrect = () => this.state.rootNmr === this.state.answerBaseKey

  answerChordTypeIsCorrect = () =>
    this.state.triadNmr === this.state.answerChordType

  answerIsCorrect = () =>
    this.answerBaseKeyIsCorrect() && this.answerChordTypeIsCorrect()

  handleClick = placement => event => {
    if (
      typeof this.state.answerBaseKey !== "number" ||
      typeof this.state.answerChordType !== "number"
    ) {
      return
    }
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

  nextExercise = () => {
    const rootNmr = randomInt(0, roots.length)
    const triadNmr = randomInt(0, triads.length)
    const notation = triads[triadNmr].notation(roots[rootNmr])

    this.setState({
      rootNmr,
      triadNmr,
      notation,
      toggleSubmitButton: false,
      open: false,
      answerBaseKey: null,
      answerChordType: null,
    })
  }

  render() {
    if (!this.state.render) {
      return <div>Loading</div>
    }

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
        <Paper>
          <div className="overall-container">
            <div className="left-container">
              <MusicSheet
                notation={this.state.notation}
                onlynotes={this.props.onlyNotes}
                onlysound={this.props.onlySound}
                engraverParams={this.props.engraverParams}
                playbuttonstyle={this.props.playButtonStyle}
              />
            </div>
            <div className="right-container">
              <div className="dropdown1">
                <DropDownForAnswers
                  setStudentsAnswer={this.setAnswerBaseKey}
                  answers={roots}
                  label="Valitse vastaus"
                  selectedIndex={this.state.answerBaseKey}
                  borderColor={
                    this.state.toggleSubmitButton
                      ? this.answerBaseKeyIsCorrect()
                        ? "green"
                        : "red"
                      : ""
                  }
                />
              </div>
              <div className="dropdown2">
                <DropDownForAnswers
                  setStudentsAnswer={this.setAnswerChordType}
                  answers={triads}
                  label="Valitse vastaus"
                  selectedIndex={this.state.answerChordType}
                  borderColor={
                    this.state.toggleSubmitButton
                      ? this.answerChordTypeIsCorrect()
                        ? "green"
                        : "red"
                      : ""
                  }
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
                  <Button
                    onClick={() => {
                      this.nextExercise()
                    }}
                    variant="contained"
                    color="primary"
                  >
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
        </Paper>
      </Fragment>
    )
  }
}

export default withSimpleErrorBoundary(ChordExercise)
