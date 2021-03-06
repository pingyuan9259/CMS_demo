import CMSRequest from 'utils/CMSRequest'
import Cookies from 'js-cookie'
import { APP_TOKEN_KEY } from 'config/app'

const TOKEN = Cookies.get(APP_TOKEN_KEY)

export default {
  getRecommendCourseList: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询首页推荐课程。`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  createRecommendCourse: async function (params) {
    let _event = {
      methods: 'create',
      class: 'homepageCourse',
      comment: `添加首页推荐课程。`
    }
    try {
      let data = await CMSRequest.put({
        url: '/admin/recommendation',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  editRecommendCourse: async function (params) {
    let _event = {
      methods: 'update',
      class: 'homepageCourse',
      comment: `编辑首页推荐课程。`
    }
    try {
      let data = await CMSRequest.post({
        url: '/admin/recommendation',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}