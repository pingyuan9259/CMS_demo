import CMSRequest from 'utils/CMSRequest'

export default {
	getEnrollment: async (params) => {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: '获取报名人数统计'
    }
    try {
      let data = await CMSRequest.get(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getClassRate: async (params) => {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: '获取到课率统计'
    }
    try {
      let data = await CMSRequest.get(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getLiveData: async (params) => {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: '获取直播数据'
    }
    try {
      let data = await CMSRequest.get(params, _event)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}