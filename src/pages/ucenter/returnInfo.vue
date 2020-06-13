<template>
  <view class="container">
    <div class="orderDetail">
      <div class="status">
        <div class="status-waiting" v-if="data.info.examined_status == 0">
          <div class="title">
            <img src="https://yxds.999d.com/static/m/image/i_waiting.png">
            <h3>请等待商家处理</h3>
          </div>
        </div>
        <div class="status-waiting" v-else-if="data.info.examined_status == 2">
          <div class="title">
            <img src="https://yxds.999d.com/static/m/image/i_waiting.png">
            <h3>商家已拒绝，您需要及时处理</h3>
          </div>
          <div class="txt"> 拒绝原因：{{data.info.note}}</div>
        </div>
        <view v-else>
          <div class="status-waiting" v-if="data.info.status == 1">
            <div class="title">
              <img src="https://yxds.999d.com/static/m/image/i_waiting.png">
              <h3>已审核通过待归还商品</h3>
            </div>
          </div>
          <div class="status-waiting" v-else-if="data.info.status == 2">
            <div class="title">
              <img src="https://yxds.999d.com/static/m/image/i_waiting.png">
              <h3>商品已归还等待退款</h3>
            </div>
          </div>

          <div class="status-success" v-else-if="data.info.status == 3">
            <div class="title">
              <icon type="success" size="40" color="#1d96d7"></icon>
              <h3>退款成功</h3>
            </div>
          </div>
          <div class="status-success" v-else-if="data.info.status == 4">
            <div class="title">
              <icon type="success" size="40" color="#1d96d7"></icon>
              <h3>退款成功</h3>
            </div>
          </div>
          <div class="status-waiting" v-else>
            <div class="title">
              <img src="https://yxds.999d.com/static/m/image/i_waiting.png">
              <h3>已审核通过待归还商品</h3>
            </div>
          </div>
        </view>
        <div class="status-info">
          <p> 1.商家同意或者超时未处理，系统将退款给您<br>
            2.如果商家拒绝，您可以修改退款申请后再次发起，商家会重新处理 </p>
          <button open-type="contact" class="orderservice">联系客服</button>
        </div>
      </div>
      <block v-if="data.info.examined_status==1 && data.supplier.return_phone">
        <div class="addr">
          <h2>退款地址</h2>
          <h3>
            <span class="name">收货人：{{data.supplier.return_linkman}}</span>
            <span class="mob">{{data.supplier.return_phone}}</span>
          </h3>
          <p>{{data.supplier.return_address}}</p>
        </div>
        <view v-if="data.info.status==1" @click="dialogLogisticsShow" class="item">
          <view class="item-left">退货物流</view>
          <view class="item-right">
            <view class="r-l">
              {{data.info.express_company}}{{data.info.express_num}}
            </view>
            <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
          </view>
        </view>
        <view v-else class="item">
          <view class="item-left">退货物流</view>
          <view class="item-right">
            <view class="r-l">
              {{data.info.express_company}}{{data.info.express_num}}
            </view>
            <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
          </view>
        </view>
      </block>
      <view class="order-detail">
        <view class="order-h">
          <view class="shop-name">
            退款信息
          </view>
        </view>

        <view class="goods-item" @click="goGoods(data.item.idcode,data.item.shop_idcode)">
          <img :src="data.product.img[0]" class="goods-img"/>
          <view class="goods-info">
            <view class="goods-name owt">{{data.item.product_name}}</view>
            <view class="goods-spac">
              <view class="owt">{{data.item.color_name}},{{data.item.size}}</view>
              <view>
                <text class="goods-price">￥{{data.product.price}}</text>
                <view class="goods-num">x {{data.item.num}}</view>
              </view>
            </view>
          </view>
        </view>

        <div class="info">
          <p>退款原因：{{data.info.reason}}</p>
          <p>申请退款金额：￥{{data.info.back_money}}</p>
          <p>实际退款金额：￥{{data.info.real_back_money}}</p>
          <p>申请时间：{{data.info.created_at}}</p>
        </div>

      </view>
    </div>
    <button open-type="contact" class="orderservice">联系客服</button>

    <!--弹出选择物流的层  -->
    <!--<div :style="data.info.status==1 && data.info.express_num?'display:block':''" class="dialog-logistics">-->
    <view v-if="data.express" :style="dialog?'display:block':'display:none'" class="viewport">
      <view class="item">
        <view class="item-left">快递公司</view>
        <view class="item-right">
          <picker class="r-l" @change="expressChange" :value="index" :range-key="'name'" :range="data.express">
            <view class="picker">
              {{data.express[index]['name']}}
            </view>
            <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
          </picker>
        </view>
      </view>
      <view class="item">
        <view class="item-left">物流单号</view>
        <view class="item-right">
          <view class="r-l"><input type="text" v-model="expressNo" placeholder="请输入物流单号"/></view>
          <view class="i-right"></view>
        </view>
      </view>
      <button @click="saveExpressInfo" class="submit">提交申请</button>
    </view>
    <div :style="dialog?'display:block':'display:none'" class="close" @click.stop="dialogLogisticsHide"></div>

  </view>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        data: {
          info: {},
          item: {},
          product: {
            img: []
          }
        },
        index: 0,
        serviceId: '',
        expressNo: '',
        dialog: false
      }
    },
    mounted() {
      this.serviceId = this.$route.query.service_id;
      this.getdata();
    },
    methods: {
      expressChange(e) {
        this.index = e.target.value
      },
      dialogLogisticsShow() {
        this.dialog = true
      },
      dialogLogisticsHide() {
        this.dialog = false
      },
      async saveExpressInfo() {
        let companyCode = this.data.express[this.index]['xiaoyatong_code']
        util.showLoading()
        const res = await api.returnExpress({
          service_id: this.serviceId,
          company_code: companyCode,
          express_no: this.expressNo
        })
        util.hideLoading()
        if (res.code === 0) {
          util.showToast('提交成功')
          this.getdata()
        } else {
          util.showToast(res.msg)
        }
      },
      async getdata() {
        util.showLoading()
        const res = await api.returnInfo({
          service_id: this.serviceId
        })
        util.hideLoading()
        if (res.code === 0) {
          this.data = res.data
          if (this.data.info.status === '1' && !this.data.info.express_num) {
            this.dialog = true
          }
        }
      },
      goGoods(code, shopId) {
        if (code) {
          util.navigate('/pages/goods/goods?id=' + code + '&shop=' + shopId)
        } else {
          util.showToast('没有code_id')
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../static/css/base";

  page {
    background: #f4f4f4;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .container {
    width: 100%;
    background: #f4f4f4;
    .status {
      background: @white;
      border-bottom: 0.5px solid #ebebeb;
      margin-bottom: 10px;
      padding: 20px 0px;
      .status-success {
        box-sizing: border-box;
        icon {
          margin-right: 10px;
        }
        .success {
          display: inline-block;
          vertical-align: top;
          width: 280px;
          height: 40px;
          color: #2897d4;
          font-size: 20px;
          line-height: 40px;
        }
        color: #2897d4;
        padding: 15px 20px 0px;

        h3 {
          display: inline-block;
          vertical-align: top;
          line-height: 60px;
        }
        icon {
          margin-top: 8px;
        }
        .title {
          display: inline-block;
        }
      }
      .status-waiting {
        .title {
          img {
            width: 50px;
            height: 50px;
            margin: 0 20px;
            vertical-align: top;
          }
          h3 {
            display: inline-block;
            vertical-align: top;
            font-size: 20px;
            color: #f23030;
            font-weight: normal;
            line-height: 40px;
          }
        }
        .txt {
          line-height: 20px;
          padding: 10px 20px 10px 70px;
          border-top: 1px #ededed solid;
          margin: 10px 0px 0px 0px;
        }
      }

      .status-info {
        padding: 10px 20px;
        text-align: right;
        p {
          text-align: left;
          color: @aider_font_color;
          line-height: 1.5;
          font-size: 14px;
        }
        button {
          background: @white;
          border: 1px solid @border_color;
          border-radius: 5px;
          padding: 0px 20px;
          font-size: 14px;
          height: 20px;
          line-height: 20px;
          color: #1b1b1d;
          display: inline-block;
          text-align: center;
        }
      }
    }

    .info {
      padding: 10px 20px;
      line-height: 20px;
      border-bottom: 1px solid @border_color_c;
      p {
        font-size: @font_size_28;
        color: #8a8c8f;
        line-height: 1.5;
      }
    }
  }

  .order-detail {
    width: 100%;
    background: @white;
    margin-bottom: 10px;
    .order-h {
      height: 35px;
      border-bottom: 0.5px solid @border_color_c;
      padding: 0 15px;
      display: flex;
      justify-content: space-between;
      .shop-name {
        line-height: 35px;
        color: @base_font_color;
        font-size: @font_size_30;
      }
      .status {
        line-height: 35px;
        color: #d0264b;
        font-size: @font_size_28;
      }
    }
    .goods-item {
      padding: 15px 20px;
      border-bottom: 0.5px solid @border_color_c;
      .goods-img {
        width: 70px;
        height: 70px;
      }
      .goods-info {
        float: right;
        width: 250px;
        .goods-name {
          font-size: @font_size_30;
          color: @base_font_color;
        }
        .goods-spac {
          font-size: @font_size_28;
          color: @aider_font_color;
          margin-top: 8px;
          .goods-num {
            font-size: @font_size_28;
            color: @base_font_color;
            float: right;
          }
          .goods-price {
            font-size: @font_size_30;
            color: @base_font_color;
          }
        }
      }
    }
  }
  .close {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.4);
    z-index: 10000;
  }
  .viewport {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10001;
    width: 100%;
    margin-top: 8px;
    background: @white;
    .title{
      font-size: @font_size_35;
      line-height: 50px;
      padding-left: 15px;
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
        width: 90px;
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
    .submit{
      width: 90%;
      height: 50px;
      line-height: 50px;
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: @font_size_30;
      color: @white;
      background: @aider_color1;
    }
  }

  .orderDetail {
    .addr {
      background: #fff;
      padding: 15px;
      border-bottom: .5px @border_color_c solid;
      margin-bottom: 10px;
      color: @base_font_color;
      h2 {
        height: 20px;
        line-height: 20px;
        padding: 0px 0px 10px 0px;
        margin-bottom: 10px;
        font-size: @font_size_30;
        font-weight: normal;
        border-bottom: .5px @border_color_c solid;
      }
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
        padding: 0px 0px 0px 30px;
        line-height: 30px;
        font-size: @font_size_28;
        background: url(https://yxds.999d.com/static/m/image/i_location.png) no-repeat left top;
        background-size: 30px auto;
      }
    }
    .item {
      height: 50px;
      padding: 0 10px 0 15px;
      border-bottom: .5px solid @border_color_c;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #fff;
      margin-bottom: 10px;
      .item-left {
        display: inline-block;
        font-size: @font_size_28;
        color: @base_font_color;
        line-height: 50px;
        margin: auto;
        width: 80px;
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

  .dialog-logistics {
    width: 100%;
    background: #fff;
  }


  .status-info .orderservice {
    width: auto;
  }

  .orderservice {
    width: 100%;
    height: 50px;
    line-height: 50px;
    background: @white;
    color: @button_color1;
    font-size: @font_size_28;
  }
</style>
