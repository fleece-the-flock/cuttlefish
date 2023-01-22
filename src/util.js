import fs from 'fs'
import { fileURLToPath } from 'url'
import { join, dirname } from 'path'

export const wait = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms)
  })

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

export const getFileSuffix = (filename, searchString) =>
  filename.slice(filename.lastIndexOf(searchString))

export const getDirname = (url) => dirname(fileURLToPath(url))

export const getFiles = (dir, suffixes, searchString, excludes = []) => {
  if (!dir) return []

  return fs
    .readdirSync(dir)
    .sort()
    .filter((filename) => {
      const [
        stat = fs.statSync(join(dir, filename)),
        suffix = getFileSuffix(filename, searchString)
      ] = []

      return (
        stat.isFile() &&
        (!suffixes.length || suffixes.includes(suffix)) &&
        !excludes.includes(filename)
      )
    })
}
