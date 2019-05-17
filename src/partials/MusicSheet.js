import React from "react"
import { Fragment } from "react"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"

class MusicSheet extends React.Component {
  /*
    props need to be all lowercase since this component is used
    in the .md files

    props: {
      notation: String, abc format music notation
      only_notes: Boolean
      only_sound: Boolean
    }
  */
  constructor(props) {
    super(props)

    this.state = {
      render: false,
      notation: props.notation,
      onlyNotes: props.only_notes ? true : false,
      onlySound: props.only_sound ? true : false,
    }
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

    const onlyNotes = this.state.onlyNotes
    const onlySound = this.state.onlySound
    const notation = this.state.notation
    const react_abc = this.state.react_abc

    if ((onlySound && onlyNotes) || (!onlySound && !onlyNotes)) {
      return (
        <Fragment>
          <react_abc.Notation notation={notation} />
          <react_abc.Midi notation={notation} />
        </Fragment>
      )
    } else if (onlyNotes) {
      return <react_abc.Notation notation={notation} />
    } else if (onlySound) {
      return <react_abc.Midi notation={notation} />
    }
  }
}

export default withSimpleErrorBoundary(MusicSheet)
