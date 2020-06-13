<template>
  <div class="container">
    <div class="con-txt">
      <p><span class="f-a">每个月可以提现几次？</span><br>
        每个月可提现2次。<br><br>
      </p>
      <p><span class="f-a">佣金什么时间可以提现？</span><br>
        每月的10号和25号为提现日（请在提现日当天申请）<br><br>
      </p>
      <p><span class="f-a">佣金什么时候到账？</span><br>
        10号申请提现，佣金奖励将在7个工作日左右到账<br>
        25号申请提现，佣金奖励将在7个工作日左右到账<br>
        如遇节假日，佣金奖励到账时间顺延。<br>
        例：9月25日申请提现，10月1日-7日为国庆节，则预计到账时间为10月9日。<br><br>
      </p>
      <p><span class="f-a">提现条件：</span><br>
        可提现余额超过10元时，可申请提现至银行卡账户。<br><br>
      </p>
      <p><span class="f-a">如何提现：</span><br>
        首先绑定一张自己实名的银行卡，申请提现成功后，将会在7个工作日左右转账到您绑定的银行卡里。<br><br>
      </p>
      <p><span class="f-a">如果遇到提现问题怎么办？</span><br>
        提现过程中遇到问题，请在【个人中心】联系99严选在【在线客服】处理。<br><br>
      </p>
    </div>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        explainData: []
      }
    },
    mounted() {
      // this.getExplainData()
    },
    methods: {
      async getExplainData() {
        util.showLoading()
        const res = await api.withdrawExplain()
        util.hideLoading()
        if (res.code === 0) {
          this.explainData = res.data.data
        } else {
          util.showToast(res.msg)
        }
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import "../../../static/css/base";

  .con-txt {
    text-align: left;
    padding: 20px;
    margin-top: 10px;
    line-height: 1.8;
    background: #fff;
    font-size: @font_size_30;
    color: @base_font_color;
    .f-a {
      color: @base_color;
      display: inline-block;
      margin-top: 10px;
    }
  }
</style>
