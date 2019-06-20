import React from "react"

import MusicSheet from "../components/music/MusicSheet"

/**
 * In charge of routing <music-sheet> partial to components
 */
const MusicSheetRouter = ({
  onlynotes,
  onlysound,
  children,
  isExercise,
  ...other
}) => {
  const onlyNotes = onlynotes // partials only allow lowercase props
  const onlySound = onlysound // partials only allow lowercase props

  const indent = isExercise ? null : <p style={{ textIndent: 50 }} />

  const defaultEngraverParams = {
    add_classes: false,
    editable: false,
    listener: null,
    paddingbottom: 30,
    paddingleft: 0,
    paddingright: 0,
    paddingtop: 15,
    responsive: "resize",
    scale: 1,
    staffwidth: 700,
  }

  if ((onlySound && onlyNotes) || (!onlySound && !onlyNotes)) {
    // If both are true or both are false, render both notes and sound
    return (
      <NotesAndSoundMusicSheet
        notation={childrenToNotation(children)}
        defaultEngraverParams={defaultEngraverParams}
        indent={indent}
        {...other}
      />
    )
  } else if (onlyNotes) {
    return (
      <NotesMusicSheet
        notation={childrenToNotation(children)}
        defaultEngraverParams={defaultEngraverParams}
        {...other}
      />
    )
  } else if (onlySound) {
    return (
      <SoundMusicSheet
        notation={childrenToNotation(children)}
        indent={indent}
        {...other}
      />
    )
  }
}

const childrenToNotation = children => {
  return Array.isArray(children) ? children.join("") : children
}

/**
 * Renders both notes and play button
 */
const NotesAndSoundMusicSheet = ({
  engraverParams,
  defaultEngraverParams,
  playButtonStyle,
  indent,
  ...other
}) => {
  return (
    <>
      <MusicSheet
        {...other}
        renderNotes={true}
        renderSound={true}
        engraverParams={engraverParams ? engraverParams : defaultEngraverParams}
        playButtonStyle={playButtonStyle ? playButtonStyle : "playButtonSheet"} // default playButtonStyle
      />
      {indent}
    </>
  )
}

/**
 * Renders notes
 */
const NotesMusicSheet = ({
  engraverParams,
  defaultEngraverParams,
  ...other
}) => {
  return (
    <MusicSheet
      {...other}
      renderNotes={true}
      renderSound={false}
      engraverParams={engraverParams ? engraverParams : defaultEngraverParams}
    />
  )
}

/**
 * Renders play button
 */
const SoundMusicSheet = ({ playButtonStyle, indent, ...other }) => {
  return (
    <>
      <MusicSheet
        {...other}
        renderNotes={false}
        renderSound={true}
        playButtonStyle={playButtonStyle ? playButtonStyle : "playButtonSheet"} // default playButtonStyle
      />
      {indent}
    </>
  )
}

export default MusicSheetRouter
