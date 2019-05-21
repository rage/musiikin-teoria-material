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
      engraverParams: props.engraverParams
        ? props.engraverParams
        : {
            add_classes: false,
            editable: false,
            listener: null,
            paddingbottom: 30,
            paddingleft: 15,
            paddingright: 50,
            paddingtop: 15,
            responsive: undefined,
            scale: 1,
            staffwidth: 740,
          },
      id: "music-midi-" + Math.floor(Math.random() * 10000),
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
    const notation = this.props.notation

    if ((onlySound && onlyNotes) || (!onlySound && !onlyNotes)) {
      return (
        <>
          {this.renderNotation(notation)}
          {this.renderPlayButton(notation)}
        </>
      )
    } else if (onlyNotes) {
      return this.renderNotation(notation)
    } else if (onlySound) {
      return this.renderPlayButton(notation)
    }
  }

  renderNotation(notation) {
    return (
      <this.state.react_abc.Notation
        notation={notation}
        engraverParams={this.state.engraverParams}
      />
    )
  }

  renderPlayButton(notation) {
    return (
      <>
        {/* edit playback button styling in \node_modules\react-abc\dist\midi\style.css */}
        <div id={this.state.id}>
          <this.state.react_abc.Midi notation={notation} />
        </div>
        <div className="playbutton">
          <Fab color="primary" onClick={() => this.onPlay()}>
            <PlayArrowIcon />
          </Fab>
        </div>
      </>
    )
  }

  onPlay() {
    const original = document
      .querySelector("#" + this.state.id)
      .querySelector(".abcjs-midi-start.abcjs-btn")
    if (original) {
      original.click()
    }
  }
}

export default withSimpleErrorBoundary(MusicSheet)
