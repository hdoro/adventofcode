// --- Day 13: Distress Signal --- https://adventofcode.com/2022/day/13
import { expect, test } from 'vitest'
import { getFullInput } from '../fsHelpers'

const exampleInput = `
[1,1,3,1,1]
[1,1,5,1,1]

[[1],[2,3,4]]
[[1],4]

[9]
[[8,7,6]]

[[4,4],4,4]
[[4,4],4,4,4]

[7,7,7,7]
[7,7,7]

[]
[3]

[[[]]]
[[]]

[1,[2,[3,[4,[5,6,7]]]],8,9]
[1,[2,[3,[4,[5,6,0]]]],8,9]
`

type Packet = (number | Packet)[]

type DistressSignal = {
  left: Packet
  right: Packet
}

function parseInput(input: string): DistressSignal[] {
  return input
    .trim()
    .split('\n\n')
    .map((pair) => {
      const lines = pair.split('\n').map((l) => l.trim())
      return {
        left: eval(lines[0]),
        right: eval(lines[1]),
      }
    })
}

function isInRightOrder({
  left,
  right,
}: {
  left: number | Packet
  right: number | Packet
}) {
  // 2. if both values are integers, the right order is if left < right
  if (typeof left === 'number' && typeof right === 'number') {
    // If the same, let the next items decide
    if (left === right) return undefined

    return left < right
  }

  if (!Array.isArray(left)) {
    return isInRightOrder({ left: [left], right })
  }

  if (!Array.isArray(right)) {
    return isInRightOrder({ left, right: [right] })
  }

  // Credits on while loop: Jonathan Rippy
  // My initial approach used `left.reduce`, which was passing the test but failing the result.
  // Couldnt' spot exactly what was the issue, but I think it had to do with when left is shorter than right.
  // See `isInRightOrderOld` commented below

  // deep clone to prevent modifying left & right
  const value = JSON.parse(JSON.stringify({ left, right }))

  while (true) {
    if (value.left.length === 0) {
      return value.right.length > 0 ? true : undefined
    }
    if (value.right.length === 0) {
      if (value.left.length > 0) return false
    }
    const nestedResult = isInRightOrder({
      left: value.left[0],
      right: value.right[0],
    })
    if (nestedResult !== undefined) return nestedResult

    value.left.splice(0, 1)
    value.right.splice(0, 1)
  }
}

// function isInRightOrderOld({ left, right }: DistressSignal, isRoot = false) {
//   // 1. compare index by index.
//   // We have the right order if `left` runs out of items before `right`, so we can run through it by itself.
//   const ordered = left.reduce((inRightOrder, _, index) => {
//     // If any past item was clearly unordered, that's the final answer
//     if (inRightOrder === false) return false

//     const value = { left: left[index], right: right[index] }

//     // If no right, use the last value's check - if undefined, all numbers were equal until now and we've got an unordered signal
//     if (value.right === undefined) {
//       return inRightOrder === true
//     }

//     // 2. if both values are integers, the right order is if left < right
//     if (typeof value.left === 'number' && typeof value.right === 'number') {
//       // If the same, let the next items decide
//       if (value.left === value.right) return inRightOrder

//       return value.left < value.right
//     }

//     // 3. if one is a list and the other an integer, wrap the integer in a list & run 3.
//     if (!Array.isArray(value.left)) {
//       value.left = [value.left]
//     }
//     if (!Array.isArray(value.right)) {
//       value.right = [value.right]
//     }

//     // 4. when values are lists (which at this point they'll be given 2. & 3.), recursive check
//     return isInRightOrder(value as DistressSignal)
//   }, undefined as boolean | undefined)

//   return isRoot ? ordered !== false : ordered
// }

function solve1(input: string) {
  const parsed = parseInput(input)
  const solved = parsed.map((signal) => ({
    ...signal,
    // ordered: isInRightOrder(signal, true),
    ordered: isInRightOrder(signal),
  }))

  return solved.reduce((orderedIndexSum, { ordered }, index) => {
    if (!ordered) return orderedIndexSum

    return orderedIndexSum + index + 1
  }, 0)
}

const DIVIDER_PACKETS = [[[2]], [[6]]]
function solve2(input: string) {
  const parsed = [
    ...parseInput(input),
    { left: DIVIDER_PACKETS[0], right: DIVIDER_PACKETS[1] },
  ]
  const orderedSignals = parsed
    .flatMap(({ left, right }) => [left, right])
    .sort((left, right) => {
      return isInRightOrder({ left, right }) ? -1 : 1
    })
  const signalsString = orderedSignals.map((signal) => JSON.stringify(signal))

  return (
    (signalsString.indexOf(JSON.stringify(DIVIDER_PACKETS[0])) + 1) *
    (signalsString.indexOf(JSON.stringify(DIVIDER_PACKETS[1])) + 1)
  )
}

test('Day #13, example input', () => {
  expect(solve1(exampleInput)).toBe(13)
  expect(solve2(exampleInput)).toBe(140)
})

console.log('Day #13, part 1: ', solve1(getFullInput(import.meta.url)))
console.log('Day #13, part 2: ', solve2(getFullInput(import.meta.url)))

/**
 * READING NOTES
 *
 * - Inputs come in pairs (`left` vs. `right`)
 * - Goal: check if inputs are in the right order
 * - Impl: I can `eval` each input line as it matches JS
 * - How to compare:
 *  1. compare index by index
 *    1.1 if `left` runs out of items before, right order; vice-versa
 *  2. if both values are integers, the right order is if left <= right
 *  3. if values are lists, recursive check
 *  4. if one is a list and the other an integer, wrap the integer in a list & run 3.
 */
