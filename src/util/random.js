// from MDN; min is inclusive, max exclusive

/**
 * Returns a random integer from the given range. Taken from MDN:
 *
 * It returns the shuffled array (note that it is the original array, only the
 * elements have been shuffled).
 *
 * @param {*} array The array that will be shuffled in place
 */
export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min

/**
 * Randomly shuffles the elements of the given array, in place (does not create
 * a new array), using the Fisher–Yates shuffle algorithm:
 * https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle
 *
 * It returns the shuffled array (note that it is the original array, only the
 * elements have been shuffled).
 *
 * @param {*} array The array that will be shuffled in place
 */
const shuffle = array => {
  for (let i = array.length - 1; i >= 1; i--) {
    const j = randomInt(0, i + 1)
    const tmp = array[j]
    array[j] = array[i]
    array[i] = tmp
  }
  return array
}

/**
 * Returns a set with random integers from the given range.
 * If the given size is larger that the given range, it loops forever.
 *
 * @param {*} min The minimum value of the elements (inclusive)
 * @param {*} max The maximum value of the elements (exclusive)
 * @param {*} size The size of the set, must be less than or equal to max - min
 */
const randomIntSet = (min, max, size) => {
  const intSet = new Set()
  let newInt
  for (let i = 0; i < size; i++) {
    do {
      newInt = randomInt(min, max)
    } while (intSet.has(newInt))
    intSet.add(newInt)
  }
  return intSet
}

/**
 * Returns an array containing random integers from the given range, with as few
 * repetitions as possible.
 *
 * @param {*} min The minimum value of the elements (inclusive)
 * @param {*} max The maximum value of the elements (exclusive)
 * @param {*} length The desired length for the array
 */
export const randomIntArray = (min, max, length) => {
  const possibleValueCount = max - min
  const possibleValues = new Array(possibleValueCount)
  for (let v = min; v < max; v++) {
    possibleValues[v] = v - min
  }
  shuffle(shuffle(possibleValues))
  if (length >= possibleValueCount) {
    return shuffle([
      ...possibleValues,
      ...randomIntArray(min, max, length - possibleValueCount),
    ])
  } else if (length > possibleValueCount / 2) {
    const excludedSet = randomIntSet(min, max, possibleValues - length)
    return possibleValues.filter(v => !excludedSet.has(v))
  } else {
    const includedSet = randomIntSet(min, max, length)
    return possibleValues.filter(v => includedSet.has(v))
  }
}
