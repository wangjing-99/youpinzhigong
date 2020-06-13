<template>
  <view class="user">
    <!--<image class="bg" src="http://img.ggdawanjia.com/forumcdn/20180713/image/get-user-info_f27aebd1.png" mode="scaleToFill"/>-->
    <image class="icon" src="/static/images/login-img.png" mode="scaleToFill"/>
    <p class="title">想体验更多更完整服务</p>
    <p class="login-text">请先登录</p>
    <button class="login" v-if="canIUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">立即登录</button>
    <view class="update" v-else>请升级微信版本</view>
  </view>
</template>

<script type="text/ecmascript-6">
  import user from '@/services/user'
  import wx from 'wx'

  export default {
    data() {
      return {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        userInfo: {},
        fromUrl: null,
        code: null
      }
    },
    mounted() {
      wx.login({
        success: res => {
          this.code = res.code;
        }
      });
    },
    methods: {
      async bindGetUserInfo() {
        const page = this.$route.query.page;
        user.loginByWeixin().then(res => {
          this.$store.commit('updateUserInfo', res.data.userInfo)
          if (res.data.userInfo && res.data.userInfo.shop_id && res.data.userInfo.shop_id !== '537fdl') {
            user.setUserShop(res.data.userInfo.shop_id)
          }
          if (user.checkShopIndex()) {
            const curPage = decodeURIComponent(page).split('?')
            console.log(curPage)
            switch (curPage[0]) {
              case '/pages/index/index':
                wx.reLaunch({
                  url: '/pages/index/shopIndex'
                })
                return
              case '/pages/goods/goods':
                wx.reLaunch({
                  url: '/pages/goods/shopGoods?' + curPage[1]
                })
                return
            }
          }
          wx.reLaunch({
            url: page ? decodeURIComponent(page) : '/pages/index/index'
          })
        }).catch((err) => {
          console.log('登陆失败', err)
        });
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../../static/css/base";

  .user {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    .bg {
      width: 100%;
      height: 100%;
    }
    .icon {
      width: 100%;
      height: 100%;
      // position: absolute;
      // top: 120px;
      // left: 125px;
    }
    .title {
      width: 100%;
      position: absolute;
      bottom: 250px;
      text-align: center;
      color: #fff;
      font-size: 20px;
    }
    .login-text {
      width: 100%;
      position: absolute;
      bottom: 220px;
      text-align: center;
      color: #fff;
      font-size: 18px;
    }
    .login {
      width: 191px;
      height: 40px;
      position: absolute;
      bottom: 77px;
      left: 0;
      right: 0;
      margin: auto;
      border: 1px solid #ff6360;
      border-radius: 5px;
      color: #ff6360;
      font-size: 18px;
      line-height: 40px;
      text-align: center;
      outline: none;
      background: rgba(0, 0, 0, 0);
    }
    .update {
      width: 100%;
      position: absolute;
      bottom: 170px;
      color: #666666;
      font-size: @font_size_35;
      text-align: center;
    }
  }
</style>
