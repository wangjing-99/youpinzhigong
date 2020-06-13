<template>
  <div class="tab-bar"
       :style="'color:' + tabBar.color + ';background:' + tabBar.backgroundColor + ';' + (tabBar.position=='top'? 'top: 0;' : 'bottom: 0;') + (tabBar.borderStyle? (tabBar.position=='top'? 'border-bottom: solid .5px '+tabBar.borderStyle + ';' : 'border-top: solid 1px '+tabBar.borderStyle + ';') : '')">
    <view
      @click="clickTabBar(item.pagePath)"
      v-for="item of tabBar.list"
      :key="index"
      hover-class="none"
      :class="item.clas"
      :style="item.active? 'color: '+ (item.selectedColor? item.selectedColor : tabBar.selectedColor) : ''">
      <image :src="item.selectedIconPath" v-if="item.active" class="img"></image>
      <image :src="item.iconPath" v-if="!item.active" class="img"></image>
      <text>{{item.text}}</text>
    </view>
  </div>
</template>

<script>
  import util from '@/utils/util'
  import user from '@/services/user'

  export default {
    data() {
      return {
        tabBar: {
          'color': '#1b1b1b',
          'selectedColor': '#b4282d',
          'backgroundColor': '#fafafa',
          'borderStyle': '#dfdfdf',
          'list': [
            {
              'pagePath': '/pages/index/index',
              'text': '首页',
              'iconPath': '/static/images/nav/nav-1-2.png',
              'selectedIconPath': '/static/images/nav/nav-1-1.png',
              'clas': 'menu-item',
              'selectedColor': '#b4282d',
              active: true
            },
            {
              'pagePath': '/pages/cart/cart',
              'iconPath': '/static/images/nav/nav-2-2.png',
              'selectedIconPath': '/static/images/nav/nav-2-1.png',
              'text': '购物车',
              'selectedColor': '#b4282d',
              'clas': 'menu-item',
              active: false
            },
            {
              'pagePath': '/pages/ucenter/index',
              'iconPath': '/static/images/nav/nav-3-2.png',
              'selectedIconPath': '/static/images/nav/nav-3-1.png',
              'text': '我的',
              'clas': 'menu-item',
              'selectedColor': '#b4282d',
              active: false
            }
          ],
          'position': 'bottom'
        },
        tabBar1: {
          'color': '#1b1b1b',
          'selectedColor': '#b4282d',
          'backgroundColor': '#fafafa',
          'borderStyle': '#dfdfdf',
          'list': [
            {
              'pagePath': '/pages/index/index',
              'text': '首页',
              'iconPath': '/static/images/nav/nav-1-2.png',
              'selectedIconPath': '/static/images/nav/nav-1-1.png',
              'clas': 'menu-item',
              'selectedColor': '#b4282d',
              'active': true
            },
            {
              'pagePath': '/pages/cart/cart',
              'iconPath': '/static/images/nav/nav-2-2.png',
              'selectedIconPath': '/static/images/nav/nav-2-1.png',
              'text': '购物车',
              'selectedColor': '#b4282d',
              'clas': 'menu-item',
              'active': false
            },
            {
              'pagePath': '/pages/ucenter/index',
              'iconPath': '/static/images/nav/nav-3-2.png',
              'selectedIconPath': '/static/images/nav/nav-3-1.png',
              'text': '我的',
              'clas': 'menu-item',
              'selectedColor': '#b4282d',
              'active': false
            }
          ],
          'position': 'bottom'
        },
        tabBar2: {
          'color': '#1b1b1b',
          'selectedColor': '#b4282d',
          'backgroundColor': '#fafafa',
          'borderStyle': '#dfdfdf',
          'list': [
            {
              'pagePath': '/pages/index/index',
              'text': '首页',
              'iconPath': '/static/images/nav/nav-1-2.png',
              'selectedIconPath': '/static/images/nav/nav-1-1.png',
              'clas': 'menu-item',
              'selectedColor': '#b4282d',
              'active': true
            },
            {
              'pagePath': '/pages/myshop/index',
              'text': '我的店',
              'iconPath': '/static/images/nav/nav-4-2.png',
              'selectedIconPath': '/static/images/nav/nav-4-1.png',
              'clas': 'menu-item',
              'selectedColor': '#b4282d',
              'active': false
            },
            {
              'pagePath': '/pages/cart/cart',
              'iconPath': '/static/images/nav/nav-2-2.png',
              'selectedIconPath': '/static/images/nav/nav-2-1.png',
              'text': '购物车',
              'selectedColor': '#b4282d',
              'clas': 'menu-item',
              'active': false
            },
            {
              'pagePath': '/pages/ucenter/index',
              'iconPath': '/static/images/nav/nav-3-2.png',
              'selectedIconPath': '/static/images/nav/nav-3-1.png',
              'text': '我的',
              'clas': 'menu-item',
              'selectedColor': '#b4282d',
              'active': false
            }
          ],
          'position': 'bottom'
        },
        tabBar3: {
          'color': '#1b1b1b',
          'selectedColor': '#b4282d',
          'backgroundColor': '#fafafa',
          'borderStyle': '#dfdfdf',
          'list': [
            {
              'pagePath': '/pages/index/shopIndex',
              'text': '首页',
              'iconPath': '/static/images/nav/nav-1-2.png',
              'selectedIconPath': '/static/images/nav/nav-1-1.png',
              'clas': 'menu-item',
              'selectedColor': '#b4282d',
              'active': true
            },
            {
              'pagePath': '/pages/myshop/index',
              'text': '我的店',
              'iconPath': '/static/images/nav/nav-4-2.png',
              'selectedIconPath': '/static/images/nav/nav-4-1.png',
              'clas': 'menu-item',
              'selectedColor': '#b4282d',
              'active': false
            },
            {
              'pagePath': '/pages/cart/cart',
              'iconPath': '/static/images/nav/nav-2-2.png',
              'selectedIconPath': '/static/images/nav/nav-2-1.png',
              'text': '购物车',
              'selectedColor': '#b4282d',
              'clas': 'menu-item',
              'active': false
            },
            {
              'pagePath': '/pages/ucenter/index',
              'iconPath': '/static/images/nav/nav-3-2.png',
              'selectedIconPath': '/static/images/nav/nav-3-1.png',
              'text': '我的',
              'clas': 'menu-item',
              'selectedColor': '#b4282d',
              'active': false
            }
          ],
          'position': 'bottom'
        },
        curPage: ''
      }
    },
    mounted() {
      if (user.checkShop()) {
        if (user.checkShopIndex()) {
          this.tabBar = this.tabBar3 // 店主的店铺
          if (util.getCurPage() === '/pages/index/index') {
            util.reLaunch('/pages/index/shopIndex')
            return
          }
        } else {
          this.tabBar = this.tabBar2
        }
      } else {
        this.tabBar = this.tabBar1
      }
      this.editTabBar()
    },
    onShow() {
      if (user.checkShop()) {
        if (user.checkShopIndex()) {
          this.tabBar = this.tabBar3 // 店主的店铺
          if (util.getCurPage() === '/pages/index/index') {
            util.reLaunch('/pages/index/shopIndex')
            return
          }
        } else {
          this.tabBar = this.tabBar2
        }
      } else {
        this.tabBar = this.tabBar1
      }
      this.editTabBar()
    },
    methods: {
      clickTabBar(pagePath) {
        if (pagePath === this.curPage) return
        util.reLaunch(pagePath)
      },
      editTabBar() {
        let _pagePath = util.getCurPage()
        this.curPage = _pagePath
        let tabBar = this.tabBar
        for (let i = 0; i < tabBar.list.length; i++) {
          tabBar.list[i].active = false;
          if (tabBar.list[i].pagePath === _pagePath) {
            tabBar.list[i].active = true // 根据页面地址设置当前页面状态
          }
        }
        this.tabBar = tabBar
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../static/css/base";

  .tab-bar {
    position: fixed;
    z-index: 999;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 44px;
    box-sizing: border-box;
    .menu-item {
      text-align: center;
      flex: 1;
      height: 100%;
      font-size: 0;
      .img {
        width: 20px;
        height: 20px;
        display: block;
        margin: auto;
        vertical-align: top;
        padding-top: 5px;
      }
      text {
        font-size: @font_size_24;
      }
    }
  }

</style>
