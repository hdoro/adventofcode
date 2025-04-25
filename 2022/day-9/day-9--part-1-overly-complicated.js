import { getFullInput } from '../fsHelpers.js'

export const initialState = {
  head: [0, 0],
  tail: [0, 0],
  headHistory: [],
  tailHistory: [],
}

export function parseMove(commandStr) {
  const [direction, stepsStr] = commandStr.split(' ')
  const steps = Number(stepsStr)
  return {
    direction,
    steps,
  }
}

export function modifyPlacement(placement, direction) {
  if (!placement) {
    console.log({ placement, direction })
  }
  if (direction === 'R') {
    return [placement[0], placement[1] + 1]
  }
  if (direction === 'L') {
    return [placement[0], placement[1] - 1]
  }
  if (direction === 'U') {
    return [placement[0] - 1, placement[1]]
  }
  if (direction === 'D') {
    return [placement[0] + 1, placement[1]]
  }
}

export function executeMove(commandStr, state) {
  const { direction, steps } = parseMove(commandStr)

  const newState = JSON.parse(JSON.stringify(state))
  for (let stepIndex = 0; stepIndex < steps; stepIndex++) {
    newState.headHistory.push(newState.head)
    newState.head = modifyPlacement(newState.head, direction)

    // Move the tail if it's not already adjescent to head
    if (
      Math.abs(newState.head[0] - newState.tail[0]) > 1 ||
      Math.abs(newState.head[1] - newState.tail[1]) > 1
    ) {
      newState.tailHistory.push(newState.tail)
      newState.tail = modifyPlacement(newState.tail, direction)

      // If in a diagonal, move the tail to the same row or column as the head
      if (
        newState.head[0] !== newState.tail[0] &&
        newState.head[1] !== newState.tail[1]
      ) {
        const adjustDiagonalDirection = ['L', 'R'].includes(direction)
          ? // When moving primarily on the x-axis, adjust the row by checking the diff between head & tail rows
            newState.head[0] - newState.tail[0] > 0
            ? 'D' // head is below, move the tail down
            : 'U'
          : // Similar mechanism for y-axis movement
          newState.head[1] - newState.tail[1] > 0
          ? 'R' // head is to the right, move the tail right
          : 'L'
        newState.tail = modifyPlacement(newState.tail, adjustDiagonalDirection)
      }
    }
  }

  return newState
}

export function getTailCells(input) {
  const finalState = input
    .trim()
    .split('\n')
    .reduce(
      (prevState, curMove) => executeMove(curMove, prevState),
      initialState,
    )

  return new Set(
    [finalState.tail, ...finalState.tailHistory].map((placement) =>
      placement.join(':'),
    ),
  ).size
}

console.log(
  'Part #1 - counts # of cells tail has been to: ',
  getTailCells(getFullInput(import.meta.url)),
)
