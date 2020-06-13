<template>
  <div class="container">
    <div class="con-txt">
      <span class="f-a">未结算收入：</span><br>
      买家购买了小店的商品后，商品对应的利润将计入“未结算收入”。
      <br><br>
      <span class="f-a">已结算收入：</span><br>
      用户确认收货后，待商品超过7天售后期（部分商品除外），该笔订单对应的“未结算收入”会计入小店的“已结算收入” 和 “可提现金额”。已结算收入会持续累加，既为您累计的所有已结算收入。
      <br><br>
      <span class="f-a">系统自动确认收货：</span><br>
      供货商发货后7天订单将变为“已收货”状态。
      <br><br>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
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
