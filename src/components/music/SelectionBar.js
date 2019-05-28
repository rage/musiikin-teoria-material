import React, { Fragment } from "react"
import { Button, Icon } from "@material-ui/core"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import DropDownForAnswers from "./DropDownForAnswers"

class SelectionBar extends React.Component {
  render() {
    return (
      <Fragment>
        {this.props.options.map((option, i) => (
          <div key={i} className={option.className}>
            <DropDownForAnswers
              setStudentsAnswer={option.setAnswer}
              answers={option.answers}
              label={option.label}
              selectedIndex={option.selectedIndex}
              borderColor={option.borderColor}
            />
          </div>
        ))}
        <div className="scaleSubmitbutton">
          {this.props.answerWasSubmitted ? (
            <Button
              variant="contained"
              color="primary"
              onClick={this.props.nextExercise}
            >
              Aloita alusta
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={this.props.handleClick}
            >
              Lähetä vastaukset &nbsp;
              <Icon>send</Icon>
            </Button>
          )}
        </div>
      </Fragment>
    )
  }
}

export default withSimpleErrorBoundary(SelectionBar)
