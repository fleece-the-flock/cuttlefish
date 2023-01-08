import fs from 'fs'
import dotenv from 'dotenv-safe'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

import { CATEGORY_VALUES, QUESTION_MAX_AMOUNT } from './constant.js'

dotenv.config({ example: '.env' })

// https://stackoverflow.com/a/64383997/4441984
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

async function main() {
  const { default: getAnswer } = await import('./get-answer.js')
  const { default: getQuestion } = await import('./get-question.js')

  const answers = await getAnswer(
    (
      await getQuestion(CATEGORY_VALUES, QUESTION_MAX_AMOUNT)
    ).map(({ queryName }) => queryName)
  )

  // https://stackoverflow.com/q/37589161/4441984
  fs.mkdirSync(`${root}/docs`, { recursive: true })

  answers.forEach(({ key, value }) => {
    fs.writeFileSync(`${root}/docs/${key}.txt`, value, { encoding: 'utf-8' })
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
