import CMSRequest from 'utils/CMSRequest'
import Cookies from 'js-cookie'
import { APP_TOKEN_KEY } from 'config/app'

const TOKEN = Cookies.get(APP_TOKEN_KEY)

export default {
  addBanner: async function (options) {
    let _event = {
      methods: 'create',
      class: 'homepageBanner',
      comment: `添加首页运营 Banner。`
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/panel/add',
        data: options
      }, _event)

      return Promise.resolve(data || {})
    } catch (err) {
      return Promise.reject(err)
    }
  },
  editBanner: async function (options) {
    let _event = {
      methods: 'update',
      class: 'homepageBanner',
      comment: `编辑首页运营 Banner。Banner ID: ${options.id}`
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/panel/edit',
        data: options
      }, _event)
      return Promise.resolve(data || {})
    } catch (err) {
      return Promise.reject(err)
    }
  },
  deleteBanner: async function (options) {
    let _event = {
      methods: 'delete',
      class: 'homepageBanner',
      comment: `删除首页运营 Banner。Banner ID: ${options.id}`
    }
    try {
      let data = await CMSRequest.delete({
        url: '/admin/panel/remove',
        data: options
      }, _event)
      return Promise.resolve(data || {})
    } catch (err) {
      return Promise.reject(err)
    }
  },

  getBanner: async function (options) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询首页运营 Banner。`
    }
    try {
      let data = await CMSRequest.get(options, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}
