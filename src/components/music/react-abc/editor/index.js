import React, { Component } from "react"
import PropTypes from "prop-types"

import { editorProps } from "../defaults/props"

class Editor extends Component {
  constructor(props) {
    super(props)

    this.editor = null
  }

  componentDidMount() {
    const { editArea, editorParams } = this.props

    // abcjs attempts to use DOM api that is not available when
    // gatsby runs build, so it's server side rendering had to be
    // disabled.
    // -> Dynamic import is used instead.
    import("abcjs").then(abc => {
      this.editor = new abc.Editor(editArea, editorParams)
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

Editor.propTypes = {
  editArea: PropTypes.string.isRequired,
  editorParams: PropTypes.object,
}

Editor.defaultProps = editorProps

export default Editor
