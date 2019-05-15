import React from "react"

class MusicSheet extends React.Component {
  state = {
    render: false,
  }

  constructor(props) {
    super(props)
    this.setState({ notation: props.notation })

    componentDidMount.bind(this)
    render.bind(this)
  }

  componentDidMount() {
    this.setState({ render: true })
  }

  render() {
    if (!state.render) {
      return <div />
    }

    const notation = state.notation

    const react_abc = import("react-abc")

    return (
      <div>
        <react_abc.Notation notation={notation} />
        <react_abc.Midi notation={notation} />
      </div>
    )
  }
}

export default withSimpleErrorBoundary(MusicSheet)
