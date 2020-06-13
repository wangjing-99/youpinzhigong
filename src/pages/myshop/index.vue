<template>
  <view class="container">
    <tabBarNav></tabBarNav>
    <view class="profile-info">
      <button open-type="share" class="form_button btn_share"></button>
      <img @click="scanShow" class="icon"
           :src="data.shopinfo.shoplogo?data.shopinfo.shoplogo:'/static/images/my/default_shop.png'"/>
      <navigator hover-class="none" url="/pages/myshop/editInfo">
        <div class="user-info">
          <div class="ads">
            <p v-if="data.shopinfo.shopname" class="user-name">
              {{data.shopinfo.shopname}}
              <span :class="'lv'+ data.shopinfo.shop_grade "></span>
            </p>
            <p v-else class="user-name">{{data.name}}<span :class="'lv'+ data.shopinfo.shop_grade "></span></p>
            <p v-if="data.shopinfo.shopinfo" class="user-p-ad">{{data.shopinfo.shopinfo}}</p>
            <p v-else class="user-p-ad">用一句话描述下你的店铺吧</p>
          </div>
        </div>
        <div class="shop-edit">
          <!--编辑店铺-->
          <img src="/static/images/i_ar_w_right.png" alt="" class="i-right">
        </div>
      </navigator>
    </view>
    <view class="shop">
      <view class="shop-order-menu">
        <navigator hover-class="none" url="/pages/shoporder/orderList">
          <image src="https://yxds.999d.com/static/m/image/i_order_today.png"></image>
          <text class="num blue">{{data.order_count.today_order_num}}</text>
          <text class="text">今天订单(笔)</text>
        </navigator>
        <navigator hover-class="none" url="/pages/shoporder/shopSales?time=today">
          <image src="https://yxds.999d.com/static/m/image/i_sale_today.png"></image>
          <text class="num red">{{data.order_count.today_total_sales}}</text>
          <text class="text">今日销售(元)</text>
        </navigator>
        <navigator hover-class="none" url="/pages/shoporder/shopSales?time=month">
          <image src="https://yxds.999d.com/static/m/image/i_sale_month.png"></image>
          <text class="num green">{{data.order_count.month_total_sales}}</text>
          <text class="text">本月销售(元)</text>
        </navigator>
      </view>
    </view>
    <view class="member">
      <view class="member-order">
        <view>订单管理</view>
        <navigator hover-class="none" url="/pages/shoporder/orderList">全部订单
          <image src="/static/images/i_ar_h_right.png" alt=""></image>
        </navigator>
      </view>
      <view class="member-order-menu">
        <navigator hover-class="none" v-for="nav of navigation" :key="index"
                   :url="nav.status!=6?'/pages/shoporder/orderList?status='+ nav.status:'/pages/shoporder/afterSales'">
          <image :src="'/static/images/my/'+nav.class+'.png'"></image>
          <text class="text">{{nav.name}}</text>
          <text v-if="nav.count" class="num">{{nav.count}}</text>
        </navigator>

      </view>
    </view>

    <view class="viewport">
      <view @click="scanShow" class="item">
        <view class="item-left">今日浏览人数</view>
        <view class="item-right">
          <view class="r-l">
            {{data.last_date_uv}}
          </view>
          <view class="i-right"></view>
        </view>
      </view>
      <view class="item">
        <view class="item-left">昨日浏览人数</view>
        <view class="item-right">
          <view class="r-l">
            {{data.current_date_uv}}
          </view>
          <view class="i-right"></view>
        </view>
      </view>
    </view>

    <view class="viewport">
      <view class="item">
        <view class="item-left">可提现金额：</view>
        <view class="item-right">
          <view class="r-l t-a-l red">
            ￥{{data.shop_bop.bop_total}}
          </view>
          <a href="/pages/withdraw/index" class="i-right tixian">提现</a>
        </view>
      </view>
    </view>
    <view class="viewport">
      <a hover-class="none" href="/pages/myshop/unsettled" class="item">
        <view class="item-left">未结算收入</view>
        <view class="item-right">
          <view class="r-l">
            ￥{{data.infosettled.unsettled}}
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </a>
      <a hover-class="none" href="/pages/myshop/settled" class="item">
        <view class="item-left">已结算收入</view>
        <view class="item-right">
          <view class="r-l">
            ￥{{data.infosettled.settled}}
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </a>
    </view>

    <view class="viewport">
      <a hover-class="none" href="/pages/myshop/detailed" class="item">
        <view class="item-left">收支明细</view>
        <view class="item-right">
          <view class="r-l">
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </a>
      <a hover-class="none" href="/pages/withdraw/record" class="item">
        <view class="item-left">提现记录</view>
        <view class="item-right">
          <view class="r-l">
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </a>
      <!--<a hover-class="none" href="/pages/myshop/reward" class="item">-->
      <!--<view class="item-left">开店奖励</view>-->
      <!--<view class="item-right">-->
      <!--<view class="r-l">-->
      <!--￥9-->
      <!--</view>-->
      <!--<image src="/static/images/i_ar_h_right.png" class="i-right"></image>-->
      <!--</view>-->
      <!--</a>-->
    </view>
    <view v-if="num && num>=10" class="viewport">
      <view @click="scanCode" class="item">
        <view class="item-left">绑定我的专属二维码</view>
        <view class="item-right">
          <view class="r-l">
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </view>
      <!--<a hover-class="none" href="/pages/myshop/reward" class="item">-->
      <!--<view class="item-left">开店奖励</view>-->
      <!--<view class="item-right">-->
      <!--<view class="r-l">-->
      <!--￥9-->
      <!--</view>-->
      <!--<image src="/static/images/i_ar_h_right.png" class="i-right"></image>-->
      <!--</view>-->
      <!--</a>-->
    </view>
    <view class="zhanwei"></view>
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
        loginShow: false,
        navigation: [],
        num: 0,
        isOnShow: false,
        data: {
          shopinfo: {},
          user_basic: {},
          order_count: {},
          shop_bop: {},
          order_navigation: [],
          infosettled: {},
          invite_info: {}
        }
      }
    },
    async onShow() {
      if (this.isOnShow && this.data.shopinfo.id) {
        this.num = 0
        this.isOnShow = false
        return
      }
      wx.hideShareMenu()
      const isLogin = await user.checkLogin()
      if (!isLogin) user.redirectToLogin()
      if (user.checkBindPhone()) {
        this.loginShow = true
        return
      } else {
        this.loginShow = false
      }

      this.$store.dispatch('updateShop', wx.getStorageSync('userShop'))
      this.getMyshopIndex()
    },
    methods: {
      scanShow() {
        this.num++
        console.log(this.num)
      },
      scanCode(e) {
        const _this = this
        this.isOnShow = true
        console.log(e);
        wx.scanCode({
          scanType: 'qrCode',
          success(res) {
            if (res.result) {
              _this.bindShop({
                url: res.result,
                shop: _this.$store.state.userShop
              })
            }
          }
        })
      },
      async bindShop(obj) {
        const res = await api.bindShop(obj)
        console.log(res);
        if (res.code === 0) {
          util.showToast('绑定成功')
        } else {
          util.showToast(res.msg)
        }
      },
      // 关闭登录弹框
      closeLoginDialog() {
        this.loginShow = false
        this.getMyshopIndex()
      },
      async getMyshopIndex() {
        util.showLoading()
        const res = await api.getMyshopIndex()
        util.hideLoading()
        if (res.code === 0) {
          this.data = res.data
          this.navigation = res.data.order_navigation
        } else {
          util.showToast(res.msg)
        }
      }
    },
    onShareAppMessage() {
      return {
        title: this.data.shopinfo.shopinfo,
        imageUrl: encodeURI(this.data.shopinfo.shoplogo),
        path: '/pages/index/index?shop=' + this.$store.state.shop
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
    height: 150px;
    box-sizing: border-box;
    padding-top: 45px;
    background: url('https://yxds.999d.com/static/m/image/my_header_bg.png') no-repeat @white;
    background-size: 100% 100%;
    display: flex;
    position: relative;
    .btn_share {
      position: absolute;
      display: block;
      width: 50px;
      height: 50px;
      line-height: 50px;
      color: #fff;
      text-align: left;
      right: 0;
      top: 0;
      background: url(https://yxds.999d.com/static/m/image/i_share_w.png) no-repeat center;
      background-size: 30px auto;
      z-index: 2;
    }
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
      .shop-edit {
        margin-top: 15px;
        .i-right {
          width: 35px;
          height: 35px;
        }
      }

    }
  }

  .member {
    width: 100%;
    background: @white;
    box-sizing: border-box;
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

  .shop {
    width: 100%;
    background: @white;
    box-sizing: border-box;
    margin-bottom: 10px;
    .shop-order-menu {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 0px;
      text-align: center;
      border-bottom: 1px #ededed solid;
      navigator {
        flex: 1;
        font-size: @font_size_28;
        color: @aider_font_color;
        image {
          width: 30px;
          height: 30px;
          display: block;
          margin: 0 auto;
        }
        .text {
          display: block;
          font-size: @font_size_30;
          color: @base_font_color;
        }
        .num {
          text-align: center;
          background: @white;
          font-size: @font_size_40;
          color: @button_color3;
          &.blue {
            color: #21b7f1;
          }
          &.green {
            color: #50cf12;
          }
          &.red {
            color: #fa735c;
          }
        }
      }
    }
  }

  .viewport {
    width: 100%;
    margin-top: 8px;
    background: @white;
    .box {
      padding: 10px 10px 10px 15px;
      background: #fff0e9;
      font-size: @font_size_28;
      line-height: 25px;
    }
    .item {
      height: 50px;
      padding: 0 10px 0 15px;
      border-bottom: .5px solid @border_color_c;
      display: flex;
      align-items: center;
      justify-content: center;
      .item-left {
        display: inline-block;
        font-size: @font_size_28;
        color: @base_font_color;
        line-height: 50px;
        margin: auto;
        /*width: 80px;*/
      }
      .item-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .r-l {
          text-align: right;
          &.t-a-l {
            text-align: left;
          }
          &.red {
            color: @aider_color2;
          }
          flex: 1;
          line-height: inherit;
          color: #8a8b8c;
          font-size: @font_size_28;
          .picker {
            display: inline-block;
            line-height: 50px;
          }
          .i-right {
            vertical-align: -7.5px;
          }
        }
        .tixian {
          width: 62px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          font-size: @font_size_26;
          color: @base_font_color;
          border: 1px solid @border_color_c;
          border-radius: 5px;
        }

      }
      .head-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
      }
      .i-right {
        width: 25px;
        height: 25px;
        margin-left: 15px;
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
