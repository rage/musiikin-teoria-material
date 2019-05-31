import React, { Component } from "react"
import PropTypes from "prop-types"

import { notationProps } from "../defaults/props"

class Notation extends Component {
  constructor(props) {
    super(props)

    this.notation = null
    this.renderNotation = this.renderNotation.bind(this)
  }

  componentDidMount() {
    this.renderNotation()
  }

  componentDidUpdate() {
    this.renderNotation()
  }

  renderNotation() {
    const { engraverParams, notation, parserParams, renderParams } = this.props

    const el = this.props.el || this.el

    // abcjs attempts to use DOM api that is not available when
    // gatsby runs build, so it's server side rendering had to be
    // disabled.
    // -> Dynamic import is used instead.
    import("abcjs").then(abc => {
      this.notation = abc.renderAbc(
        el,
        notation,
        engraverParams,
        parserParams,
        renderParams,
      )
    })
  }

  render() {
    return (
      <div
        ref={input => {
          this.el = input
        }}
      />
    )
  }
}

Notation.propTypes = {
  el: PropTypes.node,
  engraverParams: PropTypes.object,
  notation: PropTypes.string.isRequired,
  parserParams: PropTypes.object,
  renderParams: PropTypes.object,
}

Notation.defaultProps = notationProps

export default Notation
