import CMSRequest from 'utils/CMSRequest'
import NewRequest from 'utils/NewRequest'

export default {
  getList: async (params) => {
    let real = params.url === '/admin/user/real-name/dataTable'
    let _event = {
      methods: 'pull',
      class: real ? 'user' : 'normalPull',
      comment: real ? '获取用户认证信息列表' : '获取用户列表'
    }
    try {
      let data = await CMSRequest.get(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  authResult: async (id, status) => {
    let _event = {
      methods: 'update',
      class: 'user',
      comment: (status === 1 ? '通过' : '拒绝') + '用户 ' + id + ' 的审核资料'
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/user/real-name/update-status',
        data: {
          id: id,
          status: status
        }
      }, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  userDetail: async (params) => {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: '获取用户 ' + params.id + ' 的详细资料'
    }
    try {
      let data = await CMSRequest.get(params, _event)
      
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  updateVerify: async (id, status) => {
    let _event = {
      methods: 'update',
      class: 'user',
      comment: (status === 1 ? '通过' : '拒绝') + '用户 ' + id + ' 的实名认证'
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/user/verify-status',
        data: {
          user_id: id,
          verify_status: status
        }
      }, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getLabelList: async (params) => {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: '获取标签列表'
    }
    try {
      let data = await NewRequest.new_get(params, _event)
      
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  createLabel: async (params) => {
    let _event = {
      methods: 'create',
      class: 'user',
      comment: '新增用户标签'
    }
    try {
      let data = await NewRequest.new_post(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  updateLabel: async (params) => {
    let _event = {
      methods: 'update',
      class: 'user',
      comment: '修改用户标签'
    }
    try {
      let data = await NewRequest.new_put(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  delLabel: async (params) => {
    let _event = {
      methods: 'delete',
      class: 'user',
      comment: '删除用户标签'
    }
    try {
      let data = await NewRequest.new_delete(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getMaxLabel: async (params) => {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: '获取用户标签上限'
    }
    try {
      let data = await NewRequest.new_get(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  setMaxLabel: async (params) => {
    let _event = {
      methods: 'update',
      class: 'user',
      comment: '设置用户标签上限'
    }
    try {
      let data = await NewRequest.new_put(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  updateUserLabel: async (params) => {
    let _event = {
      methods: 'update',
      class: 'user',
      comment: '设置用户标签'
    }
    try {
      let data = await NewRequest.new_post(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  delUserLabel: async (params) => {
    let _event = {
      methods: 'delete',
      class: 'user',
      comment: '删除用户标签'
    }
    try {
      let data = await NewRequest.new_delete(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
