/**
 * Returns a random integer from the given range.
 * Adapted from MDN:
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
 *
 * @param {*} min The minimum value of the range (inclusive)
 * @param {*} max The maximum value of the range (exclusive)
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
  // flip a coin to decide if array should be reversed
  if (Math.random() >= 0.5) possibleValues.reverse()
  shuffle(shuffle(possibleValues))

  if (length >= possibleValueCount) {
    return shuffle([
      ...possibleValues,
      ...randomIntArray(min, max, length - possibleValueCount),
    ])
  } else {
    return possibleValues.slice(0, length)
  }
}
