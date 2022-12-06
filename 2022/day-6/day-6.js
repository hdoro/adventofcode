// Day 6: Tuning Trouble - https://adventofcode.com/2022/day/6
import { getFullInput } from '../fsHelpers.js'

console.time('Execution:')
const input = getFullInput(import.meta.url)

/**
 * Solution:
 * 1. go through each character
 * 2. construct an array of the character + the next 3 (4 total)
 * 3. initialize a Set from it
 * 4. if Set.size < 4, go to the next character
 * 5. otherwise, log the index of the current character
 */

// packets happen every 4 unique characters
const PACKET_SIZE = 4
const packetMarkersIndex = []

// messages: 14 unique chars
const MESSAGE_SIZE = 14
const messageMarkersIndex = []

for (let charIndex = 0; charIndex < input.length; charIndex++) {
  const packetCharSet = new Set(
    input.slice(charIndex, charIndex + PACKET_SIZE).split(''),
  )
  if (packetCharSet.size === PACKET_SIZE) {
    packetMarkersIndex.push(charIndex + PACKET_SIZE)
  }

  const messageCharSet = new Set(
    input.slice(charIndex, charIndex + MESSAGE_SIZE).split(''),
  )
  if (messageCharSet.size === MESSAGE_SIZE) {
    messageMarkersIndex.push(charIndex + MESSAGE_SIZE)
  }
}

console.log(`First packet marker position (part #1): `, packetMarkersIndex[0])
console.log(`First message marker position (part #2): `, messageMarkersIndex[0])
console.timeEnd('Execution:')
