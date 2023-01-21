import { resolve } from 'path'
import dotenv from 'dotenv-safe'

import {
  wait,
  mkdirp,
  createFile,
  getDirname,
  createFileAsync
} from './util.js'
import {
  OUTPUT_PATH,
  CATEGORY_VALUES,
  QUESTION_MAX_AMOUNT,
  OUTPUT_FILE_EXTENSION,
  RETRY_WAIT_TIME_AFTER_EXCEPTION,
  IS_ENABLE_CREATE_FILE_DURING_CONVERSATION
} from './constant.js'

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
    ).map(({ pn, cName, queryName }) => ({ pn, cName, queryName })),
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

  wait(RETRY_WAIT_TIME_AFTER_EXCEPTION).then(main)
})
