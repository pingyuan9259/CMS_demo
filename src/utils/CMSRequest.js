import request2 from './request2'
import log from './log'
import cookie from 'js-cookie'
import { APP_TOKEN_KEY, APP_ENV } from '../config/app'

const WRITE_LOG = APP_ENV === 'pro' // 指定环境上传log
const PASS_LOG = true    // 是否忽略log必传

function handle(result) {
  // ~~~~~~~~~~~~~~~~~~  新api处理  ~~~~~~~~~~~~~~~~~~
  if (result.headers['api-version'] && +result.headers['api-version'] >= 4) { // api-version 大于 4 则是新的api
    if (200 <= result.status <= 204) {  // 请求成功
      return Promise.resolve(result.data)
    }
    if (result.status > 204) {  // 请求失败
      return Promise.reject(result.data.message)
    }
  }
  // ~~~~~~~~~~~~~~~~~~  新api处理  ~~~~~~~~~~~~~~~~~~

  if (result.data.code && result.data.code === 1) {
    return Promise.resolve(result.data.result)
  } else {
    if (result.data.need_login && result.data.need_login === 1) {
      if (window.confirm('登录状态已过期, 是否重新登录?')) {
        cookie.remove(APP_TOKEN_KEY)
        window.location.reload()
      }
    }
    return Promise.reject(result.data.message)
  }
}

function handleLog (result) {
  if (result && result.code && +result.code === 1) {
    return true
  } else {
    return false
  }
}

function handleRemark (result) { // 该函数只用于删帖管理
  if (200 <= result.status <= 204) {
    return Promise.resolve(result.data)
  } else {
    return Promise.reject('请求错误')
  }
}

export default {
  async get (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.get(params, cookie.get(APP_TOKEN_KEY))
      return handle(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async post (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.post(params, cookie.get(APP_TOKEN_KEY))
      return handle(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async put (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.put(params, cookie.get(APP_TOKEN_KEY))
      return handle(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async patch (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.patch(params, cookie.get(APP_TOKEN_KEY))
      return handle(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async delete (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.delete(params)
      return handle(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async real_get (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.real_get(params, cookie.get(APP_TOKEN_KEY))
      return handleRemark(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  async real_post (params, _event) {
    try {
      if(WRITE_LOG) {
        let result = await log.up(_event)
        if (!handleLog(result) && !PASS_LOG) {
          return Promise.reject('请正确填写log信息！')
        }
      }
      let result = await request2.real_post(params, cookie.get(APP_TOKEN_KEY))
      return handleRemark(result)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}