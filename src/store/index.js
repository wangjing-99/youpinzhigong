import Vue from 'vue'
import wx from 'wx'
import Vuex from 'vuex'
import api from '@/utils/api'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // shop: '537fdt', // 店铺id 默认主店
    shop: '53378c',
    userShop: '',
    loginStatus: 0, // 0：未登录 1：微信授权登录 2：已绑定手机号
    refererUrl: '', // 来源页面
    carouselData: [], // 轮播数据
    sid: '',
    userInfo: {},
    userData: {}, // 缓存个人中心相关用户信息
    uid: 0,
    address: false,
    formChannel: '' // 地址追蹤
  },
  mutations: {
    carouselData(state, res) {
      state.carouselData = res
    },
    addFormChannel(state, formChannel) {
      state.formChannel = formChannel
    },
    updateLoginStatus(state, status) {
      state.loginStatus = status
    },
    updateUserInfo(state, userInfo) {
      state.userInfo = userInfo
    },
    updateUid(state, uid) {
      state.uid = uid
    },
    updateUserShop(state, userShop) {
      state.userShop = userShop
    },
    updateShop(state, shop) {
      state.shop = shop
    },
    updateSid(state, sid) {
      state.sid = sid
    },
    updateAddress(state, address) {
      state.address = address
    },
    addUserData(state, data) {
      state.userData = data
    }
  },
  actions: {
    async addUserData({commit}) {
      const res = await api.getUserIndex()
      if (res.code !== 0) return
      commit('addUserData', res.data.data)
    },
    async getIndexData({commit}) {
      const res = await api.getIndexData()
      // console.log('vuex取首页的数据getIndexData', res)
      if (res.errno !== 0) return
      commit('getIndexData', res)
    },
    updateShop({commit, state}, shop) {
      if (!shop) {
        wx.setStorageSync('shop', state.shop);
      } else {
        wx.setStorageSync('shop', shop);
        commit('updateShop', shop)
      }
    }
  }
})

export default store
