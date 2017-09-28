import AdminRequest from 'utils/AdminRequest'
import CMSRequest from 'utils/CMSRequest'
import Cookies from 'js-cookie'
import { APP_TOKEN_KEY } from 'config/app'


export default {
  getBBSList: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `获取论坛列表。`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getBBSInfo: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `获取论坛基本信息。论坛 ID：${params}。`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/bbs/bbs-detail',
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
      comment: `创建论坛。`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/bbs/bbs-create',
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
        comment: `获取作业列表。`
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

  getTopPosts: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `获取贴子列表。`
    }
    try {
      let result = await CMSRequest.get(params, _event)
      return Promise.resolve(result)
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
      comment: `更新论坛。论坛 ID：${data.id}`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/bbs/bbs-update',
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
      comment: `更新论坛的管理员。论坛 ID：${data.bbsId}`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/bbs/update-bbs-manager',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  // 暂时用不到 更新助教
  postUpdateBBSAssistants: async function (data) {
    try {
      let result = await CMSRequest.post({
        url: '/admin/bbs/update-assistants',
        data: data
      })
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  // 暂时用不到 删除论坛
  postDeleteBBS: async function (data) {
    try {
      let result = await CMSRequest.post({
        url: '/admin/bbs/bbs-delete',
        data: data
      })
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postDeletePost: async function (data) {
    let _event = {
      methods: 'delete',
      class: 'post',
      comment: `删除贴子。贴子 ID：${data.post_id}`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/bbs/delete-post',
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
      comment: `删除回复。回复 ID：${data.reply_id}`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/bbs/delete-reply',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  // 暂时用不到，推荐频道
  postRecommendBBS: async function (data) {
    try {
      let result = await CMSRequest.post({
        url: '/admin/bbs/bbs-recommend',
        data: data
      })
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }

  },

  // 删帖时推送消息
  pushMessage: async (params) => {
    let _event = {
      methods: 'create',
      class: 'message',
      comment: '通过 新生大学团队 推送消息'
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/bot/push',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  // 获取删帖理由列表
  getReasonList: async (params) => {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: '通过 新生大学团队 推送消息'
    }
    try {
      let result = CMSRequest.real_get(params, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  // 更新删帖理由列表
  updateReason: async (params) => {
    let _event = {
      methods: 'update',
      class: 'bbs',
      comment: `更新删帖理由${params.data.id}`
    }
    try {
      let result = CMSRequest.real_post(params, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  // 删除理由列表
  deleteReason: async (params) => {
    let _event = {
      methods: 'delete',
      class: 'bbs',
      comment: `删除删帖理由${params.data.id}`
    }
    try {
      let result = CMSRequest.real_post(params, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  insertReason: async (params) => {
    let _event = {
      methods: 'insert',
      class: 'bbs',
      comment: `增加删帖理由${params.data.id}`
    }
    try {
      let result = CMSRequest.real_post(params, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}