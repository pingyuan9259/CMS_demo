import AdminRequest from 'utils/AdminRequest'
import CMSRequest from 'utils/CMSRequest'
import Cookies from 'js-cookie'
import { APP_TOKEN_KEY } from 'config/app'
import qs from 'qs'

export default {
  getExerciseBBSList: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `获取作业论坛列表。`
    }
    try {
      let url = '/admin/exercise/bbs-list?'
      url = url + qs.stringify(params, { encoder: function (str) {
        return typeof str === 'string' ? str.trim() : str
      }})
      let data = await CMSRequest.get({url: url}, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getBBSInfo: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `获取作业论坛基本信息。论坛 ID：${params}。`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/exercise/bbs-detail',
        data: {
          bbs_id: params
        }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  postCreateBBS: async function (data) {
    let _event = {
      methods: 'create',
      class: 'bbs',
      comment: `创建作业论坛。`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/exercise/bbs-create',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },


  getExercisePost: async function (params) {
    try {
      let _event = {
        methods: 'pull',
        class: 'normalPull',
        comment: `获取老师作业列表。`
      }
      try {
        let data = await CMSRequest.get(params, _event)
        return Promise.resolve(data)
      } catch (err) {
        return Promise.reject(err)
      }
    } catch (err) {
      return Promise.reject(err)
    }
  },

  getArticlePost: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `获取文章贴子列表。`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  getExerciseReplys: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `获取作业回复列表。`
    }
    try {
      let result = await CMSRequest.get(params, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  getTopReplys: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `获取回复列表。`
    }
    try {
      let result = await CMSRequest.get(params, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getUsersInfos: async function (params) {
    try {
      let result = await CMSRequest.get(params)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postUpdateBBS: async function (data) {
    let _event = {
      methods: 'update',
      class: 'bbs',
      comment: `更新作业论坛。论坛 ID：${data.id}`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/exercise/bbs-update',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postUpdateBBSAdmins: async function (data) {
    let _event = {
      methods: 'update',
      class: 'bbs',
      comment: `更新作业论坛的管理员。论坛 ID：${data.bbsId}`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/exercise/update-bbs-manager',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postDeletePost: async function (data) {
    let _event = {
      methods: 'delete',
      class: 'post',
      comment: `删除作业贴子。贴子 ID：${data.post_id}`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/exercise/delete-post',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postDeleteReply: async function (data) {
    let _event = {
      methods: 'delete',
      class: 'reply',
      comment: `删除作业回复。回复 ID：${data.reply_id}`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/exercise/delete-reply',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}