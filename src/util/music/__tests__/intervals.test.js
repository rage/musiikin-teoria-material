import {
  interval,
  intervalsForQualities,
  UNISON,
  SECOND,
  THIRD,
  FOURTH,
  FIFTH,
  SIXTH,
  SEVENTH,
  OCTAVE,
  NINTH,
  TENTH,
  ELEVENTH,
  TWELFTH,
  THIRTEENTH,
  FOURTEENTH,
} from "../intervals"
import { roots, ROOTS } from "../roots"
import {
  allQualities as qualities,
  DIMINISHED,
  MINOR,
  MAJOR,
  PERFECT,
  AUGMENTED,
} from "../qualities"

/*
  These are in no way a comprehensive collection of intervals;
  it would not make sense to have all the possibilities hardcoded here, when
  utils/music has been designed precisely to avoid hardcoding all possibilities.
*/
describe("interval()", () => {
  it("returns D sharp as E's major seventh", () => {
    const e = roots[ROOTS.E]
    expect(interval(e, MAJOR, SEVENTH).notation).toBe("^d")
  })
  it("returns E flat as F sharp's diminished seventh", () => {
    const fSharp = roots[ROOTS.F_SHARP]
    expect(interval(fSharp, DIMINISHED, SEVENTH).notation).toBe("_e")
  })
  it("returns F flat as G flat's minor fourteenth", () => {
    const gFlat = roots[ROOTS.G_FLAT]
    expect(interval(gFlat, MINOR, FOURTEENTH).notation).toBe("_f'")
  })
  it("returns F sharp as A sharp's minor sixth", () => {
    const aSharp = roots[ROOTS.A_SHARP]
    expect(interval(aSharp, MINOR, SIXTH).notation).toBe("^f")
  })
  it("returns C flat as E's diminished thirteenth", () => {
    const e = roots[ROOTS.E]
    expect(interval(e, DIMINISHED, THIRTEENTH).notation).toBe("_c'")
  })
  it("returns B double flat as E flat's diminished fifth", () => {
    const eFlat = roots[ROOTS.E_FLAT]
    expect(interval(eFlat, DIMINISHED, FIFTH).notation).toBe("__B")
  })
  it("returns C as F sharp's diminished twelfth", () => {
    const fSharp = roots[ROOTS.F_SHARP]
    expect(interval(fSharp, DIMINISHED, TWELFTH).notation).toBe("c'")
  })
  it("returns G as C's perfect twelfth", () => {
    const c = roots[ROOTS.C]
    expect(interval(c, PERFECT, TWELFTH).notation).toBe("g")
  })
  it("returns D sharp as A's augmented fourth", () => {
    const a = roots[ROOTS.A]
    expect(interval(a, AUGMENTED, FOURTH).notation).toBe("^d")
  })
  it("returns C flat as G's diminished eleventh", () => {
    const g = roots[ROOTS.G]
    expect(interval(g, DIMINISHED, ELEVENTH).notation).toBe("_c'")
  })
  it("returns F flat as D flat's minor third", () => {
    const dFlat = roots[ROOTS.D_FLAT]
    expect(interval(dFlat, MINOR, THIRD).notation).toBe("_F")
  })
  it("returns G as E flat's major tenth", () => {
    const eFlat = roots[ROOTS.E_FLAT]
    expect(interval(eFlat, MAJOR, TENTH).notation).toBe("g")
  })
  it("returns A double sharp as G sharp's augmented second", () => {
    const gSharp = roots[ROOTS.G_SHARP]
    expect(interval(gSharp, AUGMENTED, SECOND).notation).toBe("^^A")
  })
  it("returns A flat as G's minor second", () => {
    const g = roots[ROOTS.G]
    expect(interval(g, MINOR, SECOND).notation).toBe("_A")
  })
  it("returns C as B flat's major ninth", () => {
    const bFlat = roots[ROOTS.B_FLAT]
    expect(interval(bFlat, MAJOR, NINTH).notation).toBe("c'")
  })
  it("returns D as D's unison", () => {
    const d = roots[ROOTS.D]
    expect(interval(d, PERFECT, UNISON).notation).toBe("D")
  })
  it("returns B sharp as B's augmented octave", () => {
    const b = roots[ROOTS.B]
    expect(interval(b, AUGMENTED, OCTAVE).notation).toBe("^b")
  })
  it("returns E flat as E's diminished octave", () => {
    const e = roots[ROOTS.E]
    expect(interval(e, DIMINISHED, OCTAVE).notation).toBe("_e")
  })
})

// This test checks that all available root/interval combinations are writable
describe("interval()", () => {
  it("returns a note for each possible interval on a root in roots", () => {
    for (const root of roots)
      for (const quality of qualities)
        for (const number of intervalsForQualities[quality.name])
          expect(interval(root, quality.name, number).notation).toBeTruthy()
  })
})
