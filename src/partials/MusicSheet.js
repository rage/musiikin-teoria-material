import React from "react"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"

class MusicSheet extends React.Component {
  constructor(props) {
    super(props)
    this.state = { render: false, notation: props.notation }
  }

  componentDidMount() {
    // react-abc can not be imported directly since it uses
    // abcjs that is a non react library.
    // abcjs attempts to use DOM api that is not available when
    // gatsby runs build, so it's server side rendering had to be
    // disabled.
    // -> Dynamic import is used instead.
    import("react-abc").then(react_abc => {
      this.setState({ render: true, react_abc: react_abc })
    })
  }

  render() {
    if (!this.state.render) {
      return <p>Loading..</p>
    }

    const notation = this.state.notation
    const react_abc = this.state.react_abc

    return (
      <div>
        <react_abc.Notation notation={notation} />
        <react_abc.Midi notation={notation} />
      </div>
    )
  }
}

export default withSimpleErrorBoundary(MusicSheet)
