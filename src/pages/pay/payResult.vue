<template>
  <div class="container">
    <div class="pay-result">
      <div class="success" v-if="status == 1">
        <div class="msg">
          <icon type="success" size="50" color="#1d96d7"></icon>
          <div class="text">支付成功</div>
          <div class="price"><span>￥</span>{{paymentOrder.pay_price}}</div>
        </div>
        <div class="btns">
          <navigator hover-class="none" class="btn" url="../ucenter/order" open-type="redirect">查看订单</navigator>
          <navigator hover-class="none" class="btn" url="../index/index" open-type="switchTab">返回首页</navigator>
        </div>
      </div>
      <div class="error" v-if="status == 0">
        <div class="msg">
          <icon type="cancel" size="50" color="#d6004f"></icon>
          <div class="text">订单支付失败，请稍后重试</div>
          <div class="p">
            <text class="time">{{time}}s</text>
            自动返回我的订单页
          </div>
        </div>
        <div class="btns">
          <navigator hover-class="none" class="btn" url="../index/index" open-type="switchTab">返回首页</navigator>
          <navigator hover-class="none" class="btn" url="../ucenter/order?status=1" open-type="redirect">立即前往
          </navigator>
        </div>
      </div>
    </div>
    <!--<goodList v-if="like" :like="like"></goodList>-->
  </div>
</template>

<script>
  // import api from '@/utils/api'
  import wx from 'wx'
  import pay from '@/services/pay'
  import util from '@/utils/util'
  import api from '@/utils/api'
  import goodList from '@/components/goodList'

  export default {
    components: {
      goodList
    },
    data() {
      return {
        like: [],
        status: 0,
        paymentNo: 0,
        isShoper: false,
        paymentOrder: {},
        time: 5,
        timer: null
      }
    },
    async mounted() {
      wx.hideShareMenu()
      if (this.$route.query.status) {
        this.status = parseInt(this.$route.query.status)
        this.time = 5
      }
      this.getOrderPayMsg()
    },
    methods: {
      // 返回订单详情页
      async getOrderPayMsg() {
        const res = await api.getOrderPayMsg({
          payment_no: this.$route.query.payment_no
        })
        if (res.code === 0) {
          this.like = res.data.rec_list
          this.paymentOrder = res.data.paymentorder
          this.isShoper = res.data.is_shoper
          this.type = res.data.type
          if (this.status === 0) {
            this.setTimer()
          }
        } else {
          util.showToast(res.msg)
        }
      },
      setTimer() {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          if (this.time === 0) {
            clearInterval(this.timer)
            util.redirect('/pages/ucenter/order?status=1')
            return
          }
          this.time--
        }, 1000)
      },
      redirectToOrderDetail() {
        wx.redirectTo({
          url: '../ucenter/orderDetail?id=' + this.paymentNo
        })
      },
      // 重新付款
      payOrder() {
        pay.payOrder(this.paymentNo).then(res => {
          this.status = true;
        }).catch(res => {
          util.showErrorToast('支付失败');
        })
      }
    },
    onUnload() {
      clearInterval(this.timer)
      this.timer = null
    }
  }
</script>

<style scoped type="text/less" lang="less">
  @import "../../../static/css/base";

  .container {
    background: @content-back;
  }

  .pay-result {
    background: #fff;
    width: 100%;
    margin-top: 7.5px;
    padding-bottom: 25px;
    .msg {
      text-align: center;
      margin: 25px auto;
      font-size: @font_size_28;
    }
    .success {
      .text {
        color: @aider_color1;
        margin-top: 5px;
      }
      .price {
        font-size: @font_size_50;
        color: @base_font_color;
        margin-top: 15px;
        span {
          font-size: @font_size_30;
          font-weight: bold;
        }
      }
    }
    .error {
      .text {
        color: @base_color;
        margin-top: 5px;
      }
      .p {
        color: @aider_font_color;
        font-size: @font_size_30;
        margin-top: 10px;
      }
    }
    .btns {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      .btn {
        flex: 1;
        text-align: center;
        font-size: @font_size_30;
        color: @base_font_color;
        &:first-child {
          border-right: .5px solid @border_color_c;
        }
      }
    }
  }

</style>
