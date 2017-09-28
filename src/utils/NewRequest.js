import request2 from './request2'
import log from './log'
import cookie from 'js-cookie'
import { APP_TOKEN_KEY, APP_ENV } from '../config/app'

const WRITE_LOG = APP_ENV === 'pro' // 指定环境上传log
const PASS_LOG = true    // 是否忽略log必传

function handle(result) {
  // ~~~~~~~~~~~~~~~~~~  新api处理  ~~~~~~~~~~~~~~~~~~
  if (result.headers['api-version'] && +result.headers['api-version'] >= 4) { // api-version 大于 4 则是新的api
    if (result.status >= 200 && result.status <= 204) {  // 请求成功
      return Promise.resolve(result.data)
    }
    if (result.status > 204) {  // 请求失败
      return Promise.reject(result.data.message)
    }
  }
  // ~~~~~~~~~~~~~~~~~~  新api处理  ~~~~~~~~~~~~~~~~~~
}

function handleLog (result) {
  if (result && result.code && +result.code === 1) {
    return true
  } else {
    return false
  }
}

export default {
  async new_get (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.new_get(params, cookie.get(APP_TOKEN_KEY))
      return handle(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async new_post (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.new_post(params, cookie.get(APP_TOKEN_KEY))
      return handle(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async new_put (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.new_put(params, cookie.get(APP_TOKEN_KEY))
      return handle(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async new_delete (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.new_delete(params)
      return handle(result)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}