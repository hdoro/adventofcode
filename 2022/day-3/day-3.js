// Day 3: Rucksack Reorganization - https://adventofcode.com/2022/day/3
import { parseInputByLine } from '../fsHelpers.js'

console.time('Execution time: ')

let prioritySum = 0

// Part 1: get the item shared across left and right rucksacks, parse its priority and add it to prioritySum
function parseIndividualRucksack(str) {
  const middle = Math.floor(str.length / 2)
  const left = str.split('').slice(0, middle)
  const right = str.split('').slice(middle)

  const repeatedItem = left.find((item) => right.includes(item))

  if (!repeatedItem) return

  prioritySum += parseItemPriority(repeatedItem)
}

let groupPrioritySum = 0
let groupToAnalyze = []
// Part 2: analyze groups of 3 rucksacks and find the item shared across all of them. This will be the group's badge. Sum it to groupPrioritySum.
function parseRucksackGroup(str) {
  groupToAnalyze.push(str.split(''))

  if (groupToAnalyze.length !== 3) return

  const repeatedItem = groupToAnalyze[0].find(
    (item) =>
      groupToAnalyze[1].includes(item) && groupToAnalyze[2].includes(item),
  )
  groupPrioritySum += parseItemPriority(repeatedItem)

  groupToAnalyze = []
}

function parseItemPriority(item) {
  return (
    item.charCodeAt(0) -
    // Consider the starting code of the lower-cased and the upper-cased alphabet differently
    (/[A-Z]/g.test(item)
      ? // `charCode` of "a" is 97;
        38
      : //  of "A" is 65
        96)
  )
}

function parseRucksack(str) {
  parseIndividualRucksack(str)
  parseRucksackGroup(str)
}

parseInputByLine(import.meta.url, parseRucksack, () => {
  console.log(`Total priority of each sack (part 1): `, prioritySum)
  console.log(`Total priority of groups' badges (part 2): `, groupPrioritySum)
  console.timeEnd('Execution time: ')
})
