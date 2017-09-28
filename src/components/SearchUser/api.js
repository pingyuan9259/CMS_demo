import CMSRequest from 'utils/CMSRequest'
import Cookies from 'js-cookie'
import { APP_TOKEN_KEY } from 'config/app'

export default {
  getList: async (params) => {
    try {
      let data = await CMSRequest.get(params)

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
