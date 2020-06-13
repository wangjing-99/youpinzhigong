<template>
  <view class="container">
    <button class="login"  open-type="getUserInfo" @getuserinfo="bindGetUserInfo">获取openid</button>
    <button open-type="launchApp" app-parameter="wechat" @error="launchAppError">打开APP</button>
    <view>错误：{{msg}}</view>
  </view>
</template>

<script>
  import user from '@/services/user';
  export default {
    data() {
      return {
        msg: ''
      }
    },
    async mounted() {
    },
    methods: {
      bindGetUserInfo() {
        user.userAuthorization().then(res => {
          console.log(res)
        }).catch((err) => {
          console.log('登陆失败', err)
        });
      },
      launchAppError(e) {
        this.msg = e.target.errMsg
        console.log(e.target.errMsg)
      }
    },
    // 原生的分享功能
    onShareAppMessage: function () {
      return {
        title: 'xbyjShop',
        desc: '仿网易严选小程序商城',
        path: '/pages/pay/pay'
      }
    }
  }
</script>

<style scoped type="text/less" lang="less">
  page {
    min-height: 100%;
    width: 100%;
    background: #f4f4f4;
  }

  .container {
    padding-top: 100px;
  }
</style>
