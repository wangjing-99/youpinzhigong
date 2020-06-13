import wx from 'wx'
import Fly from 'flyio'
import util from '@/utils/util'
import user from '@/services/user'

const request = new Fly()

request.interceptors.request.use((request) => {
  // 给所有请求添加自定义header，带上token信息让服务器验证用户登陆
  request.headers['sid'] = wx.getStorageSync('sid');
  if (request.method === 'POST') {
    request.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  } else {
    request.headers['Content-Type'] = 'application/json'
  }
  const shop = wx.getStorageSync('shop')
  if (shop) {
    if (request.url === 'search/index') {
    } else {
      request.body['shop'] = shop
    }
  }
  wx.showNavigationBarLoading()
  return request
})

request.interceptors.response.use(
  (response, promise) => {
    wx.hideNavigationBarLoading()
    // 接口返回未登录
    if (response.data.code && response.data.code === 400317) {
      user.redirectToLogin()
      return
    }
    return promise.resolve(response.data)
  },
  (err, promise) => {
    wx.hideNavigationBarLoading()
    util.hideLoading()
    wx.showToast({
      title: err.message,
      icon: 'none'
    })
    return promise.resolve()
  }
)

export default request
