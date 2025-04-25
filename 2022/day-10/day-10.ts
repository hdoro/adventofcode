import { getFullInput } from '../fsHelpers'

export function parseCycles(input: string): number[] {
  return input
    .trim()
    .split('\n')
    .reduce((cycles, instruction) => {
      const pastValue = cycles.slice(-1)[0] || 1

      if (instruction.startsWith('noop')) {
        return [...cycles, pastValue]
      }

      const quantity = Number(instruction.split(' ')[1])

      return [...cycles, pastValue, pastValue + quantity]
    }, [] as number[])
}

export function solvePart1(
  input: string,
  cyclesToCheck: number[] = [20, 60, 100, 140, 180, 220],
): number {
  const cycles = parseCycles(input)

  return cycles.reduce((sum, _registerAfterCycle, cycleIndex) => {
    if (!cyclesToCheck.includes(cycleIndex + 1)) {
      return sum
    }

    const registerDuringCycle = cycles[cycleIndex - 1]

    const signalStrength = registerDuringCycle * (cycleIndex + 1)
    return sum + signalStrength
  }, 0)
}

console.log(
  'Part 1: sum of signal strength of 40th cycles from 20-220',
  solvePart1(getFullInput(import.meta.url)),
)
