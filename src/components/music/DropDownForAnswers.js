import React, { Fragment } from "react"
import PropTypes from "prop-types"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import DropDownMenu from "../DropDownMenu"
import styled from "styled-components"

class DropDownForAnswers extends React.Component {
  state = {
    anchorEl: null,
    options: [],
  }

  componentDidMount() {
    const options = this.props.answers.map(answer => answer.label)
    this.setState({
      options,
    })
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleItemSelection = (event, index) => {
    this.setState({
      anchorEl: null,
    })
    this.props.setStudentsAnswer(index)
  }

  render() {
    if (!this.state.options.length) return null

    let answer =
      typeof this.props.selectedIndex === "number"
        ? this.state.options[this.props.selectedIndex]
        : this.props.label

    // Find first space of the string and cut it from beginning till space, if space does not exist it will be -1.
    const index = answer.indexOf(" ")

    if (index !== -1) {
      answer = answer.substr(0, index)
    }

    return (
      <Wrapper>
        <Fragment>
          <DropDownMenu
            handleClick={this.handleClick}
            options={this.state.options}
            handleClose={this.handleClose}
            handleItemSelection={this.handleItemSelection}
            selectedIndex={this.props.selectedIndex}
            answer={answer}
            anchorEl={this.state.anchorEl}
            borderColor={this.props.borderColor}
            icon={this.props.icon}
          />
        </Fragment>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  margin-bottom: 1rem;
`

DropDownForAnswers.propTypes = {
  answers: PropTypes.array.isRequired,
  setStudentsAnswer: PropTypes.func.isRequired,
  selectedIndex: PropTypes.number,
  label: PropTypes.string.isRequired,
  borderColor: PropTypes.string,
  icon: PropTypes.element,
}

export default withSimpleErrorBoundary(DropDownForAnswers)
