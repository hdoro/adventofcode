import { expect, test } from 'vitest'
import { getTailCells } from './day-9'
import { getTailCells as getTailCellsWithFullHistory } from './day-9--attempt-at-knot-history.js'

const exampleInput = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`

const exampleInputPart2 = `
R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20
`

const exampleInputPart2FirstError = `
R 5
U 8
L 8
`

test('Part 1: counts # of cells tail has been to', () => {
  // expect(getTailCellsWithFullHistory(exampleInput, 1)).toBe(13) // AoC's website answer
  expect(getTailCells(exampleInput, 1)).toBe(13) // AoC's website answer
})

test('Part 2: counts # of cells tail of a 10-knot rope has been to', () => {
  // expect(getTailCellsWithFullHistory(exampleInputPart2FirstError, 10)).toBe(4)
  // expect(getTailCellsWithFullHistory(exampleInputPart2, 10)).toBe(36) // AoC's website answer
  expect(getTailCells(exampleInputPart2FirstError, 10)).toBe(4)
  expect(getTailCells(exampleInputPart2, 10)).toBe(36) // AoC's website answer
})
