import React from "react"
import withSimpleErrorBoundary from "../../util/withSimpleErrorBoundary"
import Fab from "@material-ui/core/Fab"
import PlayArrowIcon from "@material-ui/icons/PlayArrow"

/**
 * In charge of rendering Music Sheet notes and play button based on parameters passed to it.
 *
 * Use src/partials/MusicSheet when using MusicSheet inside other components
 */
class MusicSheet extends React.Component {
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
      renderNotes: props.renderNotes ? true : false,
      renderSound: props.renderSound ? true : false,
      playbuttonstyle: props.playbuttonstyle
        ? props.playbuttonstyle
        : "playbutton",
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
    // import("./react-abc-modified/Midi").then(react_abc_modified => {
    //   this.setState({ react_abc_modified })
    // })
  }

  componentDidUpdate(prevProps) {
    if (this.props.notation !== prevProps.notation) {
      this.setState({
        react_abc: null,
        read_abc_modified: null,
        render: false,
      })
    }
    if (!this.state.render) {
      import("react-abc").then(react_abc => {
        this.setState({ render: true, react_abc: react_abc })
        // import("./react-abc-modified/Midi").then(react_abc_modified => {
        //   this.setState({ react_abc_modified })
        // })
      })
    }
  }

  render() {
    if (!this.state.render) {
      return <p>Loading..</p>
    }

    const renderNotes = this.state.renderNotes
    const renderSound = this.state.renderSound
    const notation = this.props.notation

    return (
      <>
        {renderNotes && this.renderNotation(notation)}
        {renderSound && this.renderPlayButton(notation)}
      </>
    )
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
        <div id={this.state.id}>
          <this.state.react_abc.Midi notation={notation} />
        </div>
        <div className={this.state.playbuttonstyle}>
          <Fab size="medium" color="primary" onClick={() => this.onPlay()}>
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
