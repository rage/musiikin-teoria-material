const letters = ["C", "D", "E", "F", "G", "A", "B"]

// grouped by pitch
const notes = [
  ["C", "^B", "__D"],
  ["_D", "^C", "^^B"],
  ["D", "^^C", "__E"],
  ["_E", "^D", "__F"],
  ["E", "_F", "^^D"],
  ["F", "^E", "__G"],
  ["_G", "^F", "^^E"],
  ["G", "^^F", "__A"],
  ["_A", "^G"],
  ["A", "^^G", "__B"],
  ["_B", "^A", "__C"],
  ["B", "_C", "^^A"],
]

class Root {
  constructor(name, pitch, letter) {
    this.name = name
    this.pitch = pitch
    this.letter = letter
  }
}

// available roots (doesn't include all theoretically possible roots)
export const roots = [
  new Root("C", 0, 0),
  new Root("^C", 1, 0),
  new Root("_D", 1, 1),
  new Root("D", 2, 1),
  new Root("^D", 3, 1),
  new Root("_E", 3, 2),
  new Root("E", 4, 2),
  new Root("F", 5, 3),
  new Root("^F", 6, 3),
  new Root("_G", 6, 4),
  new Root("G", 7, 4),
  new Root("^G", 8, 4),
  new Root("_A", 8, 5),
  new Root("A", 9, 5),
  new Root("^A", 10, 5),
  new Root("_B", 10, 6),
  new Root("B", 11, 6),
]

// defaults are major and perfect intervals
const pitchJumps = [0, 2, 4, 5, 7, 9, 11]

/*
  doesn't error check for nonexisting intervals
  (like perfect third or minor fourth)
  for now only 1 -> 7 intervals are supported
*/
export const interval = (root, number, quality) => {
  const letterJump = number - 1
  const letter = letters[(root.letter + letterJump) % letters.length]
  const smallLetter = root.letter + letterJump >= letters.length

  let pitchJump = pitchJumps[letterJump]
  switch (quality) {
    case "min":
      pitchJump -= 1
      break
    case "dim":
      pitchJump -= number === 1 || number === 4 || number === 5 ? 1 : 2
      break
    case "aug":
      pitchJump += 1
  }

  for (const note of notes[(root.pitch + pitchJump) % notes.length])
    if (note.includes(letter)) return smallLetter ? note.toLowerCase() : note
}
