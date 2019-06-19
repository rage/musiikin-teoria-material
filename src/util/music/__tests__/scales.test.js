import { interval } from "../intervals"
import { roots, ROOTS } from "../roots"
import { scales, modes } from "../scales"

/*
  These are in no way a comprehensive collection of scales;
  it would not make sense to have all the possibilities hardcoded here, when
  utils/music has been designed precisely to avoid hardcoding all possibilities.
*/
describe("Scale.notation()", () => {
  it("returns correct A flat major scale", () => {
    const aFlat = roots[ROOTS.A_FLAT]
    const majorScale = scales[0]
    expect(majorScale.notation(aFlat)).toBe("L:1/4\n_A_Bc_d_efg_a")
  })
  it("returns correct A sharp major scale", () => {
    const aSharp = roots[ROOTS.A_SHARP]
    const majorScale = scales[0]
    expect(majorScale.notation(aSharp)).toBe("L:1/4\n^A^B^^c^d^e^^f^^g^a")
  })
  it("returns correct F sharp natural minor scale", () => {
    const fSharp = roots[ROOTS.F_SHARP]
    const naturalMinorScale = scales[1]
    expect(naturalMinorScale.notation(fSharp)).toBe("L:1/4\n^F^GAB^cde^f")
  })
  it("returns correct B harmonic minor scale", () => {
    const b = roots[ROOTS.B]
    const harmonicMinorScale = scales[2]
    expect(harmonicMinorScale.notation(b)).toBe("L:1/4\nB^cde^fg^ab")
  })
  it("returns correct D sharp melodic minor scale", () => {
    const dSharp = roots[ROOTS.D_SHARP]
    const melodicMinorScale = scales[3]
    expect(melodicMinorScale.notation(dSharp)).toBe("L:1/4\n^D^E^F^G^A^B^^c^d")
  })
  it("returns correct A sharp melodic minor scale", () => {
    const aSharp = roots[ROOTS.A_SHARP]
    const melodicMinorScale = scales[3]
    expect(melodicMinorScale.notation(aSharp)).toBe("L:1/4\n^A^B^c^d^e^^f^^g^a")
  })
  it("returns correct A flat melodic minor scale", () => {
    const aFlat = roots[ROOTS.A_FLAT]
    const melodicMinorScale = scales[3]
    expect(melodicMinorScale.notation(aFlat)).toBe("L:1/4\n_A_B_c_d_efg_a")
  })
  it("returns correct G sharp melodic minor scale", () => {
    const gSharp = roots[ROOTS.G_SHARP]
    const melodicMinorScale = scales[3]
    expect(melodicMinorScale.notation(gSharp)).toBe("L:1/4\n^G^AB^c^d^e^^f^g")
  })

  it("returns correct E Ionian mode", () => {
    const e = roots[ROOTS.E]
    const ionianMode = modes[0]
    expect(ionianMode.notation(e)).toBe("L:1/4\nE^F^GAB^c^de")
  })
  it("returns correct F Dorian mode", () => {
    const f = roots[ROOTS.F]
    const dorianMode = modes[1]
    expect(dorianMode.notation(f)).toBe("L:1/4\nFG_A_Bcd_ef")
  })
  it("returns correct B flat Phrygian mode", () => {
    const bFlat = roots[ROOTS.B_FLAT]
    const phrygianMode = modes[2]
    expect(phrygianMode.notation(bFlat)).toBe("L:1/4\n_B_c_d_ef_g_a_b")
  })
  it("returns correct D flat Lydian mode", () => {
    const dFlat = roots[ROOTS.D_FLAT]
    const lydianMode = modes[3]
    expect(lydianMode.notation(dFlat)).toBe("L:1/4\n_D_EFG_A_Bc_d")
  })
  it("returns correct G sharp Mixolydian mode", () => {
    const gSharp = roots[ROOTS.G_SHARP]
    const mixolydianMode = modes[4]
    expect(mixolydianMode.notation(gSharp)).toBe("L:1/4\n^G^A^B^c^d^e^f^g")
  })
  it("returns correct E flat Aeolian mode", () => {
    const eFlat = roots[ROOTS.E_FLAT]
    const aeolianMode = modes[5]
    expect(aeolianMode.notation(eFlat)).toBe("L:1/4\n_EF_G_A_B_c_d_e")
  })
  it("returns correct E Locrian mode", () => {
    const a = roots[ROOTS.A]
    const locrianMode = modes[6]
    expect(locrianMode.notation(a)).toBe("L:1/4\nA_Bcd_efga")
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
