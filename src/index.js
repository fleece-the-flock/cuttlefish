import { resolve } from 'path'
import dotenv from 'dotenv-safe'

import {
  OUTPUT_PATH,
  CATEGORY_VALUES,
  QUESTION_MAX_AMOUNT,
  OUTPUT_FILE_EXTENSION,
  IS_ENABLE_CREATE_FILE_DURING_CONVERSATION
} from './constant.js'
import { mkdirp, createFile, getDirname, createFileAsync } from './util.js'

dotenv.config({ example: '.env' })

const root = resolve(getDirname(import.meta.url), '..')

async function main() {
  const { default: getAnswer } = await import('./get-answer.js')
  const { default: getQuestion } = await import('./get-question.js')

  let handleCreateFile
  if (IS_ENABLE_CREATE_FILE_DURING_CONVERSATION) {
    handleCreateFile = (name, value) => {
      createFileAsync(
        `${root}/${OUTPUT_PATH}/${name}${OUTPUT_FILE_EXTENSION}`,
        value
      )
    }
  }

  mkdirp(`${root}/${OUTPUT_PATH}`)

  const answers = await getAnswer(
    (
      await getQuestion(CATEGORY_VALUES, QUESTION_MAX_AMOUNT)
    ).map(({ queryName }) => queryName),
    handleCreateFile
  )

  if (!IS_ENABLE_CREATE_FILE_DURING_CONVERSATION) {
    answers.forEach(({ value, key: name }) => {
      createFile(
        `${root}/${OUTPUT_PATH}/${name}${OUTPUT_FILE_EXTENSION}`,
        value
      )
    })
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
