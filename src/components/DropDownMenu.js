import React from "react"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"
import Menu from "@material-ui/core/Menu"
import MenuItem from "@material-ui/core/MenuItem"
import Button from "@material-ui/core/Button"
import DropDownIcon from "@material-ui/icons/ArrowDropDown"

const DropDownMenu = ({
  handleClick,
  options,
  handleClose,
  handleItemSelection,
  selectedIndex,
  answer,
  anchorEl,
  borderColor,
}) => (
  <div>
    <Button
      aria-owns={anchorEl ? "drop-down-menu" : undefined}
      aria-haspopup="true"
      onClick={handleClick}
      variant="outlined"
      style={{ borderColor }}
    >
      {answer}
      <DropDownIcon />
    </Button>
    <Menu
      id="drop-down-menu"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={handleClose}
    >
      {options.map((option, index) => (
        <MenuItem
          key={option}
          selected={index === selectedIndex}
          onClick={event => handleItemSelection(event, index)}
        >
          {option}
        </MenuItem>
      ))}
    </Menu>
  </div>
)

export default withSimpleErrorBoundary(DropDownMenu)
