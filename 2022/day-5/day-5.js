// Day 5: Supply Stacks - https://adventofcode.com/2022/day/5
import { parseInputByLine } from '../fsHelpers.js'

console.time('Execution time: ')

// Array of arrays - top items come first
// Part #1: move one crate at a time
const crateMover9000Stacks = []
// Part #2: move multiple crates at once
const crateMover9001Stacks = []

function handleMove9000(quantity, origin, destination) {
  // 9000 adds items one-by-one:
  for (let crateIndex = 0; crateIndex < quantity; crateIndex++) {
    crateMover9000Stacks[destination]?.unshift(
      crateMover9000Stacks[origin]?.[0],
    ) // add item to the start of the destination stack
    crateMover9000Stacks[origin] = crateMover9000Stacks[origin].slice(1) // remove top item from origin stack
  }
}

function handleMove9001(quantity, origin, destination) {
  crateMover9001Stacks[destination] = [
    // add items to the start of the destination stack
    ...crateMover9001Stacks[origin]?.slice(0, quantity),
    ...crateMover9001Stacks[destination],
  ]
  crateMover9001Stacks[origin] = crateMover9001Stacks[origin].slice(quantity) // remove top item from origin stack
}

function parseLine(line) {
  if (line.startsWith('[')) {
    const stackCount = Math.ceil((line.length - 1) / 4)
    for (let stackIndex = 0; stackIndex < stackCount; stackIndex++) {
      if (!crateMover9000Stacks[stackIndex]) {
        crateMover9000Stacks[stackIndex] = []
        crateMover9001Stacks[stackIndex] = []
      }

      // From the current stackIndex, get the associated stack entry in the line
      // Ex: for `stackIndex = 1`, "[R] [S] [F] [G]     [R]     [V] [Z]" -> `S`
      const columnStr = line
        .slice(stackIndex * 4 + 1, (stackIndex + 1) * 4 - 2)
        .trim()

      if (columnStr) {
        crateMover9000Stacks[stackIndex].push(columnStr)
        crateMover9001Stacks[stackIndex].push(columnStr)
      }
    }
  }

  if (line.startsWith(' ') || line.startsWith('\n')) {
    return
  }

  if (line.startsWith('move')) {
    const [_match, quantity, origin, destination] =
      /move (?<quantity>\d{1,}) from (?<origin>\d{1,}) to (?<destination>\d{1,})/g
        .exec(line)
        .map(Number)
    // Make it 0-based to match `stacks`' indexes
    handleMove9000(quantity, origin - 1, destination - 1)
    handleMove9001(quantity, origin - 1, destination - 1)
  }
}

parseInputByLine(import.meta.url, parseLine, () => {
  console.log(
    `Top crates w/ 9000 (part #1): `,
    crateMover9000Stacks.map((stack) => stack[0]).join(''),
  )
  console.log(
    `Top crates w/ 9001 (part #2): `,
    crateMover9001Stacks.map((stack) => stack[0]).join(''),
  )
  console.timeEnd('Execution time: ')
})
