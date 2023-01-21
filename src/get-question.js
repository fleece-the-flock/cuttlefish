import {
  CATEGORY,
  TASK_STATUS,
  DEFAULT_HOST,
  KEYWORD_FILTERS,
  DEFAULT_REFERRER,
  DEFAULT_PAGE_SIZE,
  DEFAULT_USER_AGENT,
  DEFAULT_PAGE_NUMBER,
  RETRY_WAIT_TIME_AFTER_TOO_FAST
} from './constant.js'
import { wait, createQuestionUrl } from './util.js'

const { AB_SR, BDUSS, BAIDUID, BDUSS_BFESS, BAIDUID_BFESS } = process.env

function fetchQuestion(...args) {
  const url = createQuestionUrl(...args)

  return fetch(url, {
    headers: {
      Host: DEFAULT_HOST,
      Referer: DEFAULT_REFERRER,
      'User-Agent': DEFAULT_USER_AGENT,
      cookie: `BDUSS=${BDUSS}; BDUSS_BFESS=${BDUSS_BFESS}; ab_sr=${AB_SR}; BAIDUID=${BAIDUID}; BAIDUID_BFESS=${BAIDUID_BFESS}`
    },
    credentials: 'include'
  })
    .then((res) => res.json())
    .then(({ data, status }) => {
      if (status.code !== 0) {
        throw new Error(`${url} 接口请求情况：${status.msg}`)
      }

      const { queryList } = data

      return {
        list: queryList.filter(
          ({ queryName, status: subStatus }) =>
            subStatus !== TASK_STATUS['已完成'] &&
            KEYWORD_FILTERS.filter((keyword) => queryName.includes(keyword))
              .length <= 1
        ),
        currentSize: queryList.length
      }
    })
    .catch((error) => {
      console.error(error)

      return { list: [], currentSize: 0 }
    })
}

/**
 * 获取问题过程
 *
 * @param {number[]} cids 分类 id 列表
 * @param {Question[]} questions 问题列表
 * @param {number} threshold 问题数量阈值
 * @param {number} pn 页码
 * @param {number} rn 每页数量
 */
async function doGetQuestion(cids, questions, threshold, pn, rn) {
  const { length: size } = questions
  if (size >= threshold || !cids || !cids.length) return

  const [cid, ...rest] = cids

  const { currentSize, list: question } = await fetchQuestion(cid, pn, rn)

  let finalQuestion = question
  if (size + finalQuestion.length > threshold) {
    finalQuestion = finalQuestion.slice(0, threshold - size)
  }
  // 添加分类名称以及页数
  if (finalQuestion.length) {
    const [
      [cName] = Object.entries(CATEGORY).find(
        ([, targetCid]) => targetCid === cid
      ) ?? []
    ] = []

    finalQuestion = finalQuestion.map((item) => ({ pn, cName, ...item }))
  }
  // 添加问题
  questions.push(...finalQuestion)
  // 等待 500 ms，防止接口请求过快
  await wait(RETRY_WAIT_TIME_AFTER_TOO_FAST)
  // 如果当前页数量等于每页数量，继续获取下一页
  if (currentSize === rn) {
    await doGetQuestion(cids, questions, threshold, pn + 1, rn)
    return
  }

  // 如果当前分类问题数量不足，继续获取下一个分类
  await doGetQuestion(rest, questions, threshold, DEFAULT_PAGE_NUMBER, rn)
}

/**
 * 获取问题
 *
 * @param {number[] | number} cid 分类 id 数组或单个分类 id
 * @param {number} threshold 问题数量阈值
 * @param {number} [pn=0] 页码
 * @param {number} [rn=20] 每页数量
 *
 * @returns {Promise<Question[]>} 问题列表
 */
export default async function getQuestion(
  cid,
  threshold,
  pn = DEFAULT_PAGE_NUMBER,
  rn = DEFAULT_PAGE_SIZE
) {
  let cids = cid
  if (!Array.isArray(cids)) cids = [cids]

  const questions = []

  await doGetQuestion(cids, questions, threshold, pn, rn)

  return questions
}
