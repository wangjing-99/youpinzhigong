<template>
  <view class="container">
    <view class="order-state">
      <!--<wxParse :content="orderInfo.status_str" />-->
      <view class="state-close" v-if="orderInfo.status === '-10'||orderInfo.status === '-20'">
        <icon type="cancel" size="40"></icon>
        <view class="close">
          <view>交易关闭</view>
          <text>取消订单原因：我不想买了</text>
        </view>
      </view>

      <view class="state-success"
            v-if="orderInfo.status === '50'||orderInfo.status === '100'||orderInfo.status === '200'||orderInfo.status === '-100'">
        <view class="state">
          <icon type="success" color="#1d96d7" size="40"></icon>
          <view class="success">交易成功</view>
        </view>
        <navigator :url="'/pages/ucenter/express?no='+orderId">
          <text>查看物流信息</text>
          <img src="/static/images/i_ar_h_right.png" class="icon-r">
        </navigator>
      </view>

      <div class="status-waiting" v-if="orderInfo.status === '15'">
        <icon type="waiting" size="40" color="#f52d26"></icon>
        <div class="title">
          <h3>待付款</h3>
          <p>剩 <b>{{orderInfo.status_str_time}}</b> 自动关闭</p>
        </div>
      </div>

      <div class="status-payover" v-if="orderInfo.status === '20'||orderInfo.status === '30'">
        <icon type="success" size="40" color="#1d96d7"></icon>
        <div class="title">
          <h3>买家已付款</h3>
        </div>
      </div>

      <div class="status-shipped" v-if="orderInfo.status === '40'||orderInfo.status === '41'">
        <div class="title">
          <h3>
            <img src="/static/images/my/i_shipped.png" alt="">
            <p>卖家已发货</p>
          </h3>
        </div>
        <navigator :url="'/pages/ucenter/express?no='+orderId">
          <text>查看物流信息</text>
          <img src="/static/images/i_ar_h_right.png" class="icon-r">
        </navigator>
      </div>
    </view>

    <view class="order-ad">
      <view class="order-n-p">
        <text>收货人：{{orderInfo.accept_name}}</text>
        <text>{{orderInfo.mobile}}</text>
      </view>
      <view class="order-ads">
        <image src="/static/images/my/i_location.png"></image>
        <view>收货地址：{{orderInfo.province}}{{orderInfo.city}}{{orderInfo.area}}{{orderInfo.address}}</view>
      </view>
    </view>

    <view class="order-detail">
      <view class="order-h">
        <view class="shop-name">
          <image src="/static/images/my/i_home.png"></image>
          {{orderInfo.shop.name}}
        </view>
      </view>

      <view class="goods-item" v-for="(orders,indx) in orderInfo.product" :key="indx"
            @click.stop="goGoods(orders.idcode, orderInfo.shop_idcode)">
        <image :src="orders.img[0]" class="goods-img"/>
        <view class="goods-info">
          <view class="goods-name owt">{{orders.name}}</view>
          <view class="goods-spac">
            <view class="owt">{{orders.color_name}},{{orders.size}}</view>
            <view>
              <text class="goods-price">￥{{orders.price}}</text>
              <view class="goods-num">x {{orders.num}}</view>
              <view v-if="orders.action" @click.stop="actionorder(orders.action)" class="goods-action">
                {{orders.action.name}}
              </view>
            </view>
          </view>
        </view>
      </view>

    </view>

    <view class="order-info">
      <view>
        <text>商品总额：</text>
        <text>￥{{orderInfo.goods_total_price}}</text>
      </view>
      <view>
        <text>运费：</text>
        <text>{{orderInfo.freight_price}}</text>
      </view>
      <view>
        <text>优惠抵扣：</text>
        <text>-￥{{orderInfo.promotion_price}}</text>
      </view>
      <view>
        <text>优惠券抵扣：</text>
        <text>-￥{{orderInfo.promotion_coupon_price}}</text>
      </view>
      <view class="pay-price">
        <text>实付款：</text>
        <text>￥{{orderInfo.price}}</text>
      </view>
    </view>
    <button open-type="contact" class="orderservice">联系客服</button>
    <div class="ordernum">
      <p>订单编号： <span>{{orderId}}</span> <a @click="copyOrderNum">复制</a></p>
      <p>创建时间： <span>{{orderInfo.created_at}}</span></p>
    </div>
    <!--猜你喜欢-你可能还喜欢-->
    <!--<view class="goods-recommand">-->
      <!--<goodList v-if="like" :like="like"></goodList>-->
    <!--</view>-->

    <div class="order-foot" v-if="orderInfo.status === '15'">
      <button class="btn-esc" @click="delOrder()">取消订单</button>
      <button class="btn-pay" @click="payOrder(orderId)">支付订单</button>
    </div>
  </view>
