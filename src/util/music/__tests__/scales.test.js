import { interval } from "../intervals"
import { roots } from "../roots"
import { scales, modes } from "../scales"

/*
  These are in no way a comprehensive collection of scales;
  it would not make sense to have all the possibilities hardcoded here, when
  utils/music has been designed precisely to avoid hardcoding all possibilities.
*/
describe("Scale.notation()", () => {
  it("returns correct A flat major scale", () => {
    const aFlat = roots[12]
    const majorScale = scales[0]
    expect(majorScale.notation(aFlat)).toBe("L:1/4\n_A_Bc_d_efg_agf_e_dc_B_A")
  })
  it("returns correct A sharp major scale", () => {
    const aSharp = roots[14]
    const majorScale = scales[0]
    expect(majorScale.notation(aSharp)).toBe(
      "L:1/4\n^A^B^^c^d^e^^f^^g^a^^g^^f^e^d^^c^B^A",
    )
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
      "L:1/4\n^D^E^F^G^A^B^^c^d^c=B^A^G^F^E^D",
    )
  })
  it("returns correct A sharp melodic minor scale", () => {
    const aSharp = roots[14]
    const melodicMinorScale = scales[3]
    expect(melodicMinorScale.notation(aSharp)).toBe(
      "L:1/4\n^A^B^c^d^e^^f^^g^a^g^f^e^d^c^B^A",
    )
  })
  it("returns correct A flat melodic minor scale", () => {
    const aFlat = roots[12]
    const melodicMinorScale = scales[3]
    expect(melodicMinorScale.notation(aFlat)).toBe(
      "L:1/4\n_A_B_c_d_efg_a_g_f_e_d_c_B_A",
    )
  })
  it("returns correct G sharp melodic minor scale", () => {
    const gSharp = roots[11]
    const melodicMinorScale = scales[3]
    expect(melodicMinorScale.notation(gSharp)).toBe(
      "L:1/4\n^G^AB^c^d^e^^f^g^f=e^d^cB^A^G",
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
  it("returns correct E flat Aeolian mode", () => {
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

// This test checks that all available root/scale combinations are writable
describe("interval()", () => {
  it("returns a note for each interval in each possible scale built on a root in roots", () => {
    for (const root of roots)
      for (const scale of [...scales, ...modes])
        for (const i of scale.intervals)
          expect(interval(root, ...i).notation).toBeTruthy()
  })
})
