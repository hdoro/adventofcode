// --- Day 12: Hill Climbing Algorithm --- https://adventofcode.com/2022/day/12
import { expect, test } from 'vitest'
import { getFullInput } from '../fsHelpers'

const exampleInput = `
Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi
`

function getHeight(char: string) {
  return char.charCodeAt(0) - 96
}

function signature(rowIndex: number, colIndex: number) {
  return `${rowIndex}:${colIndex}`
}

interface Node {
  height: number
  edges: Record<'up' | 'down' | 'left' | 'right', string | null>
}

function parseInput(input: string) {
  let position = '0:0'
  let bestSignal = '0:0'
  const grid = input
    .trim()
    .split('\n')
    .map((line, rowIndex) => {
      return line.split('').map((char, colIndex) => {
        let heightChar = char
        if (char === 'S') {
          position = signature(rowIndex, colIndex)
          heightChar = 'a'
        }
        if (char === 'E') {
          bestSignal = signature(rowIndex, colIndex)
          heightChar = 'z'
        }
        return getHeight(heightChar)
      })
    })

  const nodes = grid.reduce((nodes, row, rowIndex) => {
    return {
      ...nodes,
      ...Object.fromEntries(
        row.map((height, colIndex) => {
          const neighbors = {
            up: [rowIndex - 1, colIndex],
            down: [rowIndex + 1, colIndex],
            left: [rowIndex, colIndex - 1],
            right: [rowIndex, colIndex + 1],
          }
          const node = {
            height,
            edges: Object.fromEntries(
              Object.entries(neighbors).map(([dir, coords]) => {
                const neighbor = grid[coords[0]]?.[coords[1]]
                return [
                  dir,
                  typeof neighbor === 'number' && neighbor <= height + 1
                    ? signature(...(coords as [number, number]))
                    : null,
                ]
              }),
            ),
          }
          return [`${rowIndex}:${colIndex}`, node]
        }),
      ),
    }
  }, {}) as Record<string, Node>

  return {
    nodes,
    position,
    bestSignal,
  }
}

/**
 *
 * ==== Dijkstra's shortest path algorithm ====
 * Start by visiting start. Visiting pattern:
 *
 * #1 For each unvisited neighbor/edge, from closest to most distant (known distance),
 * add their distance/length to their current entry in `table`.
 *  - For this exercise, all lengths = 1, so I can do
 *    Object.entries(node.edges).filter(hasntBeenVisited)
 *
 * #2 If this new distance is smaller than what was previously there in `table`,
 * set the sumed distance and the current node's id to `table`
 *
 * #3 Repeat this for all valid edges
 *
 * # 4 Once done:
 *  4.1 remove node from unvisited
 *  4.2 add to visited
 *  4.3 visit closest node and repeat 1-4 for it
 *
 * #5 When there are no more vertices to visit, get the `target` key in `table` and
 * reconstruct the path from `previousNode`
 */
function parseGraphTable(
  graph: Record<string, Node>,
  start: string,
  // target: string, // @TODO: can I simply stop when I reach `target` or would that lead to wrong results?
) {
  const visited = [] as string[]
  const unvisited = Object.keys(graph)
  const table = Object.fromEntries(
    Object.entries(graph).map(([nodeId, node]) => [
      nodeId,
      {
        shortestDistance: nodeId === start ? 0 : Infinity,
        previousVertex: null as string | null,
      },
    ]),
  )

  while (unvisited.length > 0) {
    const currentNodeId = unvisited.sort(
      (a, b) => table[a].shortestDistance - table[b].shortestDistance,
    )[0]

    Object.entries(graph[currentNodeId].edges as Record<string, string>)
      .filter(
        ([_dir, targetNode]) => targetNode && unvisited.includes(targetNode),
      )
      .forEach(([_dir, neighborId]: [string, string]) => {
        const distanceToStart =
          table[currentNodeId].shortestDistance === Infinity
            ? 1
            : table[currentNodeId].shortestDistance + 1

        if (distanceToStart < table[neighborId].shortestDistance) {
          table[neighborId] = {
            previousVertex: currentNodeId,
            shortestDistance: distanceToStart,
          }
        }
      })

    unvisited.splice(unvisited.indexOf(currentNodeId), 1)
    visited.push(currentNodeId)
  }

  return table
}

function solve1(input: string) {
  const parsed = parseInput(input)
  const graphTable = parseGraphTable(parsed.nodes, parsed.position)

  return graphTable[parsed.bestSignal]?.shortestDistance || 0
}

// SLOOOOOOW implementation (~7 min to compute) - I wonder if I could make a start-agnostic graph to avoid running so many `parseGraphTable`?
function solve2(input: string) {
  const parsed = parseInput(input)
  const shortestPathsFromLowestStarts = Object.entries(parsed.nodes)
    .filter(
      ([_nodeId, node]) => node.height === getHeight('a'), // lowest starts
    )
    .map(([nodeId]) => {
      const graphTable = parseGraphTable(parsed.nodes, nodeId)
      return graphTable[parsed.bestSignal]?.shortestDistance || 0
    })
    .sort((a, b) => a - b)

  return shortestPathsFromLowestStarts[0]
}

test('Day #12, example input', () => {
  expect(solve1(exampleInput)).toBe(31)
  expect(solve2(exampleInput)).toBe(29)
})

console.log('Day #12, part 1: ', solve1(getFullInput(import.meta.url)))
console.log('Day #12, part 2: ', solve2(getFullInput(import.meta.url)))

/**
 * READING NOTES
 *
 * Input is a heightmap
 *  - will need to convert to grid of numbers based on letters (a is lowest, z is highest)
 *
 * S is current position (lowest height, `a`)
 * E is best signal (`z`)
 *
 * Goal: get from S to E in as few steps as possible
 * Constraint: you can't move up more than one height, but going down is irrestricted
 *
 * Gut feeling: model as a graph w/ constraint imbued and use the shortest path algorithms
 */
