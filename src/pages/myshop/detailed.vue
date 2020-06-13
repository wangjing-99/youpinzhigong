<template>
  <view class="container">
    <view class="withdraw-log">
      <a href="/pages/myshop/rule">结算规则</a>
    </view>
    <view class="nav">
      <view @click="tabNav('537fdl')" class="nav-item">
        <text :class="boptype=='537fdl'?'active':''">全部</text>
      </view>
      <view @click="tabNav('537f18')" class="nav-item">
        <text :class="boptype=='537f18'?'active':''">订单入账</text>
      </view>
      <view @click="tabNav('537fdt')" class="nav-item">
        <text :class="boptype=='537fdt'?'active':''">奖励</text>
      </view>
      <view @click="tabNav('537f1o')" class="nav-item">
        <text :class="boptype=='537f1o'?'active':''">提现</text>
      </view>
    </view>
    <view v-if="shopBopInfo && shopBopInfo.length>0" class="list">
      <block v-for="item of shopBopInfo" :key="index">
        <a :href="'/pages/shoporder/info?no='+item.order_number" class="item">
          <view class="i-l">
            <view>{{item.describe}}</view>
            <view class="date">{{item.created_at}}</view>
          </view>
          <view class="i-r">
            <view v-if="item.bop_price<0" class="price">{{item.bop_price}}</view>
            <view v-else class="price">+{{item.bop_price}}</view>
            <view class="stat">{{item.bop_type}}</view>
          </view>
        </a>
        <!--<a v-else-if="item.bop_type == '537f18'" class="item">-->
        <!--<view class="i-l">-->
        <!--<view>订单入账</view>-->
        <!--<view class="date">{{item.created_at}}</view>-->
        <!--</view>-->
        <!--<view class="i-r">-->
        <!--<view v-if="item.bop_price<0" class="price">{{item.bop_price}}</view>-->
        <!--<view v-else class="price">+{{item.bop_price}}</view>-->
        <!--<view class="stat">佣金</view>-->
        <!--</view>-->
        <!--</a>-->
        <!--<a v-else-if="item.bop_type == '537f1o'" class="item">-->
        <!--<view class="i-l">-->
        <!--<view>提现</view>-->
        <!--<view class="date">{{item.created_at}}</view>-->
        <!--</view>-->
        <!--<view class="i-r">-->
        <!--<view v-if="item.bop_price<0" class="price">{{item.bop_price}}</view>-->
        <!--<view v-else class="price">+{{item.bop_price}}</view>-->
        <!--<view class="stat">银行卡</view>-->
        <!--</view>-->
        <!--</a>-->
      </block>

    </view>
    <view v-else class="con-none">
      没有相关信息
    </view>
  </view>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        page: 1,
        moreStutas: false,
        boptype: '537fdl',
        shopBopInfo: []
      }
    },
    mounted() {
      this.getShopDetailed()
    },
    methods: {
      tabNav(id) {
        if (id === this.boptype) return
        this.boptype = id
        this.page = 1
        this.moreStutas = false
        this.getShopDetailed()
      },
      async getShopDetailed() {
        if (this.moreStutas) {
          util.showToast('没有更多了~')
          return
        }
        util.showLoading()
        const res = await api.getShopDetailed({
          page: this.page,
          boptype: this.boptype
        })
        console.log(res);
        util.hideLoading()
        if (res.code === 0) {
          if (this.page > 1) {
            if (res.data.shop_bop_info.length === 0) {
              util.showToast('没有更多了~')
              this.moreStutas = true
              return
            }
            this.shopBopInfo = this.shopBopInfo.concat(res.data.shop_bop_info)
          } else {
            this.shopBopInfo = res.data.shop_bop_info
            this.boptype = res.data.boptype
          }
        } else {
          util.showToast(res.msg)
        }
      }
    },
    async onReachBottom() {
      this.page++
      await this.getShopDetailed()
    },
    onUnload() {
      this.boptype = '537fdl'
      this.page = 1
      this.moreStutas = false
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../static/css/base";

  .container {
    background: @content-back;
    width: 100%;
  }

  .withdraw-log {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    background: #fff;
    border-top: .5px solid @border_color_c;
    a {
      display: block;
      float: right;
      font-size: @font_size_28;
      color: @base_font_color;
    }
  }
  .con-none {
    width: 100%;
    padding-top: 100px;
    text-align: center;
    font-size: @font_size_30;
    color: @aider_font_color;
  }
  .list {
    margin-top: 7.5px;
    width: 100%;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 15px;
      background: #fff;
      border-bottom: .5px solid @border_color_c;
      font-size: @font_size_28;
      color: @base_color;
      .i-r {
        width: 80px;
        text-align: center;
        .price {
          color: @aider_color2;
        }
        .stat {
          color: @aider_font_color;
        }
      }
      .i-l {
        flex: 1;
        .date {
          color: @aider_font_color;
        }
      }
    }
  }

  .nav {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 7.5px;
    background: #fff;
    border-bottom: .5px solid @border_color_c;
    border-top: .5px solid @border_color_c;
    font-size: @font_size_30;
    color: @base_font_color;
    .nav-item {
      flex: 1;
      text-align: center;
      text {
        display: inline-block;
        padding: 10px 5px;
        &.active {
          border-bottom: 2px solid @base_color;
        }
      }
    }
  }


</style>
