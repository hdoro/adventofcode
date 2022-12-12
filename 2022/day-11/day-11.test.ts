// --- Day 11: Monkey in the Middle --- https://adventofcode.com/2022/day/11
import { expect, test } from 'vitest'
import { getFullInput } from '../fsHelpers'

interface Monkey {
  items: number[]
  operation: string
  divideBy: number
  target: {
    true: number
    false: number
  }
  itemsHandled: number
}

function parseInput(input: string) {
  const monkeys = input
    .trim()
    .split(/Monkey \d:/)
    .filter(Boolean)
    .map((monkey) => {
      const items = monkey
        .match(/Starting items: ([\d, ]*)/)?.[1]
        ?.split(',')
        .map((num) => Number(num.trim()))

      const operation = monkey.match(/Operation: new = ([\w\d\*\+ ]*)/)?.[1]

      const divideBy = Number(monkey.match(/Test: divisible by (\d{1,})/)?.[1])

      const targetIfTrue = Number(
        monkey.match(/If true: throw to monkey (\d{1,})/)?.[1],
      )

      const targetIfFalse = Number(
        monkey.match(/If false: throw to monkey (\d{1,})/)?.[1],
      )

      return {
        items,
        operation,
        divideBy,
        target: {
          true: targetIfTrue,
          false: targetIfFalse,
        },
        itemsHandled: 0,
      } as Monkey
    })

  return {
    monkeys,
    largeNumModulo: monkeys.reduce(
      (product, monkey) => monkey.divideBy * product,
      1,
    ),
  }
}

function playRound({
  monkeys: initialMonkeys,
  divideWorryLevels = true,
  largeNumModulo,
}: {
  monkeys: Monkey[]
  divideWorryLevels?: boolean
  largeNumModulo: number
}) {
  const monkeys = JSON.parse(JSON.stringify(initialMonkeys)) // deep clone to prevent side-effects

  for (let monkeyIndex = 0; monkeyIndex < monkeys.length; monkeyIndex++) {
    const monkey = monkeys[monkeyIndex]
    monkey.items.forEach((worryLevel) => {
      // Prevent worryLevels from going into "ridiculous" values that Javascript can't process.
      // We reduce every number to the minimal value it can assume while still keeping monkey divisions precise.
      // As I understand it, we do this by changing numbers to the remainder of of the division by a `largeNumModulo`,
      // that is a common dividend among all monkeys' divideBy (see parseInput above).
      // @TODO: better understand this part through theorem of Sun-tzu Suan-ching - credits to Sam van Gool for pointing the way
      let newWorry = worryLevel % largeNumModulo

      newWorry = eval(
        monkey.operation.replace(/old/g, newWorry as number),
      ) as number

      if (divideWorryLevels) {
        newWorry = Math.floor(newWorry / 3)
      }
      const divisible = newWorry % monkey.divideBy === 0

      monkeys[monkey.target[String(divisible)]].items.push(newWorry) // send to target
    })
    monkey.itemsHandled += monkey.items.length
    monkey.items = [] // clean items, they were already sent to other monkeys
  }

  return monkeys
}

function solve(input: string, rounds: number, divideWorryLevels = true) {
  const parsed = parseInput(input)
  let finalState = parsed.monkeys
  for (let round = 0; round < rounds; round++) {
    finalState = playRound({
      monkeys: finalState,
      divideWorryLevels,
      largeNumModulo: parsed.largeNumModulo,
    })
  }

  return finalState
    .sort((a, b) => b.itemsHandled - a.itemsHandled)
    .slice(0, 2)
    .reduce((monkeyBusiness, monkey) => monkeyBusiness * monkey.itemsHandled, 1)
}

const exampleInput = `
Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1
`

test('Day #11, example input', () => {
  expect(solve(exampleInput, 20)).toBe(10605)
  expect(solve(exampleInput, 10000, false)).toBe(2713310158)
})

console.log('Day #11, part 1: ', solve(getFullInput(import.meta.url), 20))
console.log(
  'Day #11, part 2: ',
  solve(getFullInput(import.meta.url), 10000, false),
)

/**
 * READING NOTES
 * Worry level
 *
 * Starting items: worryLevel[] (sets the worry level)
 *
 * Operation: how to modify worryLevel of current item
 *  Ex: new = old * old ->
 *
 * Test: dependening on worryLevel, where the monkey will send the item
 *
 * Between operation and test, Math.floor(worryLevel / 3)
 *  - Q: are there exceptions to this? ("if no damage done to the item")
 *
 * Each monkey's turn is a *round* - rounds go from monkey 0 to n, looping back to 0
 *
 * When monkey sends item to another, it goes to the end of the target's starting items
 *
 * Part 1:
 *  - count how many inspections each monkey performed after 20 rounds
 *  - multiply the times of the 2 most active (level of "monkey business")
 */
