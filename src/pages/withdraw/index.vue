<template>
  <div class="container">
    <view class="withdraw-log">
      <a href="/pages/withdraw/record">提现记录</a>
    </view>
    <view class="viewport">
      <view class="item">
        <view class="item-left">可提现金额</view>
        <view class="item-right">
          <view class="r-l t-a-l red">
            ￥{{infoShopBop.bop_total}}
          </view>
          <view class="i-right"></view>
        </view>
      </view>
      <view class="item">
        <view class="item-left">本次提现</view>
        <view class="item-right">
          <view class="r-l t-a-l"><input type="text" v-model="extractPrice" placeholder="单笔最高2万"></view>
          <view class="i-right"></view>
        </view>
      </view>
    </view>
    <view class="viewport">
      <view v-if="bankData.bank_name" class="item">
        <view class="item-left">提现账户</view>
        <view class="item-right">
          <view class="r-l">
            {{bankData.bank_name}} {{bankData.bank_card_number}}
          </view>
        </view>
      </view>
      <a hover-class="none" href="/pages/withdraw/setCard" v-else class="item">
        <view class="item-left">提现账户</view>
        <view class="item-right">
          <view class="r-l">
            立即设置
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </a>
    </view>
    <view class="withdraw-mes">
      <view>1.金额低于10元不能提现</view>
      <view>2.提现到账时间规则说明，<a href="/pages/withdraw/explain">点击查看</a></view>
      <view>3.提现时间为每月的10日与25日，请在规定日期内提现.</view>
    </view>
    <view v-if="isWithdrawDate" @click="withdraw" class="submit-btn">
      立即提现
    </view>
    <view v-else="" class="submit-btn no-submit">
      提现时间为每月的10日与25日
    </view>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        extractPrice: '',
        bankData: {
          bank_name: '',
          bank_card_number: ''
        },
        infoShopBop: {},
        bankName: '',
        availPrice: 0.00,
        datenum: [10, 25],
        isWithdrawDate: false
      }
    },
    onShow() {
      this.withdrawIndexInfo()
      const datetime = new Date()
      const nowtime = datetime.getDate()
      if (this.datenum.indexOf(nowtime) !== -1) {
        this.isWithdrawDate = true
      }
    },
    methods: {
      async withdrawIndexInfo() {
        util.showLoading('')
        const res = await api.withdrawIndexInfo()
        util.hideLoading()
        if (res.code === 0) {
          this.bankData = res.data.bank_data
          this.infoShopBop = res.data.info_shop_bop
          this.availPrice = res.data.info_shop_bop.bop_total
          this.bankName = res.data.bank_data.bank_name
        } else {
          util.showToast(res.msg)
        }
      },
      async withdraw() {
        if (!this.isWithdrawDate) return false
        if (this.bankName === '') {
          const confirm = await util.showModal('请设置提现账户？')
          if (confirm) {
            util.navigate('/pages/withdraw/setCard')
          }
          return false
        }
        if (!this.extractPrice) {
          util.showToast('请输入提现金额!')
          return false
        }
        if (this.extractPrice < 10) {
          util.showToast('金额低于10元不能提现!')
          this.extractPrice = ''
          return false;
        }
        if (parseFloat(this.extractPrice) > parseFloat(this.availPrice)) {
          util.showToast('本次提现金额不可大于可提现金额！')
          return false;
        }
        util.showLoading('提交中...')
        const res = await api.withdrawDoIndex({
          extract_price: parseFloat(this.extractPrice)
        })
        util.hideLoading()
        if (res.code === 0) {
          util.redirect('/pages/withdraw/record')
        } else {
          util.showToast(res.msg)
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
    }
  }

  .withdraw-mes {
    font-size: @font_size_28;
    color: @aider_font_color;
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    a {
      display: inline-block;
      color: @aider_color1;
      text-decoration: underline;
    }
  }

  .submit-btn {
    margin: 20px auto;
    width: 90%;
    box-sizing: border-box;
    height: 50px;
    line-height: 50px;
    display: inline-block;
    text-align: center;
    border: 0;
    border-radius: 5px;
    color: #fff;
    font-size: 16px;
    background: #2897d4;
    &.no-submit {
      background-color: rgb(146, 147, 150);
    }
  }
</style>
