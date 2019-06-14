import { interval, intervalsForQualities } from "../intervals"
import { roots } from "../roots"
import { qualities } from "../qualities"

/*
  These are in no way a comprehensive collection of intervals;
  it would not make sense to have all the possibilities hardcoded here, when
  utils/music has been designed precisely to avoid hardcoding all possibilities.
*/
describe("interval()", () => {
  it("returns D sharp as E's major seventh", () => {
    const e = roots[6]
    expect(interval(e, "maj", 7).notation).toBe("^d")
  })
  it("returns E flat as F sharp's diminished seventh", () => {
    const fSharp = roots[8]
    expect(interval(fSharp, "dim", 7).notation).toBe("_e")
  })
  it("returns F flat as G flat's minor fourteenth", () => {
    const gFlat = roots[9]
    expect(interval(gFlat, "min", 14).notation).toBe("_f'")
  })
  it("returns F sharp as A sharp's minor sixth", () => {
    const aSharp = roots[14]
    expect(interval(aSharp, "min", 6).notation).toBe("^f")
  })
  it("returns C flat as E's diminished thirteenth", () => {
    const e = roots[6]
    expect(interval(e, "dim", 13).notation).toBe("_c'")
  })
  it("returns B double flat as E flat's diminished fifth", () => {
    const eFlat = roots[5]
    expect(interval(eFlat, "dim", 5).notation).toBe("__B")
  })
  it("returns C as F sharp's diminished twelfth", () => {
    const fSharp = roots[8]
    expect(interval(fSharp, "dim", 12).notation).toBe("c'")
  })
  it("returns G as C's perfect twelfth", () => {
    const c = roots[0]
    expect(interval(c, "perf", 12).notation).toBe("g")
  })
  it("returns D sharp as A's augmented fourth", () => {
    const a = roots[13]
    expect(interval(a, "aug", 4).notation).toBe("^d")
  })
  it("returns C flat as G's diminished eleventh", () => {
    const g = roots[10]
    expect(interval(g, "dim", 11).notation).toBe("_c'")
  })
  it("returns F flat as D flat's minor third", () => {
    const dFlat = roots[2]
    expect(interval(dFlat, "min", 3).notation).toBe("_F")
  })
  it("returns G as E flat's major tenth", () => {
    const eFlat = roots[5]
    expect(interval(eFlat, "maj", 10).notation).toBe("g")
  })
  it("returns A double sharp as G sharp's augmented second", () => {
    const gSharp = roots[11]
    expect(interval(gSharp, "aug", 2).notation).toBe("^^A")
  })
  it("returns A flat as G's minor second", () => {
    const g = roots[10]
    expect(interval(g, "min", 2).notation).toBe("_A")
  })
  it("returns C as B flat's major ninth", () => {
    const bFlat = roots[15]
    expect(interval(bFlat, "maj", 9).notation).toBe("c'")
  })
  it("returns D as D's unison", () => {
    const d = roots[3]
    expect(interval(d, "perf", 1).notation).toBe("D")
  })
  it("returns B sharp as B's augmented octave", () => {
    const b = roots[16]
    expect(interval(b, "aug", 8).notation).toBe("^b")
  })
  it("returns E flat as E's diminished octave", () => {
    const e = roots[6]
    expect(interval(e, "dim", 8).notation).toBe("_e")
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
