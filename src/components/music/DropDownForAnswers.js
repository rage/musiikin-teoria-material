import React, { Fragment } from "react"
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

    return (
      <Wrapper>
        <Fragment>
          <DropDownMenu
            handleClick={this.handleClick}
            options={this.state.options}
            handleClose={this.handleClose}
            handleItemSelection={this.handleItemSelection}
            selectedIndex={this.props.selectedIndex}
            answer={
              typeof this.props.selectedIndex === "number"
                ? this.state.options[this.props.selectedIndex]
                : this.props.label
            }
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
