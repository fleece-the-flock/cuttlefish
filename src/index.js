import { resolve } from 'path'
import dotenv from 'dotenv-safe'

import { wait, mkdirp, getDirname } from './util.js'
import { OUTPUT_PATH, RETRY_WAIT_TIME_AFTER_EXCEPTION } from './constant.js'

dotenv.config({ example: '.env' })

const outputDir = `${resolve(getDirname(import.meta.url), '..')}/${OUTPUT_PATH}`

mkdirp(outputDir)

function main() {
  import('./flock.js').then(({ default: flock }) =>
    flock(outputDir).catch((error) => {
      console.error(error)
      // 等待然后执行自身
      wait(RETRY_WAIT_TIME_AFTER_EXCEPTION).then(main)
    })
  )
}

main()
