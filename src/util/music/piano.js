import { MidiNumbers } from "react-piano"

export const KeyboardShortcuts = {
  create: createKeyboardShortcuts,
  // Preset configurations
  TWO_ROWS: [
    {
      natural: "z",
      flat: "a",
      sharp: "s",
    },
    {
      natural: "x",
      flat: "s",
      sharp: "d",
    },
    {
      natural: "c",
      flat: "d",
      sharp: "f",
    },
    {
      natural: "v",
      flat: "f",
      sharp: "g",
    },
    {
      natural: "b",
      flat: "g",
      sharp: "h",
    },
    {
      natural: "n",
      flat: "h",
      sharp: "j",
    },
    {
      natural: "m",
      flat: "j",
      sharp: "k",
    },
    {
      natural: "q",
      flat: "1",
      sharp: "2",
    },
    {
      natural: "w",
      flat: "2",
      sharp: "3",
    },
    {
      natural: "e",
      flat: "3",
      sharp: "4",
    },
    {
      natural: "r",
      flat: "4",
      sharp: "5",
    },
    {
      natural: "t",
      flat: "5",
      sharp: "6",
    },
    {
      natural: "y",
      flat: "6",
      sharp: "7",
    },
    {
      natural: "u",
      flat: "7",
      sharp: "8",
    },
  ],
}

function createKeyboardShortcuts(_ref) {
  var firstNote = _ref.firstNote,
    lastNote = _ref.lastNote,
    keyboardConfig = _ref.keyboardConfig
  var currentMidiNumber = firstNote
  var naturalKeyIndex = 0
  var keyboardShortcuts = []

  while (
    // There are still keys to be assigned
    naturalKeyIndex < keyboardConfig.length && // Note to be assigned does not surpass range
    currentMidiNumber <= lastNote
  ) {
    var key = keyboardConfig[naturalKeyIndex]

    var _MidiNumbers$getAttri = MidiNumbers.getAttributes(currentMidiNumber),
      isAccidental = _MidiNumbers$getAttri.isAccidental

    if (isAccidental) {
      keyboardShortcuts.push({
        key: key.flat,
        midiNumber: currentMidiNumber,
      })
    } else {
      keyboardShortcuts.push({
        key: key.natural,
        midiNumber: currentMidiNumber,
      })
      naturalKeyIndex += 1
    }

    currentMidiNumber += 1
  }

  return keyboardShortcuts
}
