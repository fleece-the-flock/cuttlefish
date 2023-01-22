import { oraPromise } from 'ora'
import { ChatGPTAPIBrowser } from 'chatgpt'

import {
  IS_ENABLE_FOLLOW_UP,
  THE_NUMBER_OF_FOLLOW_UP,
  NEXT_PROMPT_MESSAGE_PREFIX,
  CURRENT_PROMPT_MESSAGE_SUFFIX
} from './constant.js'

/**
 * 在使用 ora 的情况下，获取答案
 *
 * @param {ChatGPTAPIBrowser} api chatgpt 实例
 * @param {string} prompt 提示
 * @param {null|import('chatgpt').SendMessageOptions=} options 选项
 * @param {string=} text ora 的文本
 */
const getAnswerWithOraPromise = (api, prompt, options, text) =>
  oraPromise(
    api.sendMessage(prompt, { timeoutMs: 2 * 60 * 1000, ...options }),
    { text: text ?? prompt }
  )

/**
 * 获取答案过程
 *
 * @param {ChatGPTAPIBrowser} api chatgpt 实例
 * @param {Answer[]} answers 答案
 * @param {Question[]} prompts 提示
 * @param {CreateFileHandler=} handleCreateFile 创建文件的处理函数
 */
async function doGetAnswer(api, answers, prompts, handleCreateFile) {
  if (!prompts || !prompts.length) return

  const [{ pn, cName, queryName }, ...rest] = prompts

  let [answer, segments, conversationId, parentMessageId] = ['', [], '', '']

  try {
    ;({
      conversationId,
      response: answer,
      messageId: parentMessageId
    } = await getAnswerWithOraPromise(
      api,
      `${queryName}${CURRENT_PROMPT_MESSAGE_SUFFIX}`,
      null,
      `正在获取位于【${cName}】类别下第 ${pn + 1} 页【${queryName}】的答案`
    ))

    segments.push(answer)

    if (IS_ENABLE_FOLLOW_UP) {
      for (let i = 0; i < THE_NUMBER_OF_FOLLOW_UP; i++) {
        ;({
          conversationId,
          response: answer,
          messageId: parentMessageId
        } = await getAnswerWithOraPromise(
          api,
          `${NEXT_PROMPT_MESSAGE_PREFIX}${queryName}`,
          { conversationId, parentMessageId }
        ))

        if (!segments.includes(answer)) segments.push(answer)
      }
    }
  } catch {
    segments = []
  }

  handleCreateFile?.(queryName, segments)
  answers.push({ key: queryName, value: segments })

  await doGetAnswer(api, answers, rest, handleCreateFile)
}

/**
 * 获取答案
 *
 * @param {Question[]} prompt 提示
 * @param {CreateFileHandler=} handleCreateFile 创建文件的回调函数
 *
 * @returns {Promise<Answer[]>} 答案列表
 */
export default async function getAnswer(prompt, handleCreateFile) {
  const api = new ChatGPTAPIBrowser({
    debug: false,
    minimize: true,
    markdown: false,
    email: process.env.OPENAI_EMAIL,
    password: process.env.OPENAI_PASSWORD
  })
  await api.initSession()

  let prompts = prompt
  if (!Array.isArray(prompts)) prompts = [prompts]

  const answers = []

  await doGetAnswer(api, answers, prompts, handleCreateFile)
  await api.closeSession()

  return answers
}
