<template>
  <div id="confirm-order">
    <div class="confirm-order-content">
      <scroll-view class="confirm-order" scroll-y="true" scroll-with-animation="true" style="height: 100%">
        <div class="orderaddr">
          <a hover-class="none" v-if="data.address.id" class="addr" href="/pages/ucenter/address?act=order">
            <h3>
              <span class="name">收货人：{{data.address.accept_name}}</span>
              <span class="mob">{{data.address.mobile}}</span>
            </h3>
            <p>
              {{data.address.province.name}}{{data.address.city.name}}{{data.address.area.name}}{{data.address.address}}</p>
            <span class="i_ar_h_right"></span>
          </a>
          <div v-else class="no-addr">
            <p>
              <a hover-class="none" href="/pages/ucenter/address?act=order" class="i_ar_h_right">您当前还没有地址，赶快添加吧！</a>
            </p>
          </div>
        </div>
        <div class="orderpay">
          <div class="item">
            <div class="i-l i_pay_wx">微信支付</div>
            <div class="i_selected"></div>
          </div>
          <div class="item">
            <div class="i-l i_shiped">配送方式</div>
            <div>快递 ￥{{data.freight_price}}</div>
          </div>
          <div v-if="!promotion_coupon_price && coupon_count" @click="couponShow" class="item">
            <div class="i-l i_coupon">优惠券</div>
            <div class="i_ar_h_right">{{coupon_count}}张可用</div>
          </div>
          <div v-else-if="promotion_coupon_price" @click="couponShow" class="item">
            <div class="i-l i_coupon">优惠券</div>
            <div class="i_ar_h_right">已选1张，{{selected_coupons.patch_name}}</div>
          </div>
          <div v-else class="item">
            <div class="i-l i_coupon">优惠券</div>
            <div class="i_ar_h_right">暂无可用券</div>
          </div>
        </div>
        <div class="orderdetail">
          <div class="o-title">
            <h3>订单信息</h3>
          </div>
          <ul>
            <li v-for="(product, index) of data.products"
                :key="item" :data-index="index">
              <div class="list">
                <a class="cover" hover-class="none" :href="'/pages/goods/goods?id=' + product.products_idcode">
                  <img :src="product['imgs'][0]">
                </a>
                <a hover-class="none" :href="'/pages/goods/goods?id=' + product.products_idcode" class="content">
                  <div class="desc">
                    <p class="desc-name">{{product.name}}</p>
                    <p>{{product.color.name}}&nbsp;{{product.color.size.name}}</p>
                    <div v-if="product.not_distribution" class="promotion">
                      您的收货区域不配送
                    </div>
                    <div v-if="product.promotions.etime" class="promotion">
                      限时 {{product.promotions.etime}} 结束
                    </div>
                  </div>
                  <div class="monny">
                    <span class="price">￥{{product.color.size.price}}</span>
                    <span class="old-price">￥{{product.color.size.price_tag}}</span>
                  </div>
                </a>
                <div class="num">
                  <span>x {{product.num}}</span>
                </div>
              </div>
              <div class="o-bottom">
                小计：<span class="price"><span class="s-price">￥</span>{{product.total_price}}</span>
              </div>
            </li>
          </ul>
          <div class="ordermsg">
            <input maxlength="200" v-model="orderRemarks" id="order_remarks" class="input_ordermsg"
                   placeholder="给卖家留言200字以内（选填）">
          </div>
        </div>
        <div class="orderinfo">
          <div class="i-box">
            <div class="item">
              <div class="i-l">商品总额:</div>
              <div class="i-r">￥{{data.goods_total_price}}</div>
            </div>
            <div class="item">
              <div class="i-l">运费：</div>
              <div class="i-r">￥{{data.freight_price}}</div>
            </div>
            <div class="item">
              <div class="i-l">优惠抵扣：</div>
              <div class="i-r">-￥{{couponPrice}}
              </div>
            </div>
          </div>
          <div class="i-bottom">
            <span class="price"><span class="s-price">￥</span>{{data.total_price}}</span>
          </div>
        </div>
        <div class="zhanwei"></div>
      </scroll-view>
    </div>
    <div v-if="data.address.id" class="tips-footer">
      送至：{{data.address.province.name}}{{data.address.city.name}}{{data.address.area.name}}{{data.address.address}}
    </div>
    <div class="confirm-order-footer">
      <div class="btn-total">
        <p class="price">
          应付金额<span id="total-price"><sapn class="s-price">￥</sapn>{{data.total_price}}</span>
        </p>
        <p class="express">（含运费）</p>
      </div>
      <!--<input type="hidden" id="payment_type" name="payment_type" value="weixin">-->
      <!--<input type="hidden" id="order_address" name="order_address" value="537fdl">-->
      <button class="submit" @click="submitOrder" id="submit">提交订单</button>
    </div>
    <div class="dialog-coupon" :style="couponshow?'display: block;':'display:none;'">
      <div class="c-box">
        <div class="mycoupon-title">优惠券</div>
        <coupon @selectedCoupon="selectedCoupon" :coupons="coupons"></coupon>
        <div @click.stop="couponHide" class="mycoupon-btn">
          关闭
        </div>
      </div>
      <div @click.stop="couponHide" class="close"></div>
    </div>

  </div>
