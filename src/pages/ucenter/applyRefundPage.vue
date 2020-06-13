<template>
  <view class="container">

    <div class="list">
      <a class="cover" hover-class="none" :href="'/pages/goods/goods?id='+ data.product.idcode">
        <img
          :src="data.product.img[0]">
      </a>
      <a hover-class="none" :href="'/pages/goods/goods?id='+ data.product.idcode" class="content">
        <div class="desc">
          <p class="desc-name">{{data.product.name}}</p>
          <p>{{data.product.color_name}},{{data.product.size}}</p>
        </div>
        <!--apply_refund-->
        <div class="monny">
          <span class="price">￥{{data.product.price}}</span>
        </div>
      </a>
      <div class="num">
        <span>x {{data.product.num}}</span>
      </div>
    </div>
    <view class="viewport">
      <view class="item">
        <view class="item-left">退货原因</view>
        <view class="item-right">
          <picker class="r-l" :value="reasonindex" :range="reason" @change="changeReason" mode="selector">
            <view class="picker"> {{reason[reasonindex]}}</view>
            <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
          </picker>
        </view>
      </view>
      <view class="item">
        <view class="item-left">退款金额</view>
        <view class="item-right">
          <view class="r-l">
            <text>￥</text>
            {{oldRefundAomunt}}
          </view>
          <view class="i-right"></view>
        </view>
      </view>
      <view class="box">
        <view class="item-left">
          <view>商品价格：{{data.product.price}}</view>
          <view>订单优惠：{{promotionPrice}}</view>
          <view>已申请退款：{{data.refunded_fee}}</view>
          <view>订单总金额：{{data.price}}</view>
        </view>
      </view>
      <view class="item">
        <view class="item-left">退款金额</view>
        <view class="item-right">
          <view class="r-l t-a-l"><input type="text" v-model="refundAomunt"></view>
          <view class="i-right"></view>
        </view>
      </view>
      <view class="item">
        <view class="item-left">退款说明</view>
        <view class="item-right">
          <view class="r-l t-a-l"><input type="text" v-model="note" placeholder="请填写退货说明"></view>
          <view class="i-right"></view>
        </view>
      </view>
    </view>
    <button @click="submit" class="submit">提交申请</button>
  </view>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'
  import region from '@/components/region'

  export default {
    components: {
      region
    },
    data() {
      return {
        data: {
          product: {
            img: []
          }
        },
        isDialog: false,
        reason: ['质量问题', '买错号'],
        reasonindex: 0,
        oldRefundAomunt: '0.00',
        refundAomunt: '0.00',
        promotionPrice: '0.00',
        headPhoto: '',
        note: '',
        card_img_a: {},
        card_img_b: {},
        card_img_c: {}
      }
    },
    onShow() {
    },
    mounted() {
      const orderNo = this.$route.query.order_no
      const id = this.$route.query.item_id
      if (orderNo && id) {
        this.applyRefundPage({
          item_id: id,
          order_no: orderNo
        })
      }
    },
    methods: {
      async applyRefundPage(param) {
        util.showLoading()
        const res = await api.applyRefundPage(param)
        util.hideLoading()
        if (res.code === 0) {
          this.data = res.data.data
          this.refundAomunt = res.data.refund_aomunt
          this.oldRefundAomunt = res.data.refund_aomunt
          this.promotionPrice = (parseFloat(this.data.promotion_coupon_price) + parseFloat(this.data.promotion_order_price) + parseFloat(this.data.promotion_goods_price)).toFixed(2)
        } else {
          util.showToast(res.msg)
        }
      },
      changeReason(e) {
        this.reasonindex = e.target.value
      },
      async submit() {
        const orderNo = this.data.order_no
        const refundAomunt = this.oldRefundAomunt
        const reason = this.reason[this.reasonindex]
        const note = this.note
        const itemId = this.data.product.id
        const price = this.refundAomunt
        const preg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
        if (!preg.test(price)) {
          util.showToast('请输入退款金额')
          return false
        }
        if (price > refundAomunt) {
          util.showToast('退款金额不能大于实际支付金额')
          return false
        }
        const res = await api.applyRefund({
          order_no: orderNo,
          refund_aomunt: refundAomunt,
          reason: reason,
          note: note,
          item_id: itemId,
          t_price: price
        })
        if (res.code === 0) {
          util.redirect('/pages/ucenter/refundInfo?service_id=' + res.data.id)
        } else {
          util.showToast(res.msg)
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../static/css/base";

  .photo-list {
    background: #fff;
    padding: 10px 15px;
    width: 100%;
    box-sizing: border-box;
    h3 {
      font-size: @font_size_28;
      line-height: 35px;
      padding: 0 0 10px 0;
    }
    .photo {
      width: 80px;
      height: 80px;
      background: url(https://yxds.999d.com/static/m/image/upload_photo_bg.png) no-repeat;
      background-size: 80px 80px;
      margin: 0px 10px 10px 0px;
      text-align: center;
      float: left;
      position: relative;
    }
  }

  .container {
    background: @content-back;
    width: 100%;
  }

  .list {
    margin-top: 7.5px;
    padding: 15px 20px;
    border-bottom: .5px solid @border_color_c;
    display: flex;
    color: @base_font_color;
    background: @white;
    width: 100%;
    box-sizing: border-box;
    .cover {
      display: block;
      width: 75px;
      height: 75px;
      position: relative;
      margin-right: 10px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .content {
      flex: 1;
      .monny {
        .price {
          color: @aider_color2;
          font-size: @font_size_28;
          font-weight: bold;
          margin-right: 10px;
        }
        .old-price {
          color: @aider_font_color;
          text-decoration: line-through;
          font-size: @font_size_24;
        }
      }
      .desc {
        p {
          font-size: @font_size_24;
          color: @aider_font_color;
          line-height: 20px;
        }
        .desc-name {
          color: @base_font_color;
          font-size: @font_size_28;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .promotion {
        background: #fbe9e9;
        color: @aider_color2;
        font-size: @font_size_26;
        display: inline-block;
        padding: 0 10px;
        margin-top: 5px;
      }
    }
    .num {
      line-height: 75px;
      font-size: @font_size_28;
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
        width: 80px;
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

  .update-img {
    width: 100%;
    height: 100%;
  }

  .submit {
    width: 90%;
    height: 50px;
    line-height: 50px;
    margin-top: 20px;
    margin-bottom: 20px;
    font-size: @font_size_30;
    color: @white;
    background: @aider_color1;
  }

</style>
