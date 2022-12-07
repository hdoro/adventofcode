// Day 7: No Space Left On Device - https://adventofcode.com/2022/day/7
import path from 'path'
import { getFullInput } from '../fsHelpers.js'

console.time('Execution time: ')

const filesByPath = parseInput(getFullInput(import.meta.url))
const dirsBySize = calculateDirSizes(filesByPath)

console.log(
  'Part #1, total size of directories with up to 100000 bytes: ',
  calculateTotalDirSize(dirsBySize, 100000),
)

console.log(
  'Part #2, size of smallest directory we can delete to free-up space: ',
  getSizeOfDirToDelete(dirsBySize),
)

console.timeEnd('Execution time: ')

export function parseInput(inputTxt) {
  let currentDirectory = '/'
  const filesByPath = {}

  function parseCommand(line) {
    const command = line.replace('$', '').trim()
    if (!command.startsWith('cd')) {
      // No need to do anything about ls, we only care about its output
      return
    }

    const cdTarget = command.split(' ')[1]
    currentDirectory = path.join(currentDirectory, cdTarget)
  }

  function parseLine(line) {
    if (line.startsWith('$')) {
      return parseCommand(line)
    }

    if (line.startsWith('dir')) {
      // No need to do anything about dirs
      return
    }

    if (!line) return

    const [sizeStr, filename] = line.split(' ')
    filesByPath[path.join(currentDirectory, filename)] = Number(sizeStr)
  }

  inputTxt.trim().split('\n').forEach(parseLine)

  return filesByPath
}

export function calculateDirSizes(byPath) {
  return Object.entries(byPath).reduce((dirSizes, [filePath, fileSize]) => {
    const parentDirectories = filePath
      .split('/')
      .map((_segment, index, pathSegments) => {
        // Skip files (last segment)
        if (index === pathSegments.length - 1) return

        return path.join('/', ...pathSegments.slice(0, index + 1))
      })
      .filter(Boolean)

    return {
      ...dirSizes,
      ...Object.fromEntries(
        parentDirectories.map((dir) => [dir, (dirSizes[dir] || 0) + fileSize]),
      ),
    }
  }, {})
}

export function calculateTotalDirSize(dirsBySize, maxDirSize = 0) {
  return Object.values(dirsBySize)
    .filter((size) => maxDirSize === 0 || size <= maxDirSize)
    .reduce((totalSize, curDirSize) => totalSize + curDirSize)
}

// Part 2: get the size of the smallest directory we can delete to free up space
export function getSizeOfDirToDelete(
  dirsBySize,
  totalSpace = 70000000,
  desiredSpace = 30000000,
) {
  // Get the total size currently occupied
  const freeSpace = totalSpace - dirsBySize['/']
  const spaceToFree = desiredSpace - freeSpace

  const smallestToLargestDirs = Object.values(dirsBySize).sort((a, b) => a - b)
  return smallestToLargestDirs.find((dirSize) => dirSize >= spaceToFree)
}
