/**
 * symbol: String shown in answer choices
 * notation: String used in abc notation to produce the accidental
 */
class Accidental {
  constructor(symbol, notation) {
    this.symbol = symbol
    this.notation = notation
  }
}

// Magic numbers that index the accidentals below.
// { DOUBLE_FLAT, FLAT, NATURAL_SIGN, NATURAL, SHARP, DOUBLE_SHARP }
export const DOUBLE_FLAT = 0,
  FLAT = 1,
  NATURAL_SIGN = 2,
  NATURAL = 3,
  SHARP = 4,
  DOUBLE_SHARP = 5

export const accidentals = [
  new Accidental("bb", "__"),
  new Accidental("b", "_"),
  new Accidental("", "="),
  new Accidental("", ""),
  new Accidental("#", "^"),
  new Accidental("x", "^^"),
]
