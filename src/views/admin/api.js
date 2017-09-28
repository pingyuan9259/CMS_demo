import AdminRequest from 'utils/AdminRequest'

export default {
  adminList: async () => {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: '获取管理员列表'
    }
    try {
      let options = {level: {$in: [2, 3]}}
      let data = await AdminRequest.get({
        url: '/admin/admin-list',
        data: {
          limit: 100,
          options: JSON.stringify(options)
        }
      }, _event)

      return Promise.resolve(data.rows || [])
    } catch (err) {
      return Promise.reject(err)
    }
  },
  stopAdmin: async (row) => {
    let _event = {
      methods: 'update',
      class: 'super',
      comment: (row._status === 0 ? '恢复' : '冻结') + '账号 ' + row.id
    }
    try {
      let status = row._status === 1 ? 0 : 1
      let data = await AdminRequest.post({
        url: '/admin/invalid-admin',
        data: {
          id: row.id,
          _status: status
        }
      }, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  resetPassword: async (id, newPassword) =>{
    let _event = {
      methods: 'update',
      class: 'super',
      comment: '重置账号 ' + id + ' 的密码'
    }
    try {
      let data = await AdminRequest.post({
        url: '/admin/reset-pass',
        data: {
          id: id,
          pass: newPassword
        }
      }, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  delAdmin: async (id) =>{
    let _event = {
      methods: 'delete',
      class: 'super',
      comment: '删除账号 ' + id
    }
    try {
      let data = await AdminRequest.delete({
        url: '/admin/delete-admin',
        data: {
          id: id
        }
      }, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  createAdmin: async (name, password, level) => {
    let _event = {
      methods: 'create',
      class: 'super',
      comment: '新建' + (level === 2 ? '管理员' : '运营') + '账号 ' + name
    }
    try {
      let data = await AdminRequest.post({
        url: '/admin/create-admin',
        data: {
          name: name,
          password: password,
          level: level
        }
      }, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  updateAdmin: async (id, name, level) =>{
    let _event = {
      methods: 'update',
      class: 'super',
      comment: '修改 ' + id + ' 的账号或权限'
    }
    try {
      let data = await AdminRequest.post({
        url: '/admin/update-admin',
        data: {
          id: id,
          name: name,
          level: level
        }
      }, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
