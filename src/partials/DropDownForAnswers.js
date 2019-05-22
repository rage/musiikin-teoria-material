import React, { Fragment } from "react"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"
import DropDownMenu from "../components/DropDownMenu"
import styled from "styled-components"

class DropDownForAnswers extends React.Component {
  state = {
    answer: "",
    anchorEl: null,
    selectedIndex: 0,
    options: [],
  }

  componentDidMount() {
    const options = this.props.answers.map(answer => answer.label)
    const answer = this.props.label
    this.setState({
      options,
      answer,
    })
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.resetAnswer !== prevProps.resetAnswer &&
      this.props.resetAnswer
    ) {
      this.setState({
        answer: this.props.label,
      })
      this.props.toggleResetAnswer()
    }
  }

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  handleClose = () => {
    this.setState({ anchorEl: null })
  }

  handleItemSelection = (event, index) => {
    this.setState({
      selectedIndex: index,
      anchorEl: null,
      answer: this.state.options[index],
    })
    this.props.setStudentsAnswer(index)
  }

  render() {
    if (!this.state.options.length) return null

    return (
      <Wrapper>
        <Fragment>
          <DropDownMenu
            handleClick={this.handleClick}
            options={this.state.options}
            handleClose={this.handleClose}
            handleItemSelection={this.handleItemSelection}
            selectedIndex={this.state.selectedIndex}
            answer={this.state.answer}
            anchorEl={this.state.anchorEl}
          />
        </Fragment>
      </Wrapper>
    )
  }
}

const Wrapper = styled.div`
  margin-bottom: 1rem;
`

export default withSimpleErrorBoundary(DropDownForAnswers)
