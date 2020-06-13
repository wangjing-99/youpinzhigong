<template>
  <view class="container">
    <view class="withdraw-log">
      <a href="/pages/withdraw/explain">提现说明</a>
    </view>
    <view v-if="withdrawRecordData.length>0" class="list">
      <block v-for="item of withdrawRecordData" :key="index">
        <a :href="'/pages/withdraw/recordinfo?id='+ item.idcode" class="item">
          <view class="i-l">
            <view>提现至银行卡</view>
          </view>
          <view class="i-r">
            <view class="price">￥{{item.extract_price}}</view>
            <view class="stat">{{item.extract_title}}</view>
          </view>
        </a>
      </block>
    </view>
    <view v-else class="con-none">
      没有相关信息
    </view>
  </view>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        withdrawRecordData: [
          {
            extract_price: 999,
            extract_title: '提现成功',
            id: 1
          },
          {
            extract_price: 999,
            extract_title: '提现成功',
            id: 2
          },
          {
            extract_price: 999,
            extract_title: '提现成功',
            id: 3
          }
        ]
      }
    },
    mounted() {
      this.withdrawRecord()
    },
    methods: {
      async withdrawRecord() {
        util.showLoading()
        const res = await api.withdrawRecord()
        util.hideLoading()
        if (res.code === 0) {
          this.withdrawRecordData = res.data
        } else {
          util.showToast(res.msg)
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../static/css/base";

  .container {
    background: @content-back;
    width: 100%;
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

  .list {
    margin-top: 7.5px;
    width: 100%;
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 15px;
      background: #fff;
      border-bottom: .5px solid @border_color_c;
      font-size: @font_size_28;
      color: @base_color;
      .i-r {
        width: 80px;
        text-align: center;
        .price {
          color: @aider_color2;
        }
        .stat {
          color: @aider_font_color;
        }
      }
      .i-l {
        flex: 1;
        .date {
          color: @aider_font_color;
        }
      }
    }
  }

  .con-none {
    width: 100%;
    padding-top: 100px;
    text-align: center;
    font-size: @font_size_30;
    color: @aider_font_color;
  }


</style>
