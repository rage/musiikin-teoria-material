import React, { Component } from "react"
import PropTypes from "prop-types"

import { midiProps } from "../defaults/props"
import "./style.css"

class Midi extends Component {
  constructor(props) {
    super(props)

    this.state = { ready: false }
  }

  componentDidMount() {
    const {
      engraverParams,
      midiParams,
      notation,
      parserParams,
      renderParams,
    } = this.props

    const el = this.props.el || this.el

    // abcjs attempts to use DOM api that is not available when
    // gatsby runs build, so it's server side rendering had to be
    // disabled.
    // -> Dynamic import is used instead.
    import("abcjs/src/api/abc_tunebook_midi").then(module => {
      module.default(
        el,
        notation,
        engraverParams,
        parserParams,
        midiParams,
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

Midi.propTypes = {
  el: PropTypes.node,
  engraverParams: PropTypes.object,
  midiParams: PropTypes.object,
  notation: PropTypes.string.isRequired,
  parserParams: PropTypes.object,
  renderParams: PropTypes.object,
}

Midi.defaultProps = midiProps

export default Midi
