import {
  DEFAULT_HOST,
  DEFAULT_REFERRER,
  DEFAULT_USER_AGENT
} from './constant.js'

const { AB_SR, BDUSS, BAIDUID, BDUSS_BFESS, BAIDUID_BFESS } = process.env

export default function getFreshCountDown() {
  return fetch(
    `https://${DEFAULT_HOST}/user/interface/gettaskpopstatus?type=1`,
    {
      headers: {
        Host: DEFAULT_HOST,
        Referer: DEFAULT_REFERRER,
        'User-Agent': DEFAULT_USER_AGENT,
        Cookie: `BDUSS=${BDUSS}; BDUSS_BFESS=${BDUSS_BFESS}; ab_sr=${AB_SR}; BAIDUID=${BAIDUID}; BAIDUID_BFESS=${BAIDUID_BFESS}`
      },
      credentials: 'include'
    }
  )
    .then((res) => res.json())
    .then(({ data, status }) => {
      if (status.code !== 0) {
        throw new Error(`接口请求情况：${status.msg}`)
      }

      return data.freshCountDown
    })
    .catch((error) => {
      console.error(error)

      return 0
    })
}
