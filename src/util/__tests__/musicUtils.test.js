import { interval, roots, triads } from "../musicUtils"

/*
  These are in no way a comprehensive collection of intervals, chords or scales;
  it would not make sense to have all the possibilities hard coded here, when
  musicUtils has been designed precisely to avoid hardcoding all possibilities.
*/

describe("interval()", () => {
  it("returns E flat as F sharp's diminished seventh", () => {
    const fSharp = roots[8]
    expect(interval(fSharp, "dim", 7)).toBe("_e")
  })
  it("returns B double flat as E flat's diminished fifth", () => {
    const eFlat = roots[5]
    expect(interval(eFlat, "dim", 5)).toBe("__B")
  })
  it("returns D sharp as A's augmented fourth", () => {
    const a = roots[13]
    expect(interval(a, "aug", 4)).toBe("^d")
  })
  it("returns D sharp as E's major seventh", () => {
    const e = roots[6]
    expect(interval(e, "maj", 7)).toBe("^d")
  })
  it("returns F sharp as A sharp's minor sixth", () => {
    const aSharp = roots[14]
    expect(interval(aSharp, "min", 6)).toBe("^f")
  })
  it("returns F flat as D flat's minor third", () => {
    const dFlat = roots[2]
    expect(interval(dFlat, "min", 3)).toBe("_F")
  })
  it("returns A double sharp as G sharp's augmented second", () => {
    const gSharp = roots[11]
    expect(interval(gSharp, "aug", 2)).toBe("^^A")
  })
  it("returns A as G's major second", () => {
    const g = roots[10]
    expect(interval(g, "maj", 2)).toBe("A")
  })
  it("returns D as D's unison", () => {
    const d = roots[3]
    expect(interval(d, "perf", 1)).toBe("D")
  })
})

describe("Chords.notation()", () => {
  it("returns correct G sharp diminished chord", () => {
    const gSharp = roots[11]
    const diminishedTriad = triads[0]
    expect(diminishedTriad.notation(gSharp)).toBe("L:1/1\n[^GBd]")
  })
  it("returns correct E flat minor chord", () => {
    const eFlat = roots[5]
    const minorTriad = triads[1]
    expect(minorTriad.notation(eFlat)).toBe("L:1/1\n[_E_G_B]")
  })
  it("returns correct A flat major chord", () => {
    const aFlat = roots[12]
    const majorTriad = triads[2]
    expect(majorTriad.notation(aFlat)).toBe("L:1/1\n[_Ac_e]")
  })
  it("returns correct B augmented chord", () => {
    const b = roots[16]
    const augmentedTriad = triads[3]
    expect(augmentedTriad.notation(b)).toBe("L:1/1\n[B^d^^f]")
  })
})
