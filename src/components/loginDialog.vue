<template>
  <view class="dialog-container">
    <form @submit="bindPhone" bindreset="formReset">
      <div class="form">
        <h2 class="h2">为保证账号安全，请验证手机号码</h2>
        <div class="form-item">
          <div class="i-c">
            <input placeholder="请输入手机号" name="mobile" v-model="mobile" class="i-input" type="text">
          </div>
        </div>
        <div class="form-item">
          <div class="i-c i-c-min">
            <input type="text" name="code" v-model="code" placeholder="请输入短信验证码">
          </div>
          <div v-if="!status" @click="getCode" class="i-r">获取验证码</div>
          <div v-else class="i-r">{{time}}s</div>
        </div>
        <button formType="submit" class="confirm form_button">确定</button>
        <!--<p class="line">—— 或 ——</p>-->
        <!--<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="weixin_login form_button">微信用户快速登录-->
        <!--</button>-->
      </div>
    </form>
  </view>
</template>

<script type="text/ecmascript-6">
  import wx from 'wx'
  import util from '@/utils/util'
  import api from '@/utils/api'
  import user from '@/services/user';

  export default {
    data() {
      return {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        mobile: '',
        code: '',
        status: 0,
        time: 60
      }
    },
    mounted() {
    },
    methods: {
      async getCode(e) {
        if (!this.checkMobile()) return
        const res = await api.getPhoneNumber({
          mobile: this.mobile,
          smstype: 'login'
        })
        console.log(res);
        let timer = null
        this.status = 1
        clearInterval(timer)
        timer = setInterval(() => {
          if (this.time <= 0) {
            clearInterval(timer)
            this.status = 0
            this.time = 60
          }
          this.time--
        }, 1000)
      },
      checkMobile() {
        if (this.mobile === '') {
          util.showErrorToast('手机号不能为空！')
          return false
        } else if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.mobile)) {
          util.showErrorToast('手机号输入错误！')
          return false
        }
        return true
      },
      checkCode() {
        if (this.code === '') {
          util.showErrorToast('验证码不能为空！')
          return false
        }
        return true
      },
      async bindPhone(e) {
        if (!this.checkMobile()) return
        if (!this.checkCode()) return
        const mobile = e.target.value.mobile
        const code = e.target.value.code
        util.showLoading()
        const res = await api.bindPhone({
          mobile: mobile,
          code: code
        })
        util.hideLoading()
        if (res.code === 0) {
          wx.setStorageSync('userInfo', res.data)
          if (res.data.shop_id) {
            user.setUserShop(res.data.shop_id)
          }
          this.$emit('closeLoginDialog')
        } else {
          util.showToast(res.msg)
        }
      },
      async getPhoneNumber(e) {
        if (!e.target.iv && !e.target.encryptedData) return
        util.showLoading()
        const res = await api.bindPhone({
          iv: e.target.iv,
          code: e.target.encryptedData
        })
        util.hideLoading()
        if (res.code === 0) {
          wx.setStorageSync('uid', res.data.id)
          this.$emit('closeLoginDialog')
        } else {
          util.showToast(res.msg)
        }
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../static/css/base";

  .dialog-container {
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.8);
    width: 100%;
    height: 100%;
    .form {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: auto;
      height: 237.5px;
      width: 285px;
      color: @base_font_color;
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      .h2 {
        font-size: @font_size_35;
        text-align: center;
        margin: 20px 0 20px 0;
      }
      .form-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: @font_size_30;
        width: 100%;
        box-sizing: border-box;
        margin-top: 10px;
        .i-l {
        }
        .i-c {
          display: flex;
          align-items: center;
          border-radius: 21px;
          box-sizing: border-box;
          width: 100%;
          border: 1px solid @border_color_c;
          padding: 0 15px;
          background: #eeeeee;
          height: 42px;
          &.i-c-min {
            width: 190px;
          }
          .i-input {
            flex: 1;
            /*padding-left: 20px;*/
          }
        }
        .i-r {
          width: 85px;
          text-align: center;
          height: 42px;
          line-height: 42px;
          color: #fff;
          background: @base_color;
          border-radius: 21px;
          font-size: @font_size_26;
        }
      }
    }
    .line {
      text-align: center;
      color: @aider_font_color;
      font-size: @font_size_28;
      line-height: 36px;
    }
    .confirm {
      margin: 20px auto 0;
      display: block;
      line-height: 42px;
      border: 1px solid @base_color;
      border-radius: 21px;
      box-sizing: border-box;
      text-align: center;
      color: @base_color;
      font-size: @font_size_35;
    }
    .weixin_login {
      display: block;
      line-height: 42px;
      border-radius: 21px;
      background: #24c12a;
      text-align: center;
      color: #fff;
      font-size: @font_size_35;
    }

  }


</style>
