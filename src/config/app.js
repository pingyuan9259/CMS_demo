import Cookie from '../utils/cookie'

// 全局常量
const win = window
const loc = win.location
const host = loc.host
const port = loc.port
const APP_ENV = host.split('.')[0].split('-')[1] ? host.split('.')[0].split('-')[1] : 'pro'

// 初始变量
let APP_ID = ''
let APP_HOST = ''
let DEVICE_ID_KEY = ''
let APP_IS_LOCAL = false
let PREFIX = '//cms-api.tinfinite.com'
let NEW_PREFIX = '//cms.xinshengdaxue.com'
let TOKEN = ''
let APP_TOKEN_KEY = '_cms_token'

// for host
APP_HOST = host

// top level hostname
let topHostMatch = loc.hostname.match(/\.([^.]+\.com)$/)
let TOP_LEVEL_HOST = topHostMatch && topHostMatch[1]

// for host
APP_HOST = TOP_LEVEL_HOST

// for appId & appLogo
if (!TOP_LEVEL_HOST) {
  throw new Error('url is wrong!')
} else {
  DEVICE_ID_KEY = '_cms_device_id' + APP_ID
}

// for env
if (port) {
  APP_IS_LOCAL = true
}

let SUFFIX = APP_ENV === 'pro' ? '' : APP_ENV
if (SUFFIX) {
  APP_TOKEN_KEY = SUFFIX === 'pro' ? '_cms_token' : '_cms_token_' + SUFFIX
  PREFIX = '//cms-api' + '-' + SUFFIX + '.tinfinite.com'
  NEW_PREFIX = '//cms' + '-' + SUFFIX + '.xinshengdaxue.com'
}
TOKEN = Cookie.get(APP_TOKEN_KEY)

export { APP_HOST, APP_IS_LOCAL, APP_ID, TOP_LEVEL_HOST, APP_ENV, DEVICE_ID_KEY, TOKEN, PREFIX, NEW_PREFIX, APP_TOKEN_KEY }
