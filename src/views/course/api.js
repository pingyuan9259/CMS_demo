import AdminRequest from 'utils/AdminRequest'
import CMSRequest from 'utils/CMSRequest'
import Cookies from 'js-cookie'
import { APP_TOKEN_KEY } from 'config/app'

const get = async (params) => {
  try {
    let data = await CMSRequest.get(params)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

const post = async (params) => {
  try {
    let data = await CMSRequest.post(params)
    return Promise.resolve(data)
  } catch (err) {
    return Promise.reject(err)
  }
}

export default {
  getCourseList: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询课程。`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  getCourseTeacherList: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询课程的老师列表。课程 ID: ${params}`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/course/get-teacher-list',
        data: {
          product_id: params
        }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  //
  getCourseTeacherIntros: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询课程的老师介绍。课程 ID: ${params}`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/course/teacher-intros',
        data: {
          product_id: params
        }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getCourseAdmins: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询课程的管理员列表。课程 ID: ${params}`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/course/get-admin-list',
        data: {
          product_id: params
        }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getCourseAssistans: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询课程的助教列表。课程 ID: ${params}`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/course/get-assistant-list',
        data: {
          product_id: params
        }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  getCourseBaseInfo: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询课程的基本信息。课程 ID: ${params}`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/course/course-info',
        data: {
          product_id: params
        }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  getCourseBanners: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询课程的图片列表。课程 ID: ${params}`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/course/banners',
        data: {
          product_id: params
        }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getCourseFeatures: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询课程的特色列表。课程 ID: ${params}`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/course/features',
        data: {
          product_id: params
        }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getCourseOutlines: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询课程的大纲列表。课程 ID: ${params}`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/course/outlines',
        data: {
          product_id: params
        }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getCourseFaqs: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询课程的问答。课程 ID: ${params}`
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/course/faqs',
        data: {
          product_id: params
        }
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postUploadPicture: async function (data) {
    return post ({
      url : '/admin/upload',
      data: data
    })
  },

  postCreateCourse: async function (data) {
    let _event = {
      methods: 'create',
      class: 'course',
      comment: `创建课程。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/create-course',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postUpdateTeacherIntro: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `更新课程的教师介绍。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/update-teacher-intro',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postUpdateTeachers: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `更新课程的老师列表。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/update-teachers',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postUpdateAdmins: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `更新课程的管理员列表。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/update-admins',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  postUpdateAssistants: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `更新课程的助教列表。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/update-assistants',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postUpdateFeatures: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `更新课程的特色列表。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/update-feature',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  postUpdateOutlines: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `更新课程的大纲列表。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/update-outline',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  postUpdateFaqs: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `更新课程的问答。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/update-faq',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  postUpdateBanners: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `更新课程的图片列表。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/update-banner',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  postUpdateCourse: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `更新课程。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/update-course',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postCreateCourseBBS: async function (data) {
    let _event = {
      methods: 'create',
      class: 'course',
      comment: `创建课程的频道。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/create-bbs',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postCreateCourseJob: async function (data) {
    let _event = {
      methods: 'create',
      class: 'course',
      comment: `创建课程的作业论坛。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/create-job',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postCreateLiveshow: async function (data) {
    let _event = {
      methods: 'create',
      class: 'course',
      comment: `创建课程的直播。课程 ID：${data.product_id}。`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/create-liveshow',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postShelfCourse: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `上架课程，课程 ID：${data.id}`
    }
    try {
      let result = await CMSRequest.post({
        url : '/admin/course/issue-product',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  postDropCourse: async function (data) {
    let _event = {
      methods: 'update',
      class: 'course',
      comment: `下架课程，课程 ID：${data.id}`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/course/product-off',
        data: data
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  getCourseUser: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询购买课程人员列表。`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },

  getUsersInfo: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `批量查询购买课程用户信息。`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}