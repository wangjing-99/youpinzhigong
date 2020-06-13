<template>
  <view class="container">
    <view class="order-state">
      <view @click="changeStatus(1)" data-status="1" :class="status==1?'active':''">全部</view>
      <view @click="changeStatus(2)" data-status="2" :class="status==2?'active':''">
        待付款
        <text v-if="menuNums.pending_payment>0" class="num">{{menuNums.pending_payment}}</text>
      </view>
      <view @click="changeStatus(3)" data-status="3" :class="status==3?'active':''">
        待发货
        <text v-if="menuNums.pending_delivery>0" class="num">{{menuNums.pending_delivery}}</text>
      </view>
      <view @click="changeStatus(4)" data-status="4" :class="status==4?'active':''">
        待收货
        <text v-if="menuNums.pending_goods>0" class="num">{{menuNums.pending_goods}}</text>
      </view>
      <view @click="changeStatus(7)" data-status="7" :class="status==7?'active':''">已完成</view>
    </view>
    <view class="order-content">
      <scroll-view v-if="data.length>0" @scrolltolower="lower" class="order-scroll" scroll-y="true"
                   scroll-with-animation="true"
                   style="height: 100%">
        <view v-for="(item, index) in data" :key="index" class="order-detail">
          <view class="order-h">
            <view class="shop-name">
              <image src="/static/images/my/i_home.png"></image>
              {{item.shop?item.shop.name:''}}
            </view>
            <view class="status">{{item.status_str}}</view>
          </view>

          <view v-for="(product, idx) in item.product" :key="idx" class="goods-item"
                @click.stop="goGoods(product.idcode,item.shop_idcode)">
            <image :src="product.img[0]" class="goods-img"/>
            <view class="goods-info">
              <view class="goods-name owt">{{product.name}}</view>
              <view class="goods-spac">
                <view class="owt">{{product.color_name}},{{product.size}}</view>
                <view>
                  <text class="goods-price">￥{{product.price}}</text>
                  <view class="goods-num">x {{product.num}}</view>
                  <!--<view v-if="product.action" class="goods-action" @click.stop="showMsg()">{{product.action.name}}</view>-->
                  <!--<a v-if="product.action" :href="'/pages/ucenter/applyReturn?order_no='+item.order_no+'&item_id='+product.id"-->
                  <!--class="goods-action">{{product.action.name}}</a>-->
                  <view v-if="product.action && product.action.length>0" @click.stop="actionorder(product.action)" :class="product.action.name=='退款中' || product.action.name=='退款成功' || product.action.name=='退货中'?'goods-action act-red':'goods-action'">
                    {{product.action.name}}
                  </view>
                </view>
              </view>
            </view>
          </view>

          <view class="order-info">
            <view class="info-code">订单号：{{item.order_no}}</view>
            <view class="info-num">共{{item.sum_num}}件商品</view>
            <view class="info-price">总计：
              <text>￥{{item.price}}</text>
            </view>
          </view>

          <view class="order-btn">
            <view class="btn" v-for="(ac,idx) in item.action" :key="idx">
              <view v-if="ac.name==='取消订单'" @click="delOrder(item.order_no)">{{ac.name}}</view>
              <navigator v-if="ac.name==='查看物流'" :url="'/pages/ucenter/express?no='+item.order_no">{{ac.name}}
              </navigator>
              <navigator v-if="ac.name==='订单详情'" :url="'/pages/ucenter/orderDetail?no='+item.order_no">{{ac.name}}
              </navigator>
              <view @click="payOrder(item.order_no)" v-if="ac.name==='支付订单'">{{ac.name}}</view>
              <view v-if="ac.name==='确定收货'" @click="confirmOrder(item.order_no)">{{ac.name}}</view>
            </view>
            <!--<view class="btn">-->
            <!--<navigator url="/pages/ucenter/orderDetail">订单详情</navigator>-->
            <!--</view>-->
            <!--<view class="btn active" @click="payOrder">去付款</view>-->
          </view>

        </view>
      </scroll-view>
      <div v-else class="order-null">
        <img src="/static/images/my/ib_order.png" alt="">
        <h2>亲！您没相关订单哦！</h2>
      </div>
    </view>
  </view>
