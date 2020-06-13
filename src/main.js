import Vue from 'vue'
import store from '@/store'
import App from '@/App'
import MpvueRouterPatch from 'mpvue-router-patch'

Vue.config.productionTip = false
Vue.use(MpvueRouterPatch)
const app = new Vue({
  store,
  ...App
})
app.$mount()
export default {
  // 这个字段走 app.json
  config: {
    pages: [
      'pages/index/index',
      'pages/topic/topic',
      'pages/catalog/catalog',
      'pages/cart/cart',
      'pages/ucenter/index'
    ], // Will be filled in webpack
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: false
      // navigationStyle: 'custom'
    }
    /**
    tabBar: {
      'backgroundColor': '#fafafa',
      'borderStyle': 'white',
      'selectedColor': '#b4282d',
      'color': '#666',
      'list': [{
        'pagePath': 'pages/index/index',
        'iconPath': 'static/images/nav/nav-1-2.png',
        'selectedIconPath': 'static/images/nav/nav-1-1.png',
        'text': '首页'
      },
      {
        'pagePath': 'pages/cart/cart',
        'iconPath': 'static/images/nav/nav-2-2.png',
        'selectedIconPath': 'static/images/nav/nav-2-1.png',
        'text': '购物车'
      },
      {
        'pagePath': 'pages/ucenter/index',
        'iconPath': 'static/images/nav/nav-3-2.png',
        'selectedIconPath': 'static/images/nav/nav-3-1.png',
        'text': '我的'
      }
      ]
    }
     */
  },
  'networkTimeout': {
    'request': 10000,
    'downloadFile': 10000
  },
  'debug': true
}
