import CMSRequest from 'utils/CMSRequest'

export default {
  getPrices: async function () {
    let _event = {
      methods: 'pull',
      class: 'normalPull',
      comment: '获取充值定价列表'
    }
    try {
      let data = await CMSRequest.get({
        url: '/admin/wallet/list-newborn-product'
      }, _event)

      data = data || []
      data.forEach(function(item) {
        item.price = item.price / 100
        item.iosPrice = item.iosPrice / 100
        item.newbornNum = item.newbornNum / 100
        return item
      })

      return Promise.resolve(data)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  addPrice: async function (data) {
    let _event = {
      methods: 'create',
      class: 'price',
      comment: '添加新的充值定价'
    }
    if (data.newbornNum <= 0 || data.price <= 0 || data.iosPrice <=0 || data.iosProductId === '') {
      return Promise.reject(new Error('参数错误'))
    }

    try {
      let result = await CMSRequest.post({
        url: '/admin/wallet/add-newborn-product',
        data: {
          newborn_num: data.newbornNum,
          price: data.price,
          ios_price: data.iosPrice,
          ios_product_id: data.iosProductId
        }
      }, _event)

      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  postUpdatePrice: async function (data) {
    let _event = {
      methods: 'update',
      class: 'price',
      comment: `修改充值定价。产品 ID：${data.id}。`
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/wallet/update-newborn-product',
        data: {
          id: data.id,
          newborn_num: data.newbornNum,
          price: data.price,
          ios_price: data.iosPrice,
          ios_product_id: data.iosProductId,
        }
      }, _event)
      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
  deletePrice: async function (data) {
    let _event = {
      methods: 'delete',
      class: 'price',
      comment: '删除充值定价'
    }
    try {
      let result = await CMSRequest.post({
        url: '/admin/wallet/update-newborn-product',
        data: {
          id: data.id,
          newborn_num: data.newbornNum,
          price: data.price,
          ios_price: data.iosPrice,
          ios_product_id: data.iosProductId,
          status: 0
        }
      }, _event)

      return Promise.resolve(result)
    } catch (err) {
      return Promise.reject(err)
    }
  },
}