<template>
  <div class="container">
    <view class="sales">
      <view class="item s-l">
        <view>总销售额</view>
        <view class="price">
          <text>￥</text>
          {{totalSales}}
        </view>
      </view>
      <view class="item s-r">
        <view>总佣金</view>
        <view class="price">
          <text>￥</text>
          {{commissionAmount}}
        </view>
      </view>
    </view>
    <view v-if="infoOrderData && infoOrderData.length>0" class="viewport">
      <view class="sales-title">销售明细</view>
      <view class="item">
        <view class="item-left">订单编号/时间</view>
        <view class="item-mid">销售额</view>
        <view class="item-right">佣金</view>
      </view>
      <a hover-class="none" :href="'/pages/shoporder/info?no='+item.order_no"
         v-for="item of infoOrderData" :key="index" class="item no-online">
        <view class="item-left">
          <view>{{item.order_no}}</view>
          <view>{{item.created_at}}</view>
        </view>
        <view class="item-mid red">￥{{item.price}}</view>
        <view class="item-right red">￥{{item.single_commission_amount}}</view>
      </a>
    </view>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        infoOrderData: [],
        time: 'month',
        commissionAmount: '0.00',
        totalSales: '0.00'
      }
    },
    mounted() {
      if (this.$route.query.time) {
        this.time = this.$route.query.time
      }
      this.getShopSales()
    },
    methods: {
      async getShopSales() {
        util.showLoading('提交中...')
        const res = await api.getShopSales({
          time: this.time
        })
        util.hideLoading()
        if (res.code === 0) {
          this.infoOrderData = res.data.sales_order_list
          this.commissionAmount = res.data.commission_amount
          this.totalSales = res.data.total_sales
        } else {
          util.showToast(res.msg)
          this.disabled = false
          return false
        }
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../../static/css/base";

  .container {
    background: @content-back;
  }

  .sales {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background: #fff;
    border-top: .5px solid @border_color_c;
    font-size: @font_size_30;
    color: @base_font_color;
    padding: 30px 0;
    .item {
      flex: 1;
      text-align: center;
      .price {
        font-size: @font_size_50;
        color: @aider_color2;
        text {
          font-size: @font_size_30;
        }
      }
      &.s-r {
        border-left: 1px solid @border_color_c;
      }
    }
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

  .viewport {
    width: 100%;
    margin-top: 8px;
    background: @white;
    .item {
      height: 50px;
      padding: 0 10px 0 15px;
      border-bottom: .5px solid @border_color_c;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: @font_size_28;
      color: @base_font_color;
      .item-left {
        display: inline-block;
        line-height: 50px;
        margin: auto;
        width: 55%;
      }
      .red {
        color: @aider_color2;
      }
      .item-mid {
        width: 25%;
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
          height: 18px;
          line-height: 18px;
          text-align: center;
          font-size: @font_size_26;
          color: @base_font_color;
          border: .5px solid @border_color_c;
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
      &.no-online {
        padding: 10px 10px 10px 15px;
        height: auto;
        .item-left, .item-right {
          line-height: 25px;
        }
      }
    }
  }

  .sales-title {
    background: @content-back;
    font-size: @font_size_30;
    color: @base_font_color;
    padding: 7.5px 10px 15px 15px;
  }
</style>
