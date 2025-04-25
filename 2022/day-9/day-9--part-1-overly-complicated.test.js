import { expect, test } from 'vitest'
import {
  executeMove,
  getTailCells,
  initialState,
  modifyPlacement,
  parseMove,
} from './day-9--part-1-overly-complicated'

const exampleInput = `
R 4
U 4
L 3
D 1
R 4
D 1
L 5
R 2
`

const exampleMoves = [
  [
    'R 4',
    {
      head: [0, 4],
      tail: [0, 3],
      addedHeadHistory: [
        [0, 0],
        [0, 1],
        [0, 2],
        [0, 3],
      ],
      addedTailHistory: [
        [0, 0],
        [0, 1],
        [0, 2],
      ],
    },
  ],
  [
    'U 4',
    {
      head: [-4, 4],
      tail: [-3, 4],
      addedHeadHistory: [
        [0, 4],
        [-1, 4],
        [-2, 4],
        [-3, 4],
      ],
      addedTailHistory: [
        [0, 3],
        [-1, 4],
        [-2, 4],
      ],
    },
  ],
  [
    'L 3',
    {
      head: [-4, 1],
      tail: [-4, 2],
      addedHeadHistory: [
        [-4, 4],
        [-4, 3],
        [-4, 2],
      ],
      addedTailHistory: [
        [-3, 4],
        [-4, 3],
      ],
    },
  ],
  [
    'D 1',
    {
      head: [-3, 1],
      tail: [-4, 2],
      addedHeadHistory: [[-4, 1]],
      addedTailHistory: [],
    },
  ],
  [
    'R 4',
    {
      head: [-3, 5],
      tail: [-3, 4],
      addedHeadHistory: [
        [-3, 1],
        [-3, 2],
        [-3, 3],
        [-3, 4],
      ],
      addedTailHistory: [
        [-4, 2],
        [-3, 3],
      ],
    },
  ],
  [
    'D 1',
    {
      head: [-2, 5],
      tail: [-3, 4],
      addedHeadHistory: [[-3, 5]],
      addedTailHistory: [],
    },
  ],
  [
    'L 5',
    {
      head: [-2, 0],
      tail: [-2, 1],
      addedHeadHistory: [
        [-2, 5],
        [-2, 4],
        [-2, 3],
        [-2, 2],
        [-2, 1],
      ],
      addedTailHistory: [
        [-3, 4],
        [-2, 3],
        [-2, 2],
      ],
    },
  ],
  [
    'R 2',
    {
      head: [-2, 2],
      tail: [-2, 1],
      addedHeadHistory: [
        [-2, 0],
        [-2, 1],
      ],
      addedTailHistory: [],
    },
  ],
]

test('Properly parsing moves', () => {
  expect(parseMove('R 2')).toStrictEqual({
    direction: 'R',
    steps: 2,
  })
  expect(parseMove('U 33')).toStrictEqual({
    direction: 'U',
    steps: 33,
  })
  expect(parseMove('L 333 ajsdjs')).toStrictEqual({
    direction: 'L',
    steps: 333,
  })
  expect(parseMove('D 12 ajsdjs asdj 123 89 asjd')).toStrictEqual({
    direction: 'D',
    steps: 12,
  })
})

test('Modifying placement', () => {
  expect(modifyPlacement([0, 0], 'R')).toStrictEqual([0, 1])
  expect(modifyPlacement([0, 0], 'L')).toStrictEqual([0, -1])
  expect(modifyPlacement([0, 0], 'U')).toStrictEqual([-1, 0])
  expect(modifyPlacement([0, 0], 'D')).toStrictEqual([1, 0])
})

test('Executing moves', () => {
  for (let moveIndex = 0; moveIndex < exampleMoves.length; moveIndex++) {
    const [commandStr, endState] = exampleMoves[moveIndex]
    const previousMove = exampleMoves[moveIndex - 1]?.[1] || initialState
    const previousState = {
      head: previousMove.head,
      tail: previousMove.tail,
      headHistory: [
        ...initialState.headHistory,
        ...exampleMoves
          .slice(0, moveIndex)
          .flatMap((move) => move[1]?.addedHeadHistory || []),
      ],
      tailHistory: [
        ...initialState.tailHistory,
        ...exampleMoves
          .slice(0, moveIndex)
          .flatMap((move) => move[1]?.addedTailHistory || []),
      ],
    }

    expect(executeMove(commandStr, previousState)).toStrictEqual({
      head: endState.head,
      tail: endState.tail,
      headHistory: [...previousState.headHistory, ...endState.addedHeadHistory],
      tailHistory: [...previousState.tailHistory, ...endState.addedTailHistory],
    })
  }
})

test('Part 1: counts # of cells tail has been to', () => {
  expect(getTailCells(exampleInput)).toBe(13) // AoC's website answer
})
