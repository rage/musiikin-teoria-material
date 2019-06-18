import { interval } from "../intervals"
import { roots, ROOTS } from "../roots"
import { triads, TRIADS } from "../chords"

/*
  These are in no way a comprehensive collection of chords;
  it would not make sense to have all the possibilities hardcoded here, when
  utils/music has been designed precisely to avoid hardcoding all possibilities.
*/
describe("Chords.notation()", () => {
  it("returns correct G sharp diminished chord", () => {
    const gSharp = roots[ROOTS.G_SHARP]
    const diminishedTriad = triads[TRIADS.DIMINISHED]
    expect(diminishedTriad.notation(gSharp)).toBe("L:1/1\n[^GBd]")
  })
  it("returns correct E flat minor chord", () => {
    const eFlat = roots[ROOTS.E_FLAT]
    const minorTriad = triads[TRIADS.MINOR]
    expect(minorTriad.notation(eFlat)).toBe("L:1/1\n[_E_G_B]")
  })
  it("returns correct A flat major chord", () => {
    const aFlat = roots[ROOTS.A_FLAT]
    const majorTriad = triads[TRIADS.MINOR]
    expect(majorTriad.notation(aFlat)).toBe("L:1/1\n[_Ac_e]")
  })
  it("returns correct B augmented chord", () => {
    const b = roots[ROOTS.B]
    const augmentedTriad = triads[TRIADS.AUGMENTED]
    expect(augmentedTriad.notation(b)).toBe("L:1/1\n[B^d^^f]")
  })
})

// This test checks that all available root/chord combinations are writable
describe("interval()", () => {
  it("returns a note for each interval in each possible chord built on a root in roots", () => {
    for (const root of roots)
      for (const chord of triads)
        for (const i of chord.intervals)
          expect(interval(root, ...i).notation).toBeTruthy()
  })
})
