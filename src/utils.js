// outputs a random number between a range
export const random = (max, min) =>
  Math.floor(Math.random() * (max - min) + min);
