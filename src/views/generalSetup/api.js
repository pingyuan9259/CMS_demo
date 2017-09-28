import CMSRequest from 'utils/CMSRequest'
import Cookies from 'js-cookie'
import { APP_TOKEN_KEY } from 'config/app'
import qs from 'qs'

export default {
  getWalletList: async function (params) {
    let user_id = ''
    let matchArr = params.url.match(/user_id=([^&]*)/g)
    if (matchArr && matchArr.length) {
      let arr = matchArr[0].split('=')
      if (arr && arr.length > 1) {
        user_id = arr[1]
      }
    }
    let _event = {
      methods: 'pull',
      class: 'wallet',
      comment: user_id.length ? `获取钱包列表。用户 ID：${user_id}` : `获取钱包列表。`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getUsersInfos: async function (ids) {
    try {
      if (!ids || !ids.length) {
        return Promise.reject('用户 ids 为 空')
      } else {
        let url = '/admin//user/user-info-map?field=_id'
        url = url + '&' + qs.stringify({ values: ids}, { arrayFormat: 'brackets' })
        url = url + '&projection=avatar fullname'
        let data = await CMSRequest.get({ url: url })
        return Promise.resolve(data)
      }

    } catch (err) {
      return Promise.reject(err)
    }
  },
  getFeedbackFaqs: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询常见问题。`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  createFeedbackFaq: async function (params) {
    let _event = {
      methods: 'create',
      class: 'feedbackFaq',
      comment: `添加常见问题。`
    }
    try {
      let data = await CMSRequest.put({
        url: '/admin/problem',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  updateFeedbackFaq: async function (params) {
    let _event = {
      methods: 'update',
      class: 'feedbackFaq',
      comment: `更新常见问题。问题 ID：${params.common_problem_id}。`
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/problem',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  updateFeedbackFaqWeight: async function (params) {
    let _event = {
      methods: 'update',
      class: 'feedbackFaq',
      comment: `更新常见问题的权重。问题 ID：${params[0].id}`
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/problem/update/weight',
        data: { data: params }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  deleteFeedbackFaq: async function (params) {
    let _event = {
      methods: 'delete',
      class: 'feedbackFaq',
      comment: `删除常见问题。问题 ID：${params.common_problem_id}。`
    }
    try {
      let data = await CMSRequest.delete({
        url: '/admin/problem',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  postUpdateWallet: async (params) => {
    let type = +params.data.charge_type === 1 ? '赠送' : '扣除'
    let _event = {
      methods: 'update',
      class: 'wallet',
      comment: `修改用户${params.data.user_id}的新生币余额, ${type}新生币${params.data.amount}元。`
    }
    try {
      let data = await CMSRequest.patch(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getRecords: async (params) => {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `拉取用户交易记录`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  } 
}