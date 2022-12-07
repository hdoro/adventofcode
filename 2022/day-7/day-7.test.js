import { expect, test } from 'vitest'
import {
  calculateDirSizes,
  calculateTotalDirSize,
  getSizeOfDirToDelete,
  parseInput,
} from './day-7'

const exampleInput = `$ cd /
$ ls
dir a
14848514 b.txt
8504156 c.dat
dir d
$ cd a
$ ls
dir e
29116 f
2557 g
62596 h.lst
$ cd e
$ ls
584 i
$ cd ..
$ cd ..
$ cd d
$ ls
4060174 j
8033020 d.log
5626152 d.ext
7214296 k`

const exampleFilesByPath = {
  '/a/e/i': 584,
  '/a/f': 29116,
  '/a/g': 2557,
  '/a/h.lst': 62596,
  '/b.txt': 14848514,
  '/c.dat': 8504156,
  '/d/j': 4060174,
  '/d/d.log': 8033020,
  '/d/d.ext': 5626152,
  '/d/k': 7214296,
}

const exampleDirsBySize = {
  '/a/e': exampleFilesByPath['/a/e/i'],
  '/a':
    exampleFilesByPath['/a/e/i'] +
    exampleFilesByPath['/a/f'] +
    exampleFilesByPath['/a/g'] +
    exampleFilesByPath['/a/h.lst'],
  '/d':
    exampleFilesByPath['/d/j'] +
    exampleFilesByPath['/d/d.log'] +
    exampleFilesByPath['/d/d.ext'] +
    exampleFilesByPath['/d/k'],
  get '/'() {
    return (
      this['/d'] +
      this['/a'] +
      exampleFilesByPath['/b.txt'] +
      exampleFilesByPath['/c.dat']
    )
  },
}

test('parse input', () => {
  expect(parseInput(exampleInput)).toStrictEqual(exampleFilesByPath)
})

test("calculate directories' sizes", () => {
  const dirSizes = calculateDirSizes(parseInput(exampleInput))
  expect(dirSizes).toStrictEqual(exampleDirsBySize)
  expect(dirSizes['/']).toBe(48381165) // static value from AoC website
})

test('get the total size of all directories', () => {
  const dirSizes = calculateDirSizes(parseInput(exampleInput))

  expect(calculateTotalDirSize(dirSizes, 100000)).toBe(
    exampleDirsBySize['/a'] + exampleDirsBySize['/a/e'],
  )
  expect(calculateTotalDirSize(dirSizes, 100000)).toBe(95437) // static answer from AoC website
})

test('get the size of the smallest directory we can delete to free up space', () => {
  const dirSizes = calculateDirSizes(parseInput(exampleInput))

  expect(getSizeOfDirToDelete(dirSizes)).toBe(exampleDirsBySize['/d'])
  expect(getSizeOfDirToDelete(dirSizes)).toBe(24933642) // static answer from AoC website
})
