import React from "react"
import { Fragment } from "react"
import withSimpleErrorBoundary from "../util/withSimpleErrorBoundary"
import Fab from "@material-ui/core/Fab"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"

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

    const engraverParams = {
      add_classes: false,
      editable: false,
      listener: null,
      paddingbottom: 1,
      paddingleft: 50,
      paddingright: 50,
      paddingtop: 15,
      responsive: undefined,
      scale: 3,
      staffwidth: 400,
    }

    if ((onlySound && onlyNotes) || (!onlySound && !onlyNotes)) {
      return (
        <>
          <react_abc.Notation
            notation={notation}
            engraverParams={engraverParams}
          />
          <react_abc.Midi notation={notation} />
          <div class="playbutton">
            <Fab color="primary" onClick={this.onPlay}>
              <PlayArrowIcon />
            </Fab>
          </div>
        </>
      )
    } else if (onlyNotes) {
      return (
        <react_abc.Notation
          notation={notation}
          engraverParams={engraverParams}
        />
      )
    } else if (onlySound) {
      return (
        <>
          {/* edit playback button styling in \node_modules\react-abc\dist\midi\style.css */}
          <react_abc.Midi notation={notation} />
          <div class="playbutton">
            <Fab color="primary" onClick={this.onPlay}>
              <PlayArrowIcon />
            </Fab>
          </div>
        </>
      )
    }
  }

  onPlay() {
    const original = document.getElementsByClassName(
      "abcjs-midi-start abcjs-btn",
    )[0]
    if (original) {
      original.click()
    }
  }
}

export default withSimpleErrorBoundary(MusicSheet)
