<template>
  <view class="container">
    <div class="mycoupon">
      <div class="mycoupon-inputbox">
        <input placeholder="请输入优惠码" @input="bindinputCoupon" :value="couponNum"  class="input_s"/>
        <a class="btn_ma" @click="CouponExchange()">兑换</a>
      </div>
      <div class="mycoupon-list">
        <div v-if="coupons.length>0" class="list">
          <block v-for="coupon of coupons" :key="index">
            <div v-if="coupon.status==2" class="mycoupon-list-expired statu">
              <div class="clearfix">
                <div class="mt">
                  <span class="price">
                    <b>￥</b>{{coupon.price}}
                  </span>
                  <span v-if="coupon.use_price" class="info">满{{coupon.use_price}}可用</span>
                </div>
                <div class="mc">
                  <h3>{{coupon.patch_name}}</h3>
                  <p v-if="coupon.time_type==1" class="time">{{coupon.start_time}}~{{coupon.end_time}}</p>
                  <p v-else class="time">不限时间</p>
                  <p class="more" @click="showInfo(coupon.id)">详情信息</p>
                </div>
              </div>
              <div class="con" v-show="coupon.id === showIndex">
                {{coupon.condition_desc}}
                {{coupon.note}}
              </div>
              <i class="i_t"></i>
              <i class="i_b"></i>
              <div class="stat"></div>
            </div>
            <div v-if="coupon.status==3" class="mycoupon-list-expired use">
              <div class="clearfix">
                <div class="mt">
            <span class="price">
              <b>￥</b>{{coupon.price}}
            </span>
                  <span v-if="coupon.use_price" class="info">满{{coupon.use_price}}可用</span>
                </div>
                <div class="mc">
                  <h3>{{coupon.patch_name}}</h3>
                  <p class="time">{{coupon.start_time}}~{{coupon.end_time}}</p>
                  <p class="more" @click="showInfo(coupon.id)">详情信息</p>
                </div>
              </div>
              <div class="con" v-show="coupon.id === showIndex">
                {{coupon.condition_desc}}
                {{coupon.note}}
              </div>
              <i class="i_t"></i>
              <i class="i_b"></i>
              <div class="stat">
                <img src="/static/images/my/ico_used.png" alt="">
              </div>
            </div>
            <div v-if="coupon.status==5" class="mycoupon-list-expired">
              <div class="clearfix">
                <div class="mt">
                  <span class="price">
                    <b>￥</b>{{coupon.price}}
                  </span>
                  <span v-if="coupon.use_price" class="info">满{{coupon.use_price}}可用</span>
                </div>
                <div class="mc">
                  <h3>{{coupon.patch_name}}</h3>
                  <p class="time">{{coupon.start_time}}~{{coupon.end_time}}</p>
                  <p class="more" @click="showInfo(coupon.id)">详情信息</p>
                </div>
              </div>
              <div class="con" v-show="coupon.id === showIndex">
                {{coupon.condition_desc}}
                {{coupon.note}}
              </div>
              <i class="i_t"></i>
              <i class="i_b"></i>
              <div class="stat">
                <img src="/static/images/my/ico_expired.png" alt="">
              </div>
            </div>
          </block>

        </div>
        <div v-else class="mycoupon-null">
          <img src="/static/images/my/ib_coupon.png" alt="">
          <h2>无可用优惠券</h2>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        isshow: false,
        coupons: [],
        showIndex: -1,
        couponNum: ''
      }
    },
    mounted() {
      this.getMyCoupon()
    },
    methods: {
      async getMyCoupon() {
        const res = await api.getMyCoupon()
        if (res.code === 0) {
          this.coupons = res.data.coupons
          console.log(res)
        } else {
          util.showToast(res.msg)
        }
      },
      showInfo: function (e) {
        this.showIndex = this.showIndex === e ? -1 : e;
      },
      bindinputCoupon: function (e) {
        let num = this.couponNum;
        num = e.target.value;
        this.couponNum = num;
      },
      async CouponExchange() {
        if (this.couponNum) {
          const res = await api.CouponExchange({
            is_ajax: 1,
            coupon_code: this.couponNum
          })
          if (res.code === 0) {
            util.showToast('兑换成功');
            this.couponNum = '';
            this.getMyCoupon();
          } else {
            util.showErrorToast(res.msg);
          }
        } else {
          util.showErrorToast('请输入您的优惠券码')
        }
      }
    }
  }
