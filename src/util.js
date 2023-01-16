import fs from 'fs'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

export const mkdirp = (path) => {
  // https://stackoverflow.com/q/37589161/4441984
  fs.mkdirSync(path, { recursive: true })
}

export const createFile = (file, data) => {
  fs.writeFileSync(file, data, { encoding: 'utf-8' })
}

export const createFileAsync = (file, data) => {
  fs.writeFile(file, data, { options: 'utf-8' }, console.error)
}

export const createQuestionUrl = (cid, pn, rn) =>
  `https://cuttlefish.baidu.com/user/interface/getquerypacklist?cid=${cid}&pn=${pn}&rn=${rn}&word=&tab=1`

export const getDirname = (url) => dirname(fileURLToPath(url))

export const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
