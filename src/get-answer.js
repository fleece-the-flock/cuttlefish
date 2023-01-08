import { oraPromise } from 'ora'
import { ChatGPTAPIBrowser } from 'chatgpt'

async function doGetAnswer(api, answers, prompts) {
  if (!prompts || !prompts.length) return

  const [prompt, ...rest] = prompts

  let answer = ''
  try {
    ;({ response: answer } = await oraPromise(
      api.sendMessage(prompt, { timeoutMs: 2 * 60 * 1000 }),
      { text: prompt }
    ))
  } catch {
    answer = ''
  }
  answers.push({ key: prompt, value: answer })

  await doGetAnswer(api, answers, rest)
}

export default async function getAnswer(prompt) {
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

  await doGetAnswer(api, answers, prompts)
  await api.closeSession()

  return answers
}
