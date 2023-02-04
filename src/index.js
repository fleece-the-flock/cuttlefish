import dotenv from 'dotenv-safe'

import { wait, mkdirp, getOutputDirByPath } from './util.js'
import { DOUBLE_DOT, RETRY_WAIT_TIME_AFTER_EXCEPTION } from './constant.js'

dotenv.config({ example: '.env' })

const outputDir = getOutputDirByPath(import.meta.url, DOUBLE_DOT)

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
