import axios from 'axios'
import { PREFIX } from '../config/app'

export default {
  checkParams (params) {
    if (!params.url) {
      throw new Error('无效的请求地址')
    }
  },
  init () {
    axios.defaults.baseURL = PREFIX
    axios.defaults.headers.common['x-app-id'] = '56c6c309243cb728205a3dff'
  },
  get (params, token) {
    this.checkParams(params)
    this.init()
    if (token) {
      axios.defaults.headers.common['x-access-token'] = token
    }
    return axios({
      method: 'get',
      url: params.url
    })
  },
  post (params) {
    this.checkParams(params)
    this.init()
    return axios({
      method: 'post',
      url: params.url,
      data: params.data
    })
  },
  delete (params) {
    this.checkParams(params)
    this.init()
    return axios({
      method: 'delete',
      url: params.url,
      data: params.data
    })
  }
}
