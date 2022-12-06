// Calory counting: https://adventofcode.com/2022/day/1
/**
 * Intuitively:
 *
 * 1. split the input between elves
 * 2. count the total calories of each
 * 3. sort them by total count
 * 4. get the first item in this collection (max)
 */
import { getFullInput } from '../fsHelpers.js'

console.time('Execution:')
const input = getFullInput(import.meta.url)

// #1: let's JSON stringify to see the newline `\n` pattern
// console.log(JSON.stringify(input))

// #2: let's use the \n\n pattern we noticed to split the elves
const elvesString = input.split('\n\n')

/**
 * #3: convert each elf's foods into an array of numbers of calories
 * Array of strings like '2074\n3476\n4064\n9446\n2889\n4871\n6298\n2970\n8588'
 * 1. We need to split by `\n` (ex: `[ "2074", "3476", "4064", "9446", "2889", "4871", "6298", "2970", "8588" ]`)
 * 2. convert strings into numbers
 */
const elvesFoodItems = elvesString.map((str) => str.split('\n').map(Number))

// #4 count the total calories for each elf
const elvesCalories = elvesFoodItems.map((items) =>
  items.reduce((sum, item) => sum + item, 0),
)

const highestCaloryByElf = Math.max(...elvesCalories)

const orderedByCalories = elvesCalories.sort((a, b) => b - a)

const top3 = orderedByCalories.slice(0, 3)

const top3Calories = top3.reduce((sum, calories) => sum + calories, 0)

console.log({ highestCaloryByElf, top3Calories })

console.timeEnd('Execution:')