</template>

<script>
  import api from '@/utils/api'
  import wx from 'wx'
  import util from '@/utils/util'
  import pay from '@/services/pay'
  import coupon from '@/components/coupon'

  export default {
    components: {
      coupon
    },
    data() {
      return {
        checkedGoodsList: [],
        data: {
          address: {
            id: 0,
            address_idcode: ''
          }
        },
        coupon_count: 0,
        coupons: [],
        coupons_id: 0,
        promotion_coupon_price: 0,
        selected_coupons: 0,
        checkedCoupon: [],
        couponList: [],
        couponshow: false,
        couponPrice: 0,
        orderRemarks: ''
      }
    },
    onShow() {
      wx.hideShareMenu()
      this.getCheckoutInfo({
        address: this.$store.state.address
      })
    },
    methods: {
      couponHide() {
        this.couponshow = false
      },
      couponShow() {
        if (!this.data.address.id) {
          util.showToast('请先去添加地址！')
          return
        }
        this.couponshow = true
      },
      selectedCoupon(couponId) {
        this.getCheckoutInfo({
          coupons: couponId,
          address: this.$store.state.address
        })
        this.couponshow = false
      },
      // 获取订单信息
      async getCheckoutInfo(obj = {}) {
        util.showLoading()
        const res = await api.CartCheckout(obj)
        util.hideLoading()
        // console.log('订单详情,请求结果', res);
        if (res.code === 0) {
          this.data = res.data.data
          if (this.data.address.address_idcode) {
            this.$store.commit('updateAddress', this.data.address.address_idcode)
          }
          this.coupon_count = res.data.coupon_count
          this.coupons = res.data.coupons
          this.coupons_id = res.data.coupons_id
          this.promotion_coupon_price = res.data.promotion_coupon_price
          this.selected_coupons = res.data.selected_coupons
          this.couponPrice = (parseFloat(this.data.promotion_goods_price) + parseFloat(this.data.promotion_order_price) + parseFloat(this.data.promotion_coupon_price)).toFixed(2)
        }
      },
      // 点击“去付款”
      async submitOrder() {
        if (!this.data.address.id) {
          util.showErrorToast('请选择收货地址');
          return false;
        }
        util.showLoading()
        // 请求后台，更新数据库的order表，清空购物车表等
        let parm = {
          address: this.data.address.address_idcode,
          coupons: this.promotion_coupon_price ? this.coupons_id : 'false',
          order_remarks: this.orderRemarks
        }
        if (this.$store.state.formChannel) {
          parm.from_channel = this.$store.state.formChannel
        }
        const res = await api.OrderSubmit(parm)
        util.hideLoading()
        // console.log('提交订单,请求结果', res);
        // 数据库操作成功，再调用wx的支付服务
        if (res.code === 0) {
          const paymentNo = res.data.payment_no
          pay.payOrder(paymentNo)
        } else {
          util.showToast(res.msg)
        }
      }
    }
  }
