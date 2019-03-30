export { createTwoJSDesign } from "./twoJSRenderer";

export { random } from "./utils";

export { createP5Sketch } from "./p5JSRenderer";

export { createShaderCanvas } from "./shaderCanvas";

export const gain = (x, y) => {
  const a = 0.5 * Math.pow(2 * (x < 0.5 ? x : 1 - x), y);
  return x < 0.5 ? a : 1 - a;
};

export const impulse = (x, y) => {
  const h = y * x;
  return h * Math.exp(1 - h);
};

export const parabola = (x, y) => Math.pow(4 * x * (1 - x), y);

export const sine = (x, y) => {
  const a = 3.1459265359 * y * x - 1;
  return Math.sin(a) / a;
};

export const power = (x, a, b) => {
  const k = Math.pow(a + b, a + b) / (Math.pow(a, a) * Math.pow(b, b));
  return k * Math.pow(x, a) * Math.pow(1 - x, b);
};

export const expStep = (x, y, n) => Math.exp(-y * Math.pow(x, n));

export const cubicPulse = (a, y, x) => {
  x = Math.abs(x - a);
  if (x > y) return 0;

  x /= y;
  return 1 - x * x * (3 - 2 * x);
};
