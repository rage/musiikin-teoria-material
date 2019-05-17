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
    const options = answers.map(answer => answer.label)
    const answer = label
    this.setState({
      options,
      answer,
    })
  }

  handleChange = (event, data) => {
    this.setState({
      answer: data.value,
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
      selectedIndex: index,
      anchorEl: null,
      answer: this.state.options[index],
    })
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

const answers = [
  { id: 0, label: "duuri" },
  { id: 1, label: "luonnollinen molli" },
  { id: 2, label: "harmoninen molli" },
  { id: 3, label: "melodinen molli" },
]

const label = "Valitse vastaus"

export default withSimpleErrorBoundary(DropDownForAnswers)
