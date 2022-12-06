// https://adventofcode.com/2022/day/2

import { parseInputByLine } from '../fsHelpers.js'

const SHAPE_POINTS = {
  A: 1, // Rock
  B: 2, // Paper
  C: 3, // Scissor
}

// In part 1, the second column is what move you should make (`shape`)
// In part 2, the second column is what outcome you should pursue (`outcome`)
const STRATEGY_TO = {
  X: {
    shape: 'A',
    outcome: -1,
  },
  Y: {
    shape: 'B',
    outcome: 0,
  },
  Z: {
    shape: 'C',
    outcome: 1,
  },
}

const GAME_OUTCOMES = {
  A: {
    B: -1,
    C: 1,
  },
  B: {
    A: 1,
    C: -1,
  },
  C: {
    A: -1,
    B: 1,
  },
}

const OUTCOME_POINTS = {
  [-1]: 0, // lost
  0: 3, // draw
  1: 6, // won
}

let points = {
  part1: 0,
  part2: 0,
}
function parseGame(game) {
  const [opponent, strategy] = game.split(' ')

  // PART 1
  const shape = STRATEGY_TO[strategy].shape
  points.part1 +=
    SHAPE_POINTS[shape] + OUTCOME_POINTS[parseOutcome(opponent, shape)]

  // PART 2
  const desiredOutcome = STRATEGY_TO[strategy].outcome
  const desiredShape = figureShape(opponent, desiredOutcome)
  points.part2 += SHAPE_POINTS[desiredShape] + OUTCOME_POINTS[desiredOutcome]
}

function parseOutcome(opponent, player) {
  if (opponent === player) return 0

  return GAME_OUTCOMES[player][opponent]
}

function figureShape(opponent, desiredOutcome) {
  if (desiredOutcome === 0) return opponent

  return (
    // From the opponnent's perspective, which shapes lead to which outcomes?
    Object.entries(GAME_OUTCOMES[opponent]).find(
      // Invert win/loss to match the outcome of the opponent to the player
      ([_shape, outcomeForOpponent]) =>
        outcomeForOpponent * -1 === desiredOutcome,
    )[0] // Then get the shape for that object entry
  )
}

console.time('Execution time: ')

parseInputByLine(import.meta.url, parseGame, () => {
  console.log(`Total points: `, points)
  console.timeEnd('Execution time: ')
})
