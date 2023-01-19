export const CATEGORY = {
  推荐: 99,
  学前教育: 0,
  基础教育: 1,
  高校与高等教育: 2,
  '语言/资格考试': 3,
  法律: 4,
  建筑: 5,
  互联网: 6,
  行业资料: 7,
  政务民生: 8,
  商品说明书: 9,
  实用模板: 10,
  生活娱乐: 11
}

export const TASK_STATUS = {
  未开始: 0,
  进行中: 1,
  已完成: 2
}

export const DEFAULT_REFERRER =
  'https://cuttlefish.baidu.com/ndecommtob/browse/index?_wkts_=1673174104309'

export const KEYWORD_FILTERS = [
  '答案',
  '教材',
  '试卷',
  '试题',
  '课件',
  '课本',
  '口算题',
  '算术题',
  '数学题',
  '计算题',
  '电子版',
  '电子书',
  // 科目
  '英语',
  '语文',
  '数学',
  '物理',
  '化学',
  '生物',
  '历史',
  '地理',
  '科学',
  '美术',
  '音乐',
  '理综',
  '文综',
  '思想政治',
  '信息技术',
  '道德与法治',
  '体育与健康',
  // 年级
  '一年级',
  '二年级',
  '三年级',
  '四年级',
  '五年级',
  '六年级',
  '七年级',
  '八年级',
  '九年级',
  '初一',
  '初二',
  '初三',
  '高一',
  '高二',
  '高三',
  // 教材版本
  '统编版',
  '人教版',
  '鲁人版',
  '苏教版',
  '人民版',
  '岳麓版',
  '沪教版',
  '青岛版',
  '苏科版',
  '沪科版',
  '科粤版',
  '教科版',
  '粤沪版',
  '北京版',
  '鲁科版',
  '湘教版',
  '鲁教版',
  '冀人版',
  '浙教版',
  '粤教版',
  '河大版',
  '大象版',
  '湘科版',
  '语文版',
  '冀教版',
  '湘美版',
  '桂美版',
  '京教版',
  '商务版',
  '陕教版',
  '川教版',
  '辽教版',
  '黑教版',
  '桂教版',
  '科普版',
  '外研版',
  '湘少版',
  '闽教版',
  '鲁湘版',
  '人音版',
  '苏少版',
  '湘艺版',
  '花城版',
  '接力版',
  '人美版',
  '冀美版',
  '浙人美',
  '中图版',
  '重大版',
  '晋教版',
  '冀少版',
  '仁爱版',
  '陕旅版',
  '人教A版',
  '人教B版',
  '西师大版',
  '北师大版',
  '北京课改版',
  '华东师大版',
  '牛津译林版',
  '沪教牛津版',
  '人教PEP版',
  '人教新课标版',
  '人教新目标版',
  '冀教版（三起）',
  '外研版（三起）',
  '浙教版（2020）',
  '湘教版（2019）',
  '中图版（2019）',
  '川教版（2019）',
  '人教版（2019）',
  '外研版（2019）',
  '浙科版（2019）',
  '鲁科版（2019）',
  '教科版（2019）',
  '沪科版（2019）',
  '粤教版（2019）',
  '苏教版（2019）',
  '鲁教版（2019）',
  '统编版（五四制）',
  '鲁教版（五四制）',
  '青岛版（五四制）',
  '北师大版（三起）',
  '人教版（新起点）',
  '北师大版（一起）',
  '北师大版（2019）',
  '牛津译林版（2020）',
  '人教新课标A版（2019）',
  '人教新课标B版（2019）',
  '浙教版（广西、宁波专用）'
]

export const DEFAULT_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'

export const OUTPUT_PATH = 'docs'

export const QUESTION_MAX_AMOUNT = 500

export const IS_ENABLE_FOLLOW_UP = true

export const THE_NUMBER_OF_FOLLOW_UP = 5

export const OUTPUT_FILE_EXTENSION = '.txt'

export const DEFAULT_HOST = 'cuttlefish.baidu.com'

export const NEXT_PROMPT_MESSAGE_PREFIX = '继续回答'

export const RETRY_WAIT_TIME_AFTER_EXCEPTION = 60000

export const CATEGORY_VALUES = Object.values(CATEGORY)

export const CURRENT_PROMPT_MESSAGE_SUFFIX = ' 不少于 200 字'

export const IS_ENABLE_CREATE_FILE_DURING_CONVERSATION = true
