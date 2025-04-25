// --- Day 14: Regolith Reservoir --- https://adventofcode.com/2022/day/14
import { expect, test } from 'vitest'
import { getFullInput } from '../fsHelpers'
import { sign } from '../utils'

const exampleInput = `
498,4 -> 498,6 -> 496,6
503,4 -> 502,4 -> 502,9 -> 494,9
`

type Cell = [x: number, y: number]

const SAND_HOLE = [500, -1]

function dropSand(blockedCells: Cell[], lowestY: number): Cell | undefined {
  const blockedCellsLookup = blockedCells.map((cell) => cell.join(':'))
  let gain = { x: 0, y: 0 }
  let tests = 0
  function isOffsetFree(offset: Cell) {
    return !blockedCellsLookup.includes(
      [
        SAND_HOLE[0] + gain.x + offset[0],
        SAND_HOLE[1] + gain.y + offset[1],
      ].join(':'),
    )
  }
  // console.log({
  //   blockedCellsLookup,
  //   gain,
  //   downFree: isOffsetFree([0, 1]),
  //   down2Free: isOffsetFree([0, 2]),
  // })
  // return

  while (true) {
    // console.log({
    //   blockedCellsLookup,
    //   gain,
    //   downFree: isOffsetFree([0, 1]),
    //   blFree: isOffsetFree([-1, 1]),
    //   brFree: isOffsetFree([-1, 1]),
    // })

    // If cell below sand is free, go to next yGain
    if (isOffsetFree([0, 1])) {
      gain.y += 1
      tests += 1
      continue
    }

    // return undefined

    // Else if bottom-left cell is free, move to that column and continue to next y-gain
    if (isOffsetFree([-1, 1])) {
      gain.x -= 1
      gain.y += 1
      continue
    }

    // Likewise for bottom-right cell
    if (isOffsetFree([1, 1])) {
      gain.x += 1
      gain.y += 1
      continue
    }

    // No resting place, we've fallen beyond `lowestRockY` and into the void
    if (gain.y + 1 >= lowestY) {
      return
    }

    // Otherwise, the cell is at rest
    return [SAND_HOLE[0] + gain.x, SAND_HOLE[1] + gain.y]
  }
}

function solve(input: string, floorOffset = 0, debug = false) {
  const parsed = parseInput(input)
  const sandAtRest: Cell[] = []

  const lowestY = parsed.lowestRockY + floorOffset

  if (debug) {
    console.log(`# START\n`)
    console.log(drawState(parsed.rockCells, sandAtRest, floorOffset))
  }

  while (sandAtRest.length < 23) {
    const newSand = dropSand([...parsed.rockCells, ...sandAtRest], lowestY)
    console.log({ newSand })

    if (!newSand) {
      if (debug) {
        console.log(`# END\n`)
        console.log(drawState(parsed.rockCells, sandAtRest, floorOffset))
      }
      return sandAtRest.length
    }

    sandAtRest.push(newSand)

    if (debug && sandAtRest.length % 5 === 0) {
      console.log(`# SAND${sandAtRest.length}\n`)
      console.log(
        drawState(parsed.rockCells, sandAtRest, floorOffset) + '\n\n\n',
      )
    }
  }
}

test('Day #14, example input', () => {
  // expect(solve(exampleInput)).toBe(24)
  expect(solve(exampleInput, 2, true)).toBe(93)
})

// console.log('Day #14, part 1: ', solve(getFullInput(import.meta.url), false)) // 539 is too low

function parseInput(input: string) {
  const rocks = input
    .trim()
    .split('\n')
    .map((pathStr) =>
      eval(`[ [${pathStr.replace(/->/g, '], [')}] ]`),
    ) as Cell[][]

  const rockCells = rocks.flatMap((rockPath) => {
    return rockPath.flatMap((point, index) => {
      const nextPoint = rockPath[index + 1]
      if (!nextPoint) {
        return [point]
      }
      const diff = [nextPoint[0] - point[0], nextPoint[1] - point[1]]
      return [
        point,
        ...Array.from({ length: Math.abs(diff[0]) - 1 }).map((_, index) => [
          point[0] + (index + 1) * sign(diff[0]),
          point[1],
        ]),
        ...Array.from({ length: Math.abs(diff[1]) - 1 }).map((_, index) => [
          point[0],
          point[1] + (index + 1) * sign(diff[1]),
        ]),
      ]
    })
  }) as Cell[]

  return {
    rocks,
    lowestRockY: [...rockCells].sort((a, b) => b[1] - a[1])[0][1],
    rockCells,
  }
}

function drawState(rockCells: Cell[], sandAtRest: Cell[], floorOffset = 0) {
  const allCells = [...rockCells, ...sandAtRest]
  const cellSignatures = allCells.map((c) => c.join(':'))

  function getCellValue(cell: Cell) {
    const index = cellSignatures.indexOf(cell.join(':'))
    if (index < 0) return 'empty'

    if (index > rockCells.length - 1) return 'sand'

    return 'rock'
  }
  const bounds = {
    bottom: allCells.sort((a, b) => b[1] - a[1])[0][1] + floorOffset,
    top: allCells.sort((a, b) => a[1] - b[1])[0][1],
    left: allCells.sort((a, b) => a[0] - b[0])[0][0],
    right: allCells.sort((a, b) => b[0] - a[0])[0][0],
  }
  const grid = Array.from({ length: bounds.bottom - bounds.top + 1 })
    .map((_, rowIndex) => {
      const row = bounds.top + rowIndex
      return Array.from({ length: bounds.right - bounds.left + 1 })
        .map((_, colIndex) => {
          const col = bounds.left + colIndex
          const value = getCellValue([col, row])
          // console.log({ cell: [col, row], value })
          if (value === 'rock') {
            return '#'
          }
          if (value === 'sand') {
            return 'o'
          }

          return `.`
        })
        .join('')
    })
    .join('\n')

  return grid
}
// console.log(
//   parseInput(`
//   492,26 -> 492,17 -> 492,26 -> 494,26 -> 494,16 -> 494,26 -> 496,26 -> 496,22 -> 496,26 -> 498,26 -> 498,17 -> 498,26 -> 500,26 -> 500,20 -> 500,26 -> 502,26 -> 502,25 -> 502,26 -> 504,26 -> 504,23 -> 504,26 -> 506,26 -> 506,21 -> 506,26 -> 508,26 -> 508,16 -> 508,26 -> 510,26 -> 510,24 -> 510,26
// `).rockCells,
// )

/**
 * READING NOTES
 *
 * - each line in the input is the path coordinates of rocks
 * - sand is produced one at a time
 * - production happens after last grain has been at rest
 * - it's affected by gravity:
 *  - if tile below is blocked, try bottom-left, then bottom-right
 *
 * Goal: how many units of sand need to fall before each new grain of sand never rests?
 *
 * Thinking:
 *  - For each new grain of sand, keep current position
 *  - run a loop reducing `y` and checking if that spot is occupied
 *  - if it is, first try to see if `x - 1, y + 1` is occupied (bottom-left)
 *  - if it is, then try bottom-right
 *  - if all 3 bottom positions are blocked, the return the final at-rest sand position
 *  - otherwise, keep moving the grain
 *  - if the `grain.y` > `lowestRockY` - 1, the grain will fall forever into the void, finish the program
 */
