<template>
  <div class="container">
    <view class="withdraw-log">
      <a href="/pages/myshop/rule">结算规则</a>
    </view>
    <view v-if="list && list.length>0" class="list">
      <view class="total">
        总计
        <text class="price">￥{{total}}</text>
      </view>
      <a hover-class="none" :href="'/pages/shoporder/info?no='+item.order_no"  v-for="item of list" :key="index" class="item">
        <view class="i-l">
          <img :src="item.img" alt="">
        </view>
        <view class="i-c">
          <h3>{{item.name}}
          </h3>
          <view class="info">
            <text class="price"><b>￥</b>{{item.price}}</text>
            <text class="oldprice">￥{{item.price_tag}}</text>
          </view>
        </view>
        <view class="i-r">
          <view class="price">￥{{item.money}}</view>
          <view class="stat">{{item.type}}</view>
        </view>
      </a>
    </view>
    <view v-else class="con-none">
      没有相关信息
    </view>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        status: 1, // 1未结算 2已结算
        page: 1,
        moreStutas: false,
        list: [],
        total: '0.00'
      }
    },
    mounted() {
      wx.hideShareMenu()
      this.getShopUnsettled()
    },
    methods: {
      async getShopUnsettled() {
        if (this.moreStutas) {
          util.showToast('没有更多了~')
          return
        }
        util.showLoading()
        const res = await api.getShopUnsettled({
          page: this.page
        })
        util.hideLoading()
        if (res.code === 0) {
          if (this.page > 1) {
            if (res.data.list.length === 0) {
              util.showToast('没有更多了~')
              this.moreStutas = true
              return
            }
            this.list = this.list.concat(res.data.list.length)
          } else {
            this.list = res.data.list
            this.total = res.data.total
          }
        } else {
          util.showToast(res.msg)
        }
      }
    },
    async onReachBottom() {
      this.page++
      await this.getShopUnsettled()
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../../static/css/base";

  .container {
    background: @content-back;
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

  .list {
    margin-top: 7.5px;
    width: 100%;
    .total {
      width: 100%;
      box-sizing: border-box;
      color: @base_font_color;
      font-size: @font_size_28;
      border-bottom: .5px solid @border_color_c;
      padding: 7.5px 15px;
      background: @white;
      margin-top: 7.5px;
      .price {
        float: right;
        color: @aider_color2;
      }
    }
    .item {
      width: 100%;
      box-sizing: border-box;
      padding: 15px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: @white;
      border-bottom: .5px solid @border_color_c;
      .i-l {
        width: 60px;
        height: 60px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .i-c {
        width: 205px;
        padding-left: 10px;
        h3 {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: @font_size_30;
        }
        .info {
          .price {
            font-size: @font_size_30;
            display: inline-block;
            b {
              font-size: @font_size_24;
            }
          }
          .oldprice {
            display: inline-block;
            font-size: @font_size_30;
            color: @aider_font_color;
            text-decoration: line-through;
            margin-left: 10px;
          }
        }
      }
      .i-r {
        font-size: 0;
        flex: 1;
        text-align: center;
        .price {
          color: @aider_color2;
          font-size: @font_size_30;
          display: block;
        }
        .stat {
          color: #8a8c8f;
          font-size: @font_size_28;
        }
      }
    }
  }

  .con-none {
    width: 100%;
    padding-top: 100px;
    text-align: center;
    font-size: @font_size_30;
    color: @aider_font_color;
  }
</style>
