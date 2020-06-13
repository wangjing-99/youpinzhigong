<template>
  <view class="container">
    <div class="form">
      <div class="form-item">
        <div class="i-l">手机号</div>
        <div class="i-c">
          <input class="i-input" type="text">
        </div>
        <div v-if="!status" @click="getCode" class="i-r">获取验证码</div>
        <div v-else  class="i-r">{{time}}s</div>
      </div>
      <div class="form-item">
        <div class="i-c">
          <input type="text" placeholder="请输入短信中的验证码">
        </div>
      </div>
      <button class="confirm form_button">确定</button>
    </div>
  </view>
</template>

<script type="text/ecmascript-6">
  import wx from 'wx'

  export default {
    data() {
      return {
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        code: null,
        status: 0,
        time: 60
      }
    },
    mounted() {
    },
    methods: {
      async getCode(e) {
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
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../../static/css/base";

  .container {
    background: @content-back;
  }

  .form {
    margin-top: 7.5px;
    width: 100%;
    color: @base_font_color;
  }

  .form-item {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 15px;
    font-size: @font_size_30;
    background: @white;
    width: 100%;
    box-sizing: border-box;
    border-bottom: .5px solid @border_color_c;
    height: 53px;
    .i-l {
    }
    .i-c {
      flex: 1;
      .i-input {
        padding-left: 20px;
      }
    }
    .i-r {
      width: 90px;
      border: 1px solid @border_color_c;
      text-align: center;
      line-height: 30px;
      border-radius: 5px;
      font-size: @font_size_28;
    }
  }

  .confirm {
    margin: 10px auto 0;
    width: 352px;
    display: block;
    line-height: 40px;
    background: @aider_color1;
    text-align: center;
    color: #fff;
    font-size: @font_size_35;
  }

</style>
