import { getFullInput } from '../fsHelpers'
import fs from 'fs'

type Cycle = {
  start: number
  end: number
}

export function parseCycles(input: string): Cycle[] {
  return input
    .trim()
    .split('\n')
    .reduce((cycles, instruction) => {
      const pastValue = cycles.slice(-1)[0]?.end || 1
      const noop = { start: pastValue, end: pastValue }

      if (instruction.startsWith('noop')) {
        return [...cycles, noop]
      }

      const quantity = Number(instruction.split(' ')[1])

      return [...cycles, noop, { start: pastValue, end: pastValue + quantity }]
    }, [] as Cycle[])
}

export function solvePart1(
  input: string,
  cyclesToCheck: number[] = [20, 60, 100, 140, 180, 220],
): number {
  const cycles = parseCycles(input)
  fs.writeFileSync('cyclespart1.json', JSON.stringify(cycles, null, 2))

  return cycles.reduce((sum, cycle, cycleIndex) => {
    if (!cyclesToCheck.includes(cycleIndex + 1)) {
      return sum
    }

    const signalStrength = cycle.start * (cycleIndex + 1)
    return sum + signalStrength
  }, 0)
}

console.log(
  'Part 1: sum of signal strength of 40th cycles from 20-220',
  solvePart1(getFullInput(import.meta.url)),
  // Getting 14220 when I should be getting 12880
)
