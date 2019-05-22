import React from "react"

import MusicSheet from "../components/music/MusicSheet"

/**
 * In charge of routing <music-sheet> partial to components
 */
const MusicSheetRouter = ({ onlynotes, onlysound, ...other }) => {
  const onlyNotes = onlynotes // partials only allow lowercase props
  const onlySound = onlysound // partials only allow lowercase props

  if ((onlySound && onlyNotes) || (!onlySound && !onlyNotes)) {
    // If both are true or both are false, render both notes and sound
    return <NotesAndSoundMusicSheet {...other} />
  } else if (onlyNotes) {
    return <NotesMusicSheet {...other} />
  } else if (onlySound) {
    return <SoundMusicSheet {...other} />
  }
}

/**
 * Renders both notes and play button
 */
const NotesAndSoundMusicSheet = ({
  engraverParams,
  playButtonStyle,
  ...other
}) => {
  return (
    <MusicSheet
      {...other}
      renderNotes={true}
      renderSound={true}
      engraverParams={
        engraverParams
          ? engraverParams
          : {
              // default engraverParams
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
            }
      }
      playButtonStyle={playButtonStyle ? playButtonStyle : "playbutton"} // default playButtonStyle
    />
  )
}

/**
 * Renders notes
 */
const NotesMusicSheet = ({ engraverParams, ...other }) => {
  return (
    <MusicSheet
      {...other}
      renderNotes={true}
      renderSound={false}
      engraverParams={
        engraverParams
          ? engraverParams
          : {
              // default engraverParams
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
            }
      }
    />
  )
}

/**
 * Renders play button
 */
const SoundMusicSheet = ({ playButtonStyle, ...other }) => {
  return (
    <MusicSheet
      {...other}
      renderNotes={false}
      renderSound={true}
      playButtonStyle={playButtonStyle ? playButtonStyle : "playbutton"} // default playButtonStyle
    />
  )
}

export default MusicSheetRouter
