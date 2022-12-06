// Day 4: Camp Cleanup - https://adventofcode.com/2022/day/4
import { parseInputByLine } from '../fsHelpers.js'

console.time('Execution time: ')

let unjustAssigments = 0
let overlappedAssignments = 0

function parseSectionAssignment(str) {
  const [left, right] = str.split(',').map((elfAssigment) => {
    const [start, end] = elfAssigment.split('-').map(Number)
    return Array.from({ length: end - start + 1 }).map(
      (_, index) => index + start,
    )
  })

  const shortest = left.length > right.length ? right : left
  const longest = left.length > right.length ? left : right

  // Part 1: assignments that are fully contained in others
  const shortestFullyInLongest = shortest.every((num) => longest.includes(num))
  if (shortestFullyInLongest) {
    unjustAssigments += 1
  }

  // Part 2: assignments that overlap
  const hasOverlap = shortest.some((num) => longest.includes(num))
  if (hasOverlap) {
    overlappedAssignments += 1
  }
}

parseInputByLine(import.meta.url, parseSectionAssignment, () => {
  console.log(`Unjust assignments (part 1): `, unjustAssigments)
  console.log(`Assignments with overlap (part 2): `, overlappedAssignments)
  console.timeEnd('Execution time: ')
})
