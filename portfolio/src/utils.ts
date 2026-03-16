// Random number utilities

/** Exponential distribution with mean 1/lambda */
export function randExp(lambda: number): number {
    return -Math.log(1 - Math.random()) / lambda;
}

/** Uniform random in [min, max) */
export function randUniform(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/** Normal (Gaussian) distribution using Box-Muller transform */
export function randNormal(mu: number = 0, sigma: number = 1): number {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const standardNormal = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return mu + sigma * standardNormal;
}

/** Log-normal distribution */
export function randLognormal(mu: number = 0, sigma: number = 1): number {
  return Math.exp(randNormal(mu, sigma));
}
