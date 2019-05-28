import { interval, intervalsForQualities } from "../music/intervals"
import { roots } from "../music/roots"
import { triads } from "../music/chords"
import { qualities } from "../music/qualities"
import { scales, modes } from "../music/scales"

/*
  These are in no way a comprehensive collection of intervals, chords or scales;
  it would not make sense to have all the possibilities hard coded here, when
  music utils have been designed precisely to avoid hardcoding all possibilities.
*/

describe("interval()", () => {
  it("returns D sharp as E's major seventh", () => {
    const e = roots[6]
    expect(interval(e, "maj", 7)).toBe("^d")
  })
  it("returns E flat as F sharp's diminished seventh", () => {
    const fSharp = roots[8]
    expect(interval(fSharp, "dim", 7)).toBe("_e")
  })
  it("returns F flat as G flat's minor fourteenth", () => {
    const gFlat = roots[9]
    expect(interval(gFlat, "min", 14)).toBe("_f'")
  })
  it("returns F sharp as A sharp's minor sixth", () => {
    const aSharp = roots[14]
    expect(interval(aSharp, "min", 6)).toBe("^f")
  })
  it("returns C flat as E's diminished thirteenth", () => {
    const e = roots[6]
    expect(interval(e, "dim", 13)).toBe("_c'")
  })
  it("returns B double flat as E flat's diminished fifth", () => {
    const eFlat = roots[5]
    expect(interval(eFlat, "dim", 5)).toBe("__B")
  })
  it("returns C as F sharp's diminished twelfth", () => {
    const fSharp = roots[8]
    expect(interval(fSharp, "dim", 12)).toBe("c'")
  })
  it("returns G as C's perfect twelfth", () => {
    const c = roots[0]
    expect(interval(c, "perf", 12)).toBe("g")
  })
  it("returns D sharp as A's augmented fourth", () => {
    const a = roots[13]
    expect(interval(a, "aug", 4)).toBe("^d")
  })
  it("returns C flat as G's diminished eleventh", () => {
    const g = roots[10]
    expect(interval(g, "dim", 11)).toBe("_c'")
  })
  it("returns F flat as D flat's minor third", () => {
    const dFlat = roots[2]
    expect(interval(dFlat, "min", 3)).toBe("_F")
  })
  it("returns G as E flat's major tenth", () => {
    const eFlat = roots[5]
    expect(interval(eFlat, "maj", 10)).toBe("g")
  })
  it("returns A double sharp as G sharp's augmented second", () => {
    const gSharp = roots[11]
    expect(interval(gSharp, "aug", 2)).toBe("^^A")
  })
  it("returns A flat as G's minor second", () => {
    const g = roots[10]
    expect(interval(g, "min", 2)).toBe("_A")
  })
  it("returns C as B flat's major ninth", () => {
    const bFlat = roots[15]
    expect(interval(bFlat, "maj", 9)).toBe("c'")
  })
  it("returns D as D's unison", () => {
    const d = roots[3]
    expect(interval(d, "perf", 1)).toBe("D")
  })
  it("returns B sharp as B's augmented octave", () => {
    const b = roots[16]
    expect(interval(b, "aug", 8)).toBe("^b")
  })
  it("returns E flat as E's diminished octave", () => {
    const e = roots[6]
    expect(interval(e, "dim", 8)).toBe("_e")
  })
})

// This test checks that all available root/interval combinations are writable
describe("interval()", () => {
  it("returns a note for each possible interval on a root in roots", () => {
    for (const root of roots)
      for (const quality of qualities)
        for (const number of intervalsForQualities[quality.name])
          expect(interval(root, quality.name, number)).toBeTruthy()
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

describe("Scale.notation()", () => {
  it("returns correct A flat major scale", () => {
    const aFlat = roots[12]
    const majorScale = scales[0]
    expect(majorScale.notation(aFlat)).toBe("L:1/4\n_A_Bc_d_efg_agf_e_dc_B_A")
  })
  it("returns correct F sharp natural minor scale", () => {
    const fSharp = roots[8]
    const naturalMinorScale = scales[1]
    expect(naturalMinorScale.notation(fSharp)).toBe(
      "L:1/4\n^F^GAB^cde^fed^cBA^G^F",
    )
  })
  it("returns correct B harmonic minor scale", () => {
    const b = roots[16]
    const harmonicMinorScale = scales[2]
    expect(harmonicMinorScale.notation(b)).toBe("L:1/4\nB^cde^fg^ab^ag^fed^cB")
  })
  it("returns correct D sharp melodic minor scale", () => {
    const dSharp = roots[4]
    const melodicMinorScale = scales[3]
    expect(melodicMinorScale.notation(dSharp)).toBe(
      "L:1/4\n^D^E^F^G^A^B^^c^d^cB^A^G^F^E^D",
    )
  })

  it("returns correct E Ionian mode", () => {
    const e = roots[6]
    const ionianMode = modes[0]
    expect(ionianMode.notation(e)).toBe("L:1/4\nE^F^GAB^c^de^d^cBA^G^FE")
  })
  it("returns correct F Dorian mode", () => {
    const f = roots[7]
    const dorianMode = modes[1]
    expect(dorianMode.notation(f)).toBe("L:1/4\nFG_A_Bcd_ef_edc_B_AGF")
  })
  it("returns correct B flat Phrygian mode", () => {
    const bFlat = roots[15]
    const phrygianMode = modes[2]
    expect(phrygianMode.notation(bFlat)).toBe(
      "L:1/4\n_B_c_d_ef_g_a_b_a_gf_e_d_c_B",
    )
  })
  it("returns correct D flat Lydian mode", () => {
    const dFlat = roots[2]
    const lydianMode = modes[3]
    expect(lydianMode.notation(dFlat)).toBe("L:1/4\n_D_EFG_A_Bc_dc_B_AGF_E_D")
  })
  it("returns correct G sharp Mixolydian mode", () => {
    const gSharp = roots[11]
    const mixolydianMode = modes[4]
    expect(mixolydianMode.notation(gSharp)).toBe(
      "L:1/4\n^G^A^B^c^d^e^f^g^f^e^d^c^B^A^G",
    )
  })
  it("returns correct E flat Aeolian  mode", () => {
    const eFlat = roots[5]
    const aeolianMode = modes[5]
    expect(aeolianMode.notation(eFlat)).toBe(
      "L:1/4\n_EF_G_A_B_c_d_e_d_c_B_A_GF_E",
    )
  })
  it("returns correct E Locrian mode", () => {
    const a = roots[13]
    const locrianMode = modes[6]
    expect(locrianMode.notation(a)).toBe("L:1/4\nA_Bcd_efgagf_edc_BA")
  })
})
