import { getFullInput } from '../fsHelpers'

type Position = [x: number, y: number]

// The first position is the current
type Knot = Position[]

// Credits on dictionary-based approach to movement: Sam van Gool's Python solution https://github.com/mnopqr1/AoC2022/blob/main/day9/day9.py
const DELTA = {
  R: [0, 1],
  L: [0, -1],
  U: [-1, 0],
  D: [1, 0],
}

function moveKnot(knot: Knot, direction: string, knotToCompare?: Knot): Knot {
  const posX = knot[0][0]
  const posY = knot[0][1]

  // if head, simply add new steps
  if (!knotToCompare) {
    const delta = DELTA[direction]
    if (!delta) return knot

    return [[posX + delta[0], posY + delta[1]], ...knot]
  }

  const diffX = knotToCompare[0][0] - posX
  const diffY = knotToCompare[0][1] - posY

  // If already adjescent to previous knot, no need to modify
  if (Math.abs(diffX) < 2 && Math.abs(diffY) < 2) {
    return knot
  }

  return [[posX + sign(diffX), posY + sign(diffY)], ...knot]
}

export function executeMove(commandStr: string, knots: Knot[]): Knot[] {
  const { direction, steps } = parseMove(commandStr)

  // Deep clone to prevent side-effects
  const newKnots = JSON.parse(JSON.stringify(knots))

  for (let stepIndex = 0; stepIndex < steps; stepIndex++) {
    for (let knotIndex = 0; knotIndex < knots.length; knotIndex++) {
      newKnots[knotIndex] = moveKnot(
        newKnots[knotIndex],
        direction,
        newKnots[knotIndex - 1],
      )
    }
  }

  return newKnots
}

function getFinalState(input: string, ropeLength: number) {
  return input
    .trim()
    .split('\n')
    .reduce(
      (prevState, curMove) => executeMove(curMove, prevState),
      getInitialState(ropeLength),
    )
}

export function getTailCells(input: string, ropeLength: number) {
  const finalState = getFinalState(input, ropeLength)
  const tail = finalState.slice(-1)[0]

  return new Set(tail.map((placement) => placement.join(':'))).size
}

/**
 * Removes the magnitude of x and keeps its sign.
 * Credits for idea: Leo Torres (using Julia's native .sign)
 * Credits for impl: Sam van Gool's Python solution
 */
function sign(x: number) {
  if (x === 0) return 0

  return x / Math.abs(x)
}

function getInitialState(ropeLength: number): Knot[] {
  return Array.from({ length: ropeLength + 1 }).map(() => [[0, 0]])
}

function parseMove(commandStr: string) {
  const [direction, stepsStr] = commandStr.split(' ')
  const steps = Number(stepsStr)
  return {
    direction,
    steps,
  }
}

console.log(
  'Part #1 - counts # of cells tail has been to: ',
  getTailCells(getFullInput(import.meta.url), 1),
)
