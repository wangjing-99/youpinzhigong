<template>
  <view class="container">
    <view class="info">
      <div class="orderTail">
        <div class="shipment-addr">
          <img src="/static/images/my/i_location.png" alt="">
          <span>【收货地址】{{orderInfo.province}} {{orderInfo.city}}{{orderInfo.area}}{{orderInfo.address}}</span>
        </div>
        <block v-if="!isEmpty">
          <div v-for="express in expressInfo" :key="index">
            <div class="shipment-info">
              <p><span>快递公司：</span> <span>{{express.express_name}}</span></p>
              <p><span>快递单号：</span> <span>{{express.express_no}}</span></p>
            </div>
            <div v-if="express.express && express.express.length>0" class="shipment-detail"
                 v-for="(item,idx) in express.express" :key="idx">
              <dl :class="idx===0?'current':''">
                <dt><span>{{item.time}}</span><i></i></dt>
                <dd>
                  <p>{{item.context}}</p>
                </dd>
              </dl>
            </div>
          </div>
        </block>
        <block v-else>
          <div class="empty">
            暂无没有物流信息
          </div>
        </block>
      </div>
    </view>
  </view>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        orderId: 1,
        expressInfo: {},
        isEmpty: true,
        orderInfo: {
          province: '',
          city: '',
          area: '',
          address: ''
        }
      }
    },
    async mounted() {
      this.orderId = this.$route.query.no
      await this.getExpressInfo()
    },
    methods: {
      // 获取物流信息
      async getExpressInfo() {
        util.showLoading();
        const res = await api.ExpressInfo({no: this.orderId})
        util.hideLoading();
        if (res.code === 0) {
          this.orderInfo = res.data.orderinfo
          this.expressInfo = res.data.expressinfo
          this.isEmpty = JSON.stringify(res.data.expressinfo) === '{}'
          // let that = this
          // Object.keys(res.data.expressinfo).forEach(function (key) {
          //  that.expressInfo = res.data.expressinfo[key]
          //  console.log(Object.keys(this.expressInfo).length)
          // })
        } else {
          util.showToast(res.msg)
        }
      },
      updateExpress() {
        this.getExpressInfo();
      }
    },
    onUnload() {
      this.orderInfo = {
        province: '',
        city: '',
        area: '',
        address: ''
      }
      this.expressInfo = {}
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../static/css/base";

  page {
    height: 100%;
    width: 100%;
  }
  .empty{
    width: 100%;
    text-align: center;
    padding: 50px 0;
    background: #fff;
    font-size: @font_size_30;
    color: @aider_font_color;
  }
  .container {
    background: @content-back;
    .info {
      width: 100%;
    }
    .orderTail {
      width: 100%;
      margin-top: 10px;
      background: @white;
      image {
        width: 30px;
        height: 30px;
        vertical-align: top;
      }
      .shipment-addr {
        padding: 20px;
        line-height: 20px;
        font-size: 14px;
        background-size: 30px auto;
        border-bottom: 1px #ededed dashed;
      }
      .shipment-info {
        padding: 20px;
        line-height: 22px;
        font-size: 16px;
        color: #1b1b1d;
      }
      .shipment-detail {
        padding: 20px;
        font-size: 14px;
        dt {
          width: 60px;
          padding: 0px 20px 0px 0px;
          text-align: right;
          float: left;
          position: relative;
          font-size: 14px;
          line-height: 16px;
        }
        dd {
          margin-left: 80px;
          padding: 0px 0px 30px 20px;
          border-left: 1px #ededed solid;
          line-height: 16px;
        }
        dl {
          color: #8a8c8f;
        }
        .current {
          font-size: 16px;
          color: #2897d4;
          i {
            width: 20px;
            height: 20px;
            background: url(https://staticds.999d.com/static/m/image/i_dh.png) no-repeat center center #2897d4;
            background-size: 18px 18px;
            right: -10px;
            top: -3px;
            overflow: hidden;
            border: 0px;
            border-radius: 50px;
            display: inline-block;
            position: absolute;
          }
        }
        i {
          width: 16px;
          height: 16px;
          overflow: hidden;
          border: 0px;
          border-radius: 50px;
          background: url(https://staticds.999d.com/static/m/image/i_up.png) no-repeat center center #cbcbcb;
          background-size: 14px 14px;
          display: inline-block;
          position: absolute;
          right: -8px;
          top: -2px;
        }
      }
    }
  }


</style>