</template>
<script>
  import api from '@/utils/api'
  import util from '@/utils/util'
  import pay from '@/services/pay'

  export default {
    data() {
      return {
        data: [],
        status: 1,
        page: 1,
        moreStutas: false,
        menuNums: {}
      }
    },
    async mounted() {
      if (this.$route.query.status) {
        this.status = this.$route.query.status
        wx.setStorageSync('ckstatue', parseInt(this.status))
      }
      wx.hideShareMenu()
      this.getMyOrder()
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
      async getMyOrder() {
        if (this.moreStutas) {
          util.showToast('没有更多了~')
          return
        }
        util.showLoading()
        const res = await api.getMyOrder({
          page: this.page,
          status: this.status
        })
        util.hideLoading()
        if (res.code === 0) {
          if (this.page > 1) {
            if (res.data.data.length === 0) {
              util.showToast('没有更多了~')
              this.moreStutas = true
              return
            }
            this.data = this.data.concat(res.data.data)
          } else {
            this.data = res.data.data
            this.menuNums = res.data.menu_nums
          }
        } else {
          util.showToast(res.msg)
        }
      },
      async delOrder(no) {
        const confirm = await util.showModal('更改订单,您确认进行此操作？');
        if (confirm) {
          const res = await api.changOrder({
            order_no: no,
            status: '用户取消'
          });
          if (res.code === 0) {
            this.restGetOrder()
          }
        }
      },
      restGetOrder() {
        this.moreStutas = false
        this.page = 1
        this.getMyOrder()
      },
      async confirmOrder(no) {
        const confirm = await util.showModal('更改订单,您确认进行此操作？');
        if (confirm) {
          const res = await api.changOrder({
            order_no: no,
            status: '已收货'
          });
          if (res.code === 0) {
            this.restGetOrder()
          }
        }
      },
      showMsg() {
        util.showToast('功能开发中，请关注99严选公众号操作')
      },
      payOrder(orderNo) {
        pay.payOrder(orderNo, 'order')
      },
      changeStatus(status) {
        if (parseInt(status) === parseInt(this.status)) return
        this.status = status
        this.restGetOrder()
        wx.setStorageSync('ckstatue', this.status)
      },
      goGoods(code, shopId) {
        if (code) {
          util.navigate('/pages/goods/goods?id=' + code + '&shop=' + shopId)
        } else {
          util.showToast('没有code_id')
        }
      },
      lower() {
        this.page++
        this.getMyOrder()
      }
    },
    onUnload() {
      this.data = []
      this.status = 1
      this.page = 1
      this.moreStutas = false
      wx.removeStorageSync('ckstatue')
    },
    onShow() {
      const status = wx.getStorageSync('ckstatue')
      if (status) {
        this.status = status
        this.getMyOrder()
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../static/css/base";

  page {
    height: 100%;
    width: 100%;
  }

  .container {
    width: 100%;
    background: @content-back;
  }

  .order-state {
    position: fixed;
    top: 0;
    left: 0;
    height: 40px;
    width: 100%;
    display: flex;
    border-bottom: .5px solid @border_color;
    border-top: .5px solid @border_color;
    margin-bottom: 7px;
    background: @white;
    z-index: 2;
    view {
      width: 25%;
      height: 100%;
      line-height: 40px;
      font-size: @font_size_30;
      color: @base_font_color;
      text-align: center;
      position: relative;
      .num{
        width: 18px;
        height: 18px;
        overflow: hidden;
        border-radius: 50px;
        line-height: 18px;
        font-size: @font_size_24;
        background-color: @base_color;
        color: #fff;
        position: absolute;
        top: 7px;
        right: 5px;
      }
    }

    .active {
      color: @button_color3;
      border-bottom: 2px solid @button_color3;
    }

  }

  .order-content {
    position: fixed;
    top: 40px;
    bottom: 0;
    width: 100%;
    z-index: 1;
    .order-scroll {
    }
  }

  .order-null {
    text-align: center;
    margin-top: 100px;
    img {
      width: 96px;
      height: 96px;
      display: block;
      margin: 30px auto 20px;
    }
    h2 {
      font-size: 14px;
      color: #8a8c8f;
    }

  }

  .order-detail {
    width: 100%;
    background: @white;
    margin-top: 7.5px;
    .order-h {
      height: 35px;
      border-bottom: 1px solid @border_color_c;
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
      border-bottom: 1px solid @border_color_c;
      position: relative;
      .goods-img {
        width: 70px;
        height: 70px;
      }

      .goods-info {
        float: right;
        width: 250px;

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
    .order-info {
      height: 40px;
      padding: 0 10px;
      border-bottom: 1px solid @border_color_c;
      display: flex;
      justify-content: space-between;
      line-height: 40px;

      .info-code {
        font-size: @font_size_30;
        color: @base_font_color;
      }

      .info-num, .info-price {
        font-size: @font_size_28;
        color: @aider_font_color;

        text {
          font-size: @font_size_30;
          color: @base_font_color;
        }

      }
    }
    .order-btn {
      padding: 0 10px;
      border-bottom: .5px solid @border_color_c;
      text-align: right;

      .btn {
        display: inline-block;
        margin: 10px;
        font-size: @font_size_28;
        line-height: @font_size_28;
        border-radius: 3px;
        padding: 5px 15px;
        color: @base_font_color;
        border: 1px solid @border_color_c;
      }
    }
    .goods-action {
      &.act-red{
        color: @base_color;
      }
      padding: 1px 10px;
      position: absolute;
      right: 75px;
      bottom: 20px;
      color: @base_font_color;
      border: 0.5px solid @border_color_c;
    }
  }

  image {
    width: 20px;
    height: 20px;
  }

  .owt {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
</style>
