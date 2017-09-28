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

  recommendArticle: async function (params) {
    let _event = {
      methods: 'update',
      class: 'article',
      comment: `编辑推荐文章。文章 ID：${params.postId}`
    }
    try {
      let data = await CMSRequest.post({
        url: 'admin/bbs/post-recommend',
        data: params
      }, _event)
      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}