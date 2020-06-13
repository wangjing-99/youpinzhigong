<template>
  <view class="container">
    <tabBarNav></tabBarNav>
    <view class="profile-info">
      <img class="icon" :src="data.img?data.img:'/static/images/my/default_user.png'"/>
      <navigator hover-class="none" url="/pages/ucenter/editInfo">
        <div class="user-info">
          <div class="ads">
            <p v-if="data.name" class="user-name">{{data.name}}</p>
            <p v-else class="user-name">{{data.mobile}}</p>
            <p class="user-p-ad">{{data.mobile}} {{data.areas_name}}</p>
          </div>
        </div>
        <img src="/static/images/i_ar_w_right.png" alt="" class="i-right">
      </navigator>
    </view>
    <view class="member">
      <view class="member-order">
        <view>我的订单</view>
        <navigator hover-class="none" url="/pages/ucenter/order?status=1">全部订单
          <image src="/static/images/i_ar_h_right.png" alt=""></image>
        </navigator>
      </view>

      <view class="member-order-menu">
        <navigator hover-class="none" v-for="nav of navigation" :key="index"
                   :url="nav.status!=6?'/pages/ucenter/order?status='+ nav.status:'/pages/ucenter/afterSales'">
          <image :src="'/static/images/my/'+nav.class+'.png'"></image>
          <text class="text">{{nav.name}}</text>
          <text v-if="nav.count" class="num">{{nav.count}}</text>
        </navigator>

      </view>
    </view>
    <view class="user-menu">
      <view class="item">
        <navigator hover-class="none" url="/pages/ucenter/coupon" class="a">
          <text class="txt">我的优惠券</text>
          <image src="/static/images/i_ar_h_right.png" alt=""></image>
        </navigator>
      </view>
      <view class="item">
        <navigator hover-class="none" url="../ucenter/address" class="a">
          <text class="txt">我的地址</text>
          <image src="/static/images/i_ar_h_right.png" alt=""></image>
        </navigator>
      </view>
      <view class="item no-border">
        <button open-type="contact" class="a form_button">
          <text class="txt">联系客服</text>
          <image src="/static/images/i_ar_h_right.png" alt=""></image>
        </button>
      </view>
    </view>
    <loginDialog v-if="loginShow" @closeLoginDialog="closeLoginDialog"></loginDialog>
  </view>
</template>

<script>
  import wx from 'wx';
  import user from '@/services/user'
  import api from '@/utils/api'
  import util from '@/utils/util'
  import loginDialog from '@/components/loginDialog'
  import tabBarNav from '@/components/tabBarNav'

  export default {
    components: {
      loginDialog,
      tabBarNav
    },
    data() {
      return {
        userInfo: {},
        loginShow: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        navigation: [],
        data: {}
      }
    },
    async onShow() {
      wx.hideShareMenu()
      const isLogin = await user.checkLogin()
      if (!isLogin) user.redirectToLogin()
      if (user.checkBindPhone()) {
        this.loginShow = true
        return
      } else {
        this.loginShow = false
      }
      this.getUserIndex()
    },
    methods: {
      // 关闭登录弹框
      closeLoginDialog() {
        this.loginShow = false
        this.getUserIndex()
      },
      async getUserIndex() {
        util.showLoading()
        const res = await api.getUserIndex()
        util.hideLoading()
        if (res.code === 0) {
          this.data = res.data.data
          this.$store.commit('addUserData', res.data.data)
          this.navigation = res.data.navigation
        } else {
          util.showToast(res.msg)
        }
      }
    }
  }
</script>

<style scoped type="text/less" lang="less">
  @import "../../../static/css/base";

  .container {
    background: @content-back;
    height: auto;
    overflow: hidden;
    width: 100%;
  }

  .profile-info {
    width: 100%;
    height: 140px;
    box-sizing: border-box;
    padding-top: 36px;
    background: url('https://yxds.999d.com/static/m/image/my_header_bg.png') no-repeat @white;
    background-size: 100% 100%;
    display: flex;
    .icon {
      width: 60px;
      height: 60px;
      border: 2.5px solid #fff;
      border-radius: 50%;
      margin-left: 25px;
      margin-right: 20px;
    }
    navigator {
      flex: 1;
      display: flex;
      vertical-align: top;
      .user-info {
        flex: 1;
        color: #fff;
        vertical-align: top;
        padding-top: 15px;
        .user-name {
          font-size: @font_size_35;
          width: 232px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 1em;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .user-p-ad {
          font-size: @font_size_28;
          line-height: 1em;
        }
      }
      .i-right {
        margin-top: 15px;
        width: 35px;
        height: 35px;
      }
    }
  }

  .member {
    width: 100%;
    background: @white;
    box-sizing: border-box;
    margin-bottom: 10px;
    .member-order {
      padding: 0 10px 0 15px;
      height: 40px;
      display: flex;
      border-bottom: 1px solid #ededed;
      justify-content: space-between;
      view {
        line-height: 40px;
        font-size: @font_size_30;
        color: @base_font_color;
      }
      navigator {
        line-height: 40px;
        font-size: @font_size_28;
        color: @aider_font_color;
        image {
          width: 25px;
          height: 25px;
          vertical-align: -8px;
        }
      }
    }
    .member-order-menu {
      display: flex;
      padding: 20px 0px;
      text-align: center;
      border-bottom: 1px #ededed solid;
      navigator {
        width: 25%;
        font-size: @font_size_28;
        color: @aider_font_color;
        position: relative;
        image {
          width: 30px;
          height: 30px;
          display: block;
          margin: 0 auto;
        }
        .text {
          padding-top: 8px;
        }
        .num {
          display: inline-block;
          width: 16px;
          height: 16px;
          line-height: 16px;
          text-align: center;
          border: 1px solid #c1064b;
          border-radius: 50%;
          background: @white;
          font-size: @font_size_24;
          color: @button_color3;
          position: absolute;
          top: -2.5px;
          right: 25px;
        }
      }
    }
  }

  .user-menu {
    width: 100%;
    background: @white;
    .item {
      height: 50px;
      line-height: 50px;
      padding: 0 10px 0 15px;
      font-size: @font_size_28;
      color: @base_font_color;
      border-bottom: 1px solid #ededed;
      .a {
        display: flex;
        text {
          flex: 1;
        }
        image {
          width: 25px;
          height: 25px;
          margin-top: 12.5px;
        }
      }
    }
  }

  .navigator-hover {
    background: none;
  }
</style>
