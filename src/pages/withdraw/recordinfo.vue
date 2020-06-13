<template>
  <div class="container">
    <view class="withdraw-log">
      <a href="/pages/withdraw/explain">提现说明</a>
    </view>
    <view class="viewport">
      <view class="item">
        <view class="item-left">提现金额</view>
        <view class="item-right">
          <view class="r-l red">￥20.60</view>
        </view>
      </view>
      <view class="item no-online">
        <view class="item-left">
          <view>提现方式</view>
          <view>提现账户</view>
        </view>
        <view class="item-right">
          <view class="r-l">
            <view>银行卡</view>
            <view>{{extractinfo.bank_real_name}} {{extractinfo.bank_account}}</view>
          </view>
        </view>
      </view>
      <view class="item no-online">
        <view class="item-left">
          <view>当前状态</view>
          <view>审核中</view>
          <view>申请人</view>
          <view>提现单号</view>
        </view>
        <view class="item-right">
          <view class="r-l">
            <view>{{extractinfo.approve_status}}</view>
            <view>{{extractinfo.created_at}}</view>
            <view>{{extractinfo.user_mobile}}</view>
            <view>{{extractinfo.extract_order}}</view>
          </view>
        </view>
      </view>
    </view>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        extractinfo: {
          extract_price: '99',
          bank_real_name: '招商银行',
          bank_account: '628120903409009',
          created_at: '20189823',
          user_mobile: '17600231238',
          extract_order: '6341298122112',
          approve_status: '通过'
        }
      }
    },
    mounted() {
      this.withdrawRecordInfo()
    },
    methods: {
      async withdrawRecordInfo() {
        util.showLoading()
        const res = await api.withdrawRecordInfo({
          id: this.$route.query.id
        })
        util.hideLoading()
        if (res.code === 0) {
          this.extractinfo = res.data
        } else {
          util.showToast(res.msg)
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
      &.no-online {
        padding: 10px 10px 10px 15px;
        height: auto;
        .item-left, .item-right {
          line-height: 25px;
        }
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
