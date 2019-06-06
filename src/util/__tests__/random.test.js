import { randomIntArray } from "../random"

describe("randomIntArray()", () => {
  it("doesn't generate same elements when generating fewer than possibilities", () => {
    for (let i = 0; i < 1000; i++) {
      const result = randomIntArray(0, 10, 5)
      expect(
        result.filter(e1 => result.filter(e2 => e1 === e2).length > 1),
      ).toEqual([])
    }
  })

  it("doesn't generate more duplicate elements than needed when generateing more than possibilities", () => {
    for (let i = 10; i <= 100; i++) {
      const result = randomIntArray(0, i, i * 2)
      expect(
        result.filter(e1 => result.filter(e2 => e1 === e2).length > 2),
      ).toEqual([])
    }
  })
})
