// from MDN; min is inclusive, max exclusive
export const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min
