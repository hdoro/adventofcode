import { expect, test } from 'vitest'
import {
  getHighestScenicScore,
  getScenicScore,
  getVisibleTrees,
  isTreeVisible,
  parseInput,
} from './day-8'

const exampleInput = `
30373
25512
65332
33549
35390`

const exampleRows = [
  [3, 0, 3, 7, 3],
  [2, 5, 5, 1, 2],
  [6, 5, 3, 3, 2],
  [3, 3, 5, 4, 9],
  [3, 5, 3, 9, 0],
]
const exampleColumns = [
  [3, 2, 6, 3, 3],
  [0, 5, 5, 3, 5],
  [3, 5, 3, 5, 3],
  [7, 1, 3, 4, 9],
  [3, 2, 2, 9, 0],
]

const visibleTreesInExample = 21 // from AoC's site

test('Parsing input', () => {
  expect(parseInput(exampleInput)).toStrictEqual({
    rows: exampleRows,
    columns: exampleColumns,
  })
})

test('Tree is visible', () => {
  // Edges
  expect(isTreeVisible([0, 0], exampleRows, exampleColumns)).toBe(true)
  expect(isTreeVisible([0, 4], exampleRows, exampleColumns)).toBe(true)
  expect(isTreeVisible([4, 4], exampleRows, exampleColumns)).toBe(true)
  expect(isTreeVisible([4, 0], exampleRows, exampleColumns)).toBe(true)

  // Inner / visible
  expect(isTreeVisible([1, 1], exampleRows, exampleColumns)).toBe(true)

  // Inner / not visible
  expect(isTreeVisible([3, 1], exampleRows, exampleColumns)).toBe(false)
})

test('Part 1: get visible trees', () => {
  expect(getVisibleTrees(exampleInput)).toBe(visibleTreesInExample)
})

test('Scenic score', () => {
  expect(getScenicScore([1, 2], exampleRows, exampleColumns)).toBe(4)
  expect(getScenicScore([3, 2], exampleRows, exampleColumns)).toBe(8)
  expect(getScenicScore([1, 1], exampleRows, exampleColumns)).toBe(1)
  expect(getScenicScore([3, 3], exampleRows, exampleColumns)).toBe(3)

  // Weirdly, locations on the edge receive score 0 as they don't see any trees at their edge
  expect(getScenicScore([0, 1], exampleRows, exampleColumns)).toBe(0)
})

test('Part 2: highest scenic score', () => {
  expect(getHighestScenicScore(exampleInput)).toBe(8)
})
