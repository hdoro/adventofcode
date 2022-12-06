import { createReadStream, readFileSync } from 'node:fs'
import path from 'node:path'
import { createInterface } from 'node:readline'
import { fileURLToPath } from 'node:url'

export function getFullInput(importUrl) {
  const inputPath = path.join(
    path.dirname(fileURLToPath(importUrl)),
    'input.txt',
  )
  return readFileSync(inputPath, {
    encoding: 'utf-8',
  })
}

export function parseInputByLine(importUrl, onLineRead, onClose) {
  const rl = createInterface({
    input: createReadStream(
      path.join(path.dirname(fileURLToPath(importUrl)), 'input.txt'),
    ),
  })

  rl.on('line', onLineRead)
  rl.on('close', onClose)
}
