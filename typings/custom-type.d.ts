/** 问题类型 */
type Question = {
  /** 页码 */
  pn: number
  /** 分类名称 */
  cName: string
  /** 问题名称 */
  queryName: string
  /** 问题 id */
  queryId: string
  /** 问题状态 */
  status: number
  /** 估价 */
  estimatedPrice: string
}

/** 答案类型 */
type Answer = string

type CreateFileHandler = (prompt: string, answer: string) => void
