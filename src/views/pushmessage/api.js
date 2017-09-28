import CMSRequest from 'utils/CMSRequest'

export default {
  pushUsers: async (params) => {
    let _event = {
      methods: 'create',
      class: 'message',
      comment: '向指定用户推送消息'
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/notification/person-push-message',
        data: params
      }, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  pushAll: async (params) => {
    let _event = {
      methods: 'create',
      class: 'message',
      comment: '向全体用户推送消息'
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/notification/all-push-message',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  oldPush: async (params) => {
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
  pushCourseMessage: async (params) => {
    let _event = {
      methods: 'create',
      class: 'message',
      comment: `给课程推送消息 课程 ID：${params.product_id}`
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/course/push-live-message',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getMessage: async (params) => {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: '获取推送消息列表'
    }
    try {
      let data = await CMSRequest.get(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  uploadImage: async (params) => {
    let _event = {
      methods: 'create',
      class: 'upload',
      comment: '上传图片'
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/upload/',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