</template>

<script>
  import wx from 'wx';
  import api from '@/utils/api'
  import util from '@/utils/util'
  import pay from '@/services/pay'
  import goodList from '@/components/goodList'
  import wxParse from 'mpvue-wxparse'

  export default {
    components: {
      goodList,
      wxParse
    },
    data() {
      return {
        orderInfo: {
          shop: {
            name: ''
          },
          promotion_price: 0
        },
        like: [],
        orderId: 0
      }
    },
    mounted() {
      this.orderId = this.$route.query.no ? this.$route.query.no : 0;
      this.getOrderInfo();
    },
    methods: {
      actionorder(params) {
        switch (params.uri) {
          case '/m/order/status': // 取消、确认收货
            break;
          case '/m/wxpay/jsapi':
            break;
          default:
            let url = params.uri + '?' + util.formateObjToParamStr(params.parameter)
            util.navigate(url)
            break
        }
      },
      async getOrderInfo() {
        util.showLoading()
        const res = await api.OrderInfo({
          no: this.orderId
        })
        util.hideLoading()
        if (res.code === 0) {
          this.orderInfo = res.data.info
          this.like = res.data.rec_list
          this.orderInfo.promotion_price = parseFloat(this.orderInfo.promotion_order_price, 2) + parseFloat(this.orderInfo.promotion_goods_price, 2)
        } else {
          util.showToast(res.msg)
        }
      },
      async delOrder() {
        const confirm = await util.showModal('更改订单,您确认进行此操作？');
        if (confirm) {
          const res = await api.changOrder({
            order_no: this.orderId,
            status: '用户取消'
          });
          if (res.code === 0) {
            util.showLoading();
            this.getOrderInfo()
          }
        }
      },
      payOrder(orderNo) {
        pay.payOrder(orderNo, 'order')
      },
      goGoods(code, shopId) {
        if (code) {
          util.navigate('/pages/goods/goods?id=' + code + '&shop=' + shopId)
        } else {
          util.showToast('没有code_id')
        }
      },
      copyOrderNum() {
        wx.setClipboardData({
          data: this.orderId,
          success: function (res) {
            util.showToast('复制成功')
          }
        })
      },
      goExpress(e) {
        if (e) {
          util.navigate('/pages/ucenter/express?no=' + this.orderId)
        } else {
          util.showToast('请重试')
        }
      }
    },
    onUnload() {
      this.orderInfo = {
        shop: {
          name: ''
        },
        promotion_price: 0
      }
      this.like = []
      this.orderId = 0
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../../static/css/base";

  page {
    height: 100%;
    width: 100%;
    background: #f4f4f4;
  }

  .container {
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    background: @content-back;
    padding-bottom: 50px;
  }

  page .container .wxParse {
    background: @white;
  }

  page .container .wxParse .status-shipped {
    height: 100px;
    box-sizing: border-box;
    border-bottom: 0.5px solid #ebebeb;
  }

  page .container .wxParse .status-shipped h3 {
    line-height: 40px;
  }

  /*待付款*/

  page .container .wxParse .status-waiting {
    height: 100px;
    box-sizing: border-box;
    border-bottom: 0.5px solid #ebebeb;
    background: @white;
  }

  page .container .wxParse .status-waiting .title {
    font-size: @font_size_28;
    color: @base_font_color;
    padding-left: 55px;
    background: url(https://yxds.999d.com/static/m/image/i_waiting.png) no-repeat 0 center;
    background-size: 45px 45px;
  }

  page .container .wxParse .status-waiting .title .h3 {
    font-size: 20px;
    color: #f23030;
    font-weight: normal;
    line-height: 40px;
  }

  page .container .wxParse .status-waiting .title .b {
    display: inline-block;
    color: #f23030;
  }

  /*交易关闭*/
  page .container .wxParse {
    height: 100px;
    box-sizing: border-box;
    border-bottom: 0.5px solid #ebebeb;
    background: @white;
  }

  page .container .wxParse .state-close .title {
    font-size: @font_size_28;
    color: @base_font_color;
    padding-left: 55px;
    background: url(https://yxds.999d.com/static/m/image/i_close.png) no-repeat 0 center;
    background-size: 45px 45px;
  }

  page .container .wxParse .state-close .title .h3 {
    font-size: 20px;
    color: #f23030;
    font-weight: normal;
    line-height: 40px;
  }

  .order-state {
    width: 100%;
    margin-bottom: 10px;

    .state-close {
      padding: 15px 20px 20px;
    }

    .state-close, .state-success, .status-waiting, .status-payover, .status-shipped {
      height: 100px;
      box-sizing: border-box;
      border-bottom: 0.5px solid #ebebeb;
      background: @white;

      icon {
        margin-right: 10px;
      }

      .close {
        display: inline-block;

        view {
          color: #f23030;
          font-size: 20px;
          line-height: 40px;
        }

        text {
          font-size: @font_size_28;
          color: @base_font_color;
        }

      }
      .state {
        padding: 15px 20px 0px;
      }

      .success {
        display: inline-block;
        vertical-align: top;
        width: 280px;
        height: 40px;
        color: #2897d4;
        font-size: 20px;
        line-height: 40px;
      }

      navigator {
        padding: 10px 20px 0;
        display: flex;
        justify-content: space-between;

        text {
          color: #2897d4;
          font-size: @font_size_28;
          line-height: 20px;
        }

        .icon-r {
          width: 20px;
          height: 20px;
        }

      }
    }

    .status-waiting {
      padding: 15px 20px 0px;

      .title {
        display: inline-block;
        width: 280px;

        h3 {
          font-size: 20px;
          color: #f23030;
          line-height: 40px;
        }

        p {
          font-size: 14px;

          b {
            display: inline-block;
            color: #f23030;
          }

        }
      }
    }

    .status-payover {
      color: #2897d4;
      padding: 15px 20px 0px;

      icon {
        margin-top: 8px;
      }

      .title {
        display: inline-block;
        vertical-align: top;
        line-height: 60px;
      }

    }
    .status-shipped {

      .title {
        padding: 15px 20px 0px;
        border-bottom: 0.5px solid #ebebeb;

        img {
          margin-right: 10px;
          width: 40px;
          height: 40px;
          vertical-align: top;
        }

        h3 {
          padding-bottom: 10px;

          p {
            display: inline-block;
            line-height: 40px;
          }

        }
      }
    }
  }

  .order-ad {
    background: @white;
    padding: 20px;
    width: 100%;
    margin-bottom: 10px;

    .order-n-p {
      line-height: 30px;
      font-size: 16px;
      color: @base_font_color;
      display: flex;
      justify-content: space-around;
    }

    .order-ads {
      font-size: @font_size_28;
      line-height: 30px;
      color: @base_font_color;
      padding: 0 20px;

      image {
        width: 30px;
        height: 30px;
        vertical-align: top;
      }

      view {
        display: inline-block;
        width: 280px;
      }

    }
  }

  .order-detail {
    width: 100%;
    background: @white;
    margin-bottom: 10px;

    .order-h {
      height: 35px;
      border-bottom: 0.5px solid @border_color_c;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;

      .shop-name {

        image {
          width: 20px;
          height: 20px;
          vertical-align: -3px;
        }

        line-height: 35px;
        color: @base_font_color;
        font-size: @font_size_30;
      }
      .status {
        line-height: 35px;
        color: #d0264b;
        font-size: @font_size_28;
      }

    }
    .goods-item {
      padding: 15px 20px;
      border-bottom: 0.5px solid @border_color_c;
      position: relative;
      .goods-img {
        width: 70px;
        height: 70px;
      }

      .goods-info {
        float: right;
        width: 250px;
        .goods-action {
          &.act-red{
            color: @base_color;
          }
          padding: 1px 5px;
          position: absolute;
          right: 75px;
          bottom: 20px;
          color: @base_font_color;
          border: 0.5px solid @border_color_c;
        }
        .goods-name {
          font-size: @font_size_30;
          color: @base_font_color;
        }

        .goods-spac {
          font-size: @font_size_28;
          color: @aider_font_color;
          margin-top: 8px;

          .goods-num {
            font-size: @font_size_28;
            color: @base_font_color;
            float: right;
          }

          .goods-price {
            font-size: @font_size_30;
            color: @base_font_color;
          }

        }
      }
    }
  }

  .order-info {
    width: 100%;
    box-sizing: border-box;
    background: @white;
    padding: 10px 20px;
    border-bottom: 0.5px solid @border_color_c;
    margin-bottom: 10px;

    view {
      display: flex;
      justify-content: space-between;

      text {
        color: #8a8c8f;
        font-size: @font_size_28;
        line-height: 20px;
        margin: 5px 0;
      }

    }
    .pay-price {
      border-top: 0.5px solid @border_color_c;
    }

    .pay-price text:first-child {
      color: @base_font_color;
    }

    .pay-price text:last-child {
      font-size: 16px;
      color: #f23030;
    }

  }

  .orderservice {
    width: 100%;
    padding: 5px 0;
    color: #2897d4;
    font-size: @font_size_30;
    background: @white;
    border-left: none;
    border-right: none;
    margin-bottom: 10px;
    border-radius: 0;
  }

  .ordernum {
    width: 100%;
    background: @white;
    box-sizing: border-box;
    padding: 10px 20px;
    color: #8a8c8f;
    font-size: 14px;
    line-height: 25px;
    border-bottom: 1px #ededed solid;
    margin-bottom: 10px;
    a {
      display: inline-block;
      padding: 2.5px 10px;
      color: #8a8c8f;
      margin-left: 10px;
      border: 0.5px solid #8a8c8f;
      font-size: 12px;
      line-height: 14px;
      border-radius: 5px;
    }
  }

  .goods-recommand {

    .goods-recommand-h {
      height: 20px;
      padding: 10px;
      text-align: center;
      font-size: @font_size_28;
      color: #8a8c8f;
    }

    .goods-list {
      padding: 12px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      .item {
        width: 170px;
        height: 257px;
        margin-bottom: 10px;
        background: @white;

        image {
          width: 170px;
          height: 170px;
        }

        .item-name {
          height: 28px;
          padding: 10px;
          font-size: @font_size_28;
          color: @base_font_color;
          line-height: 18px;
        }

        .item-price {
          padding-left: 10px;
        }

        .item-price text:first-child {
          color: #f23030;
          font-size: 16px;
        }

        .item-price text:last-child {
          font-size: @font_size_24;
          color: @aider_font_color;
          text-decoration: line-through
        }

      }
    }

  }

  .order-foot {
    height: 50px;
    width: 100%;
    box-sizing: border-box;
    padding: 5px 20px;
    position: fixed;
    left: 0px;
    bottom: 0px;
    background: @white;
    text-align: right;
    border-top: 0.5px solid #ebebeb;

    button {
      display: inline-block;
      width: 30%;
      height: 40px;
      font-size: 16px;
      line-height: 40px;
    }

    .btn-pay {
      color: @white;
      background: #d60046;
      margin-left: 20px;
    }

  }

  .owt {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .otw2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
    overflow: hidden;
    font-style: normal;
  }

</style>

