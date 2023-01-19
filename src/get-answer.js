import { oraPromise } from 'ora'
import { ChatGPTAPIBrowser } from 'chatgpt'

import {
  IS_ENABLE_FOLLOW_UP,
  THE_NUMBER_OF_FOLLOW_UP,
  NEXT_PROMPT_MESSAGE_PREFIX,
  CURRENT_PROMPT_MESSAGE_SUFFIX
} from './constant.js'

const getAnswerWithOraPromise = (api, prompt, options) =>
  oraPromise(
    api.sendMessage(prompt, { timeoutMs: 2 * 60 * 1000, ...options }),
    { text: prompt }
  )

async function doGetAnswer(api, answers, prompts, handleCreateFile) {
  if (!prompts || !prompts.length) return

  const [prompt, ...rest] = prompts

  let [answer = '', conversationId = '', parentMessageId = ''] = []
  try {
    ;({
      conversationId,
      response: answer,
      messageId: parentMessageId
    } = await getAnswerWithOraPromise(
      api,
      `${prompt}${CURRENT_PROMPT_MESSAGE_SUFFIX}`
    ))

    if (IS_ENABLE_FOLLOW_UP) {
      let response = ''

      for (let i = 0; i < THE_NUMBER_OF_FOLLOW_UP; i++) {
        ;({
          response,
          conversationId,
          messageId: parentMessageId
        } = await getAnswerWithOraPromise(
          api,
          `${NEXT_PROMPT_MESSAGE_PREFIX}${prompt}`,
          { conversationId, parentMessageId }
        ))

        if (!answer.includes(response)) answer += response
      }
    }
  } catch {
    answer = ''
  }
  answers.push({ key: prompt, value: answer })
  handleCreateFile?.(prompt, answer)

  await doGetAnswer(api, answers, rest)
}

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
