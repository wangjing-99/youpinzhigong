<template>
  <div class="container">
    <view class="viewport">
      <view class="item">
        <view class="item-left">真实姓名：</view>
        <view class="item-right">
          <view class="r-l t-a-l"><input type="text" placeholder="请输入您的真实姓名" v-model="bankRealName"></view>
          <view class="i-right"></view>
        </view>
      </view>
      <view class="item">
        <view class="item-left">身份证号：</view>
        <view class="item-right">
          <view class="r-l t-a-l"><input type="text" placeholder="请输入您的真实身份证号" v-model="idCard"></view>
          <view class="i-right"></view>
        </view>
      </view>
    </view>
    <view class="viewport">
      <view class="item">
        <view class="item-left">银行卡卡号：</view>
        <view class="item-right">
          <view class="r-l t-a-l"><input @blur="verifyCard" type="text" placeholder="银行卡信息需和持卡人一致" v-model="bankCardNumber"></view>
          <view class="i-right"></view>
        </view>
      </view>
      <view class="item">
        <view class="item-left">开户银行：</view>
        <view class="item-right">
          <view class="r-l t-a-l"><input type="text" placeholder="开户银行" v-model="bankName"></view>
          <view class="i-right"></view>
        </view>
      </view>
    </view>
    <view v-if="disabled" class="submit-btn disabled">
      完成
    </view>
    <view v-else @click="submit" class="submit-btn">
      完成
    </view>

    <view class="withdraw-mes">
      <p class="bg1b">*注意事项</p>
      <p>1.请输入正确银行卡卡号，如果卡号输错，会导致提现失败；</p>
      <p>2.请确保输入的身份证号和银行卡号有对应绑定关系，如果不一致，会导致提现失败；</p>
      <p>3.请确保手机号为银行卡的银行预留手机号，如果不一致，会导致提现失败。</p>
    </view>


  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        bankRealName: '',
        idCard: '',
        bankCardNumber: '',
        bankName: '',
        disabled: true
      }
    },
    mounted() {
    },
    methods: {
      async verifyCard() {
        if (/\d{10,18}/.test(this.bankCardNumber) === false) {
          return false
        }
        const res = await api.querybankcard({
          bank_card_number: this.bankCardNumber
        })
        if (res.code === 0) {
          this.bankName = res.data.bank_name
          this.disabled = false
        } else {
          util.showToast('卡号不支持')
        }
      },
      async submit() {
        if (this.bankName.length < 1) {
          util.showToast('请选择银行！')
          return false
        }
        if (this.bankCardNumber === '') {
          util.showToast('银行卡账号不能为空！')
          return false
        }
        if (this.bankRealName === '') {
          util.showToast('姓名不能为空！')
          return false
        }
        if (this.idCard === '') {
          util.showToast('身份证不能为空！')
          return false
        }
        this.disabled = true
        util.showLoading('提交中...')
        const res = await api.setBankcard({
          'bank_name': this.bankName,
          'bank_card_number': this.bankCardNumber,
          'bank_real_name': this.bankRealName,
          'id_card': this.idCard
        })
        util.hideLoading()
        if (res.code === 0) {
          util.goBack()
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
    .bg1b {
      display: inline-block;
      color: @base_font_color;
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
    &.disabled {
      background-color: #ccc;
    }
  }
</style>
