import { createReport } from 'docx-templates'

import {
  wait,
  createFile,
  createFileAsync,
  getTemplateBySuffix
} from './util.js'
import {
  DOUBLE_DOT,
  EXTENSION_MAP,
  CATEGORY_VALUES,
  MIN_COUNT_DOWN_TIME,
  QUESTION_MAX_AMOUNT,
  DEFAULT_TEMPLATE_NAME,
  OUTPUT_FILE_EXTENSION,
  RETRY_WAIT_TIME_AFTER_NO_QUESTION,
  IS_ENABLE_CREATE_FILE_DURING_CONVERSATION
} from './constant.js'
import getAnswer from './get-answer.js'
import getQuestion from './get-question.js'
import getFreshCountDown from './get-fresh-count-down.js'

const template = getTemplateBySuffix(
  `${DEFAULT_TEMPLATE_NAME}${OUTPUT_FILE_EXTENSION}`,
  import.meta.url,
  DOUBLE_DOT
)

const handleCreateFileWrapper =
  (outputDir, handleCreateFile) => (name, value) => {
    if (OUTPUT_FILE_EXTENSION === EXTENSION_MAP.docx) {
      createReport({
        template,
        failFast: false,
        data: { body: value, title: name }
      }).then(
        (buffer) => {
          handleCreateFile(
            `${outputDir}/${name}${OUTPUT_FILE_EXTENSION}`,
            buffer
          )
        },
        (errors) => {
          if (Array.isArray(errors)) {
            console.error(errors)
            return
          }

          throw errors
        }
      )
      return
    }

    handleCreateFile(
      `${outputDir}/${name}${OUTPUT_FILE_EXTENSION}`,
      value.join('')
    )
  }

export default async function flock(outputDir) {
  const questions = await getQuestion(
    CATEGORY_VALUES,
    QUESTION_MAX_AMOUNT,
    outputDir
  )
  if (!questions.length) {
    const countDown = await getFreshCountDown()
    if (countDown && countDown > MIN_COUNT_DOWN_TIME) {
      console.log(
        `没有发现新的问题，等待 ${
          RETRY_WAIT_TIME_AFTER_NO_QUESTION / 1000
        } 秒之后，再次尝试请求问题列表`
      )
      await wait(RETRY_WAIT_TIME_AFTER_NO_QUESTION)
    }

    // 执行自身
    await flock(outputDir)
    return
  }

  let handleCreateFile
  if (IS_ENABLE_CREATE_FILE_DURING_CONVERSATION) {
    handleCreateFile = handleCreateFileWrapper(outputDir, createFileAsync)
  }

  const answers = await getAnswer(
    questions.map(({ pn, cName, queryName }) => ({ pn, cName, queryName })),
    handleCreateFile
  )

  if (!IS_ENABLE_CREATE_FILE_DURING_CONVERSATION) {
    answers.forEach(({ value, key: name }) => {
      handleCreateFileWrapper(outputDir, createFile)(name, value)
    })
  }
}