</script>

<style scoped lang="less">
  @import "../../../static/css/base";

  page {
    min-height: 100%;
  }

  .container {
    padding-top: 10px;
    background: @content-back;
  }

  .mycoupon {
    background: @white;
    padding: 20px 10px;
    width: 100%;
    box-sizing: border-box;

  .mycoupon-inputbox {
    height: 30px;
    position: relative;
    padding: 0px 0px 20px 0px;
    border-bottom: 0.5px dashed @border_color_c;
    margin-bottom: 10px;

  input {
    display: inline-block;
    width: 240px;
    background: #f0f2f5;
    padding: 3px 20px;
    font-size: 14px;
    vertical-align: top;
    margin-right: 5px;
    border-radius: 5px;
  }

  .btn_ma {
    background: #d6004f;
    border: 0px;
    border-radius: 5px;
    display: inline-block;
    padding: 0px 20px;
    font-size: 14px;
    height: 30px;
    line-height: 30px;
    color: #fff;
    text-align: center;
    vertical-align: top;
  }

  }

  .mycoupon-list {
    margin-bottom: 10px;
    color: #bbb;

  .mycoupon-list-expired {
    position: relative;
    padding-top: 15px;
    border-radius: 5px;
    margin-bottom: 10px;
    background: #f0f2f5;

  .mt {
    float: left;
    width: 100px;
    height: 80px;
    padding-top: 10px;
    box-sizing: border-box;
    text-align: center;
    font-size: @font_size_28;
    border-right: 0.5px dashed #ccc;
    margin-right: 20px;

  .price {
    font-size: 24px;

  b {
    display: inline-block;
    font-size: @font_size_28;
  }

  }
  .info {
    display: block;
  }

  }
  .mc {
    float: left;
    padding: 5px 0px 20px;
    width: 200px;

  h3 {
    font-size: @font_size_28;
  }

  .time {
    margin-top: 3px;
    font-size: 12px;
  }

  .more {
    padding-top: 5px;
    margin-top: 5px;
    border-top: 1px #ccc dashed;
    font-size: 12px;
  }

  }
  .con {
    padding: 0px 20px 20px 20px;
    font-size: 14px;
  }

  .i_t {
    width: 12px;
    height: 12px;
    position: absolute;
    left: 94px;
    top: -6px;
    background: @white;
    border-radius: 50%;
  }

  .i_b {
    width: 12px;
    height: 12px;
    position: absolute;
    left: 94px;
    bottom: -6px;
    background: @white;
    border-radius: 50%;
  }

  .stat {
    position: absolute;
    right: 10px;
    top: 10px;

  img {
    width: 80px;
    height: 80px;
  }

  }
  }
  .statu {
    background: #fff1f1;

  .mt {
    border-right: 0.5px dashed #fed0d0;

  span {
    color: #f23030;
  }

  }
  .mc {

  h3, .time, .more {
    color: #f23030;
  }

  .more {
    border-top: 0.5px dashed #fed0d0;
  }

  }
  .con {
    color: #f23030;
  }

  }
  .use {

    background: #fff1f1;

  .mt {
    border-right: 0.5px dashed #fed0d0;

  span {
    color: #cea5a5;
  }

  }
  .mc {

  h3, .time, .more {
    color: #cea5a5;
  }

  .more {
    border-top: 0.5px dashed #fed0d0;
  }

  }
  .con {
    color: #cea5a5;
  }

  }
  }
  .mycoupon-null {

  img {
    width: 96px;
    height: 96px;
    margin: 50px auto 20px;
    display: block;
  }

  h2 {
    font-size: 14px;
    color: #8a8c8f;
    text-align: center;
  }

  }
  }

  .clearfix:after {
    content: '';
    display: block;
    clear: both;
  }

</style>
