import React from "react"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"

class DropDownForAnswers extends React.Component {
  state = {
    answer: "Valitse vastaus",
    anchorEl: null,
    selectedIndex: 0,
    options: [],
  }

  componentDidMount() {
    const options = this.props.answers.split(", ")
    this.setState({
      options,
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
    const { anchorEl } = this.state

    return (
      <div>
        <Button
          aria-owns={anchorEl ? "drop-down-menu" : undefined}
          aria-haspopup="true"
          onClick={this.handleClick}
        >
          {this.state.answer}
        </Button>
        <Menu
          id="drop-down-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
        >
          {this.state.options.map((option, index) => (
            <MenuItem
              key={option}
              selected={index === this.state.selectedIndex}
              onClick={event => this.handleItemSelection(event, index)}
            >
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  }
}

export default withSimpleErrorBoundary(DropDownForAnswers)