</script>
<style type="text/less" lang="less">
  @import '../../../static/css/base';

  page {
    background: @content-back;
  }

  #confirm-order {
    position: fixed;
    width: 100%;
    height: 100%;
    border-top: .5px solid @border_color_c;
    .confirm-order-content {
      position: absolute;
      top: 0;
      border-top: .5px solid @border_color_c;
      bottom: 50px;
      width: 100%;
      .confirm-order {
        color: @base_font_color;
        font-size: @font_size_28;
        .i_ar_h_right {
          color: #1b1b1d;
          background: url(https://yxds.999d.com/static/m/image/i_ar_h_right.png) no-repeat right center;
          background-size: 25px 25px;
          display: block;
        }
        .orderaddr {
          margin-top: 7.5px;
          .no-addr {
            background: #fff url(https://staticds.999d.com/static/m/image/ic_borderImg.png) repeat-x center bottom;
            background-size: auto 6px;
            padding: 20px 10px 20px 20px;
            border-bottom: .5px @border_color_c solid;
            position: relative;
            margin-bottom: 7.5px;
            p {
              padding: 0 0 0 30px;
              line-height: 30px;
              font-size: @font_size_28;
              background: url(https://staticds.999d.com/static/m/image/i_location.png) no-repeat left top;
              background-size: 30px auto;
            }
          }
          .addr {
            background: #fff url(https://staticds.999d.com/static/m/image/ic_borderImg.png) repeat-x center bottom;
            background-size: auto 6px;
            padding: 20px 40px 20px 20px;
            border-bottom: .5px @border_color_c solid;
            position: relative;
            margin-bottom: 7.5px;
            h3 {
              height: 30px;
              line-height: 30px;
              font-size: @font_size_30;
              font-weight: normal;
            }
            .name {
              float: left;
            }
            .mob {
              float: right;
            }
            p {
              padding: 0 0 0 30px;
              line-height: 30px;
              font-size: @font_size_28;
              background: url(https://staticds.999d.com/static/m/image/i_location.png) no-repeat left top;
              background-size: 30px auto;
            }
            .i_ar_h_right {
              width: 25px;
              height: 25px;
              background-size: 25px 25px;
              margin-top: -13px;
              position: absolute;
              top: 50%;
              right: 10px;
              display: block;
            }
          }
        }
        .orderpay {
          margin-bottom: 7.5px;
          .i_ar_h_right {
            color: #1b1b1d;
            padding: 0 25px 0 0;
            background: url(https://yxds.999d.com/static/m/image/i_ar_h_right.png) no-repeat right center;
            background-size: 25px 25px;
            display: inline-block;
          }
          .i_selected {
            width: 22px;
            height: 22px;
            background: url(https://staticds.999d.com/static/m/image/ic_select_a.png) no-repeat right center;
            background-size: 100% 100%;
            display: inline-block;
            vertical-align: top;
          }
          .i_pay_wx {
            padding: 0 0 0 40px;
            background: url(https://staticds.999d.com/static/m/image/i_pay_wx.png) no-repeat left center;
            background-size: 30px 30px;
          }
          .i_shiped {
            padding: 0 0 0 40px;
            background: url(https://staticds.999d.com/static/m/image/i_shiped.png) no-repeat left center;
            background-size: 30px 30px;
          }
          .i_coupon {
            padding: 0 0 0 40px;
            background: url(https://staticds.999d.com/static/m/image/i_coupon.png) no-repeat left center;
            background-size: 30px 30px;
          }
          .item {
            background: @white;
            display: flex;
            line-height: 20px;
            padding: 15px 10px 15px 15px;
            border-bottom: .5px @border_color_c solid;
            .i-l {
              flex: 1;
            }
            &:after {
              content: "";
              display: block;
              clear: both;
              height: 0;
            }
          }
        }
        .orderdetail {
          background: @white;
          margin-bottom: 7.5px;
          padding-bottom: 10px;
          border-bottom: .5px @border_color_c solid;
          .o-title {
            width: 100%;
            padding: 10px 15px;
            border-bottom: .5px solid @border_color_c;
            font-size: @font_size_30;
          }
          ul {
            .list {
              padding: 15px 20px;
              border-bottom: .5px solid @border_color_c;
              display: flex;
              color: @base_font_color;
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
              }

            }
          }
          .o-bottom {
            height: 36px;
            text-align: right;
            font-size: @font_size_28;
            padding: 0 15px;
            border-bottom: .5px solid @border_color_c;
            .price {
              line-height: 36px;
              color: @aider_color2;
              font-size: @font_size_30;
              font-weight: bold;
              .s-price {
                font-size: @font_size_24;
              }
            }
          }
          .ordermsg {
            padding: 0 10px;
            .input_ordermsg {
              color: #8a8c8f;
              width: 100%;
              height: 30px;
              padding: 0 20px;
              line-height: 20px;
              border: 0;
              border-radius: 5px;
              background: #f0f2f5;
              box-sizing: border-box;
              margin-top: 5px;
            }
          }
        }
        .orderinfo {
          background: @white;
          .i-box {
            padding: 7.5px 15px;
            font-size: @font_size_28;
            color: @base_font_color;
            border-bottom: .5px solid @border_color_c;
            .item {
              display: flex;
              line-height: 25px;
              .i-l {
                flex: 1;
              }
              .i-r {
                width: 150px;
                position: relative;
                text-align: right;
              }
            }
          }
          .i-bottom {
            padding: 15px 10px;
            font-size: @font_size_35;
            color: @aider_color2;
            text-align: right;
            border-bottom: .5px solid @border_color_c;
            margin-bottom: 20px;
            .s-price {
              font-size: @font_size_26;
            }
          }
        }
        .zhanwei {
          height: 20px;
          width: 100%;
        }
      }
    }
    .confirm-order-footer {
      position: absolute;
      bottom: 0;
      height: 50px;
      left: 0;
      background: @white;
      overflow: hidden;
      width: 100%;
      display: flex;
      .btn-total {
        flex: 1;
        padding-right: 15px;
        .price {
          text-align: right;
          font-size: @font_size_35;
          color: @aider_color2;
          margin-top: 5px;
          .s-price {
            font-size: @font_size_28;
          }
        }
        .express {
          text-align: right;
          font-size: @font_size_28;
          color: @base_font_color;
        }
      }
      .submit {
        width: 130px;
        border: none;
        background: @base_color;
        border-radius: 0;
        color: #fff;
        height: 100%;
        line-height: 50px;
        padding: 0;
        margin: 0;
        text-align: center;
      }
    }
    .dialog-coupon {
      display: none;
      .mycoupon-title {
        text-align: center;
        font-size: @font_size_35;
        padding: 20px 0;
      }
      .mycoupon-btn {
        text-align: center;
        font-size: 16px;
        color: #fff;
        background-color: #d6004f;
        height: 50px;
        line-height: 50px;
      }
      .close {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.4);
        z-index: 9;
      }
      .c-box {
        position: fixed;
        background: @white;
        bottom: 0;
        width: 100%;
        z-index: 10;
      }
    }
  }

  .tips-footer {
    width: 100%;
    background: #fff0e9;
    padding: 5px 10px;
    box-sizing: border-box;
    border-top: .5px solid @border_color_c;
    position: fixed;
    left: 0;
    bottom: 50px;
    font-size: @font_size_28;
  }
</style>
