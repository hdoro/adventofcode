// Day 8: Treetop Tree House - https://adventofcode.com/2022/day/8
import { getFullInput } from '../fsHelpers.js'

console.time('Execution time: ')

export function parseInput(input) {
  const rows = input
    .trim()
    .split('\n')
    .map((r) => r.split('').map(Number))
  const columnCount = rows.sort((a, b) => b.length - a.length)[0].length
  const columns = Array.from({ length: columnCount }).map((_, columnIndex) =>
    rows.map((row) => row[columnIndex]),
  )

  return {
    rows,
    columns,
  }
}

export function isTreeVisible([rowIndex, columnIndex], rows, columns) {
  const row = rows[rowIndex]
  const column = columns[columnIndex]
  const treeHeight = row[columnIndex]

  const fromLeft = row.slice(0, columnIndex).every((t) => t < treeHeight)
  const fromRight = row.slice(columnIndex + 1).every((t) => t < treeHeight)
  const fromTop = column.slice(0, rowIndex).every((t) => t < treeHeight)
  const fromBottom = column.slice(rowIndex + 1).every((t) => t < treeHeight)

  return fromLeft || fromRight || fromTop || fromBottom
}

export function getScenicScore([rowIndex, columnIndex], rows, columns) {
  const row = rows[rowIndex]
  const column = columns[columnIndex]
  const treeHeight = row[columnIndex]

  function getVisibleTreesFromCurrent(collection) {
    const tallerIndex = collection.findIndex((t) => t >= treeHeight)
    if (tallerIndex < 0) return collection.length

    return collection.findIndex((t) => t >= treeHeight) + 1
  }

  const fromLeft = getVisibleTreesFromCurrent(
    row.slice(0, columnIndex).reverse(), // reverse to go from current tree to the edge, not the other way around
  )
  const fromRight = getVisibleTreesFromCurrent(row.slice(columnIndex + 1))
  const fromTop = getVisibleTreesFromCurrent(
    column.slice(0, rowIndex).reverse(),
  )
  const fromBottom = getVisibleTreesFromCurrent(column.slice(rowIndex + 1))

  return fromLeft * fromRight * fromTop * fromBottom
}

export function getVisibleTrees(input) {
  const visible = [] // array of [rowIndex, columnIndex] tuples
  const { rows, columns } = parseInput(input)

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      if (isTreeVisible([rowIndex, columnIndex], rows, columns)) {
        visible.push([rowIndex, columnIndex])
      }
    }
  }

  return visible.length
}

export function getHighestScenicScore(input) {
  const scores = []
  const { rows, columns } = parseInput(input)

  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex]
    for (let columnIndex = 0; columnIndex < row.length; columnIndex++) {
      scores.push(getScenicScore([rowIndex, columnIndex], rows, columns))
    }
  }

  return Math.max(...scores)
}

console.log(
  'Part 1 - visible trees: ',
  getVisibleTrees(getFullInput(import.meta.url)),
)

console.log(
  'Part 2 - highest scenic score: ',
  getHighestScenicScore(getFullInput(import.meta.url)),
)

console.timeEnd('Execution time: ')
