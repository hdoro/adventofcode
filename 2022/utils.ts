/**
 * Removes the magnitude of x and keeps its sign.
 * Credits for idea: Leo Torres (using Julia's native .sign)
 * Credits for impl: Sam van Gool's Python solution
 */
export function sign(x: number) {
  if (x === 0) return 0

  return x / Math.abs(x)
}
