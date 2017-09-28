import CMSRequest from 'utils/CMSRequest'
import Cookies from 'js-cookie'
import { APP_TOKEN_KEY } from 'config/app'

const TOKEN = Cookies.get(APP_TOKEN_KEY)

export default {
  getPostList: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询文章。`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  getRecommendArticleList: async function (params) {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: `查询首页推荐文章。`
    }
    try {
      let data = await CMSRequest.get(params, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  createRecommendArticle: async function (params) {
    let _event = {
      methods: 'create',
      class: 'homepageArticle',
      comment: `添加首页推荐文章。`
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
  editRecommendArticle: async function (params) {
    let _event = {
      methods: 'update',
      class: 'homepageArticle',
      comment: `编辑首页推荐文章。`
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
  delRecommendArticle: async function (params) {
    let _event = {
      methods: 'delete',
      class: 'homepageArticle',
      comment: `删除首页推荐文章。`
    }
    try {
      let data = await CMSRequest.delete({
        url: '/admin/recommendation',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}