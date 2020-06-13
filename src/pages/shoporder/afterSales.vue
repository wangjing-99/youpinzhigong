<template>
  <view class="container">
    <div class="order-after">

      <div v-if="data.length>0">
        <div class="item" v-for="(itm,index) in data" :key="index">
          <div class="item-h">
            订单编号：{{itm.order_no}}
          </div>
          <div class="item-info" @click="goGoods(itm.item.idcode,itm.item.shop_idcode)">
            <img :src="itm.item.img[0]" alt="">
            <div class="item-txt">
              <p class="name owt">{{itm.item.product_name}}</p>
              <p class="spec">{{itm.item.color_name}}{{itm.item.size}}</p>
              <p class="num">x{{itm.item.num}}</p>
              <p class="price">￥{{itm.item.price}}</p>
            </div>
          </div>
          <div class="item-statu">
            <p>{{itm.status_str}}</p><!--退款状态-->
            <navigator v-if="itm.type==3" :url="'/pages/shoporder/refundInfo?service_id='+itm.item.service_id">查看详情</navigator>
            <navigator v-if="itm.type==1" :url="'/pages/shoporder/returnInfo?service_id='+itm.item.service_id">查看详情</navigator>
          </div>
        </div>
      </div>

      <div class="myorder-null" v-else>
        <img src="/static/images/my/ib_order.png" alt="">
        <p>亲！您没有售后单哦！</p>
      </div>
    </div>
  </view>
</template>
<script>
  import util from '@/utils/util'
  import api from '@/utils/api'

  export default {
    data() {
      return {
        data: [{
          order_no: '',
          item: {
            img: ['https://staticds.999d.com/static/m/image/default_goods.png'],
            code: '',
            name: '',
            color_name: '',
            size: '',
            num: '',
            price: ''
          }
        }],
        page: 1,
        moreStutas: false
      }
    },
    async mounted() {
      this.orderId = this.$route.query.no ? this.$route.query.no : 0;
      this.getShopAfterSales();
    },
    methods: {
      async getShopAfterSales() {
        if (this.moreStutas) {
          util.showToast('没有更多了~')
          return
        }
        util.showLoading()
        const res = await api.getShopAfterSales({
          page: this.page
        })
        util.hideLoading()
        if (res.code === 0) {
          if (this.page > 1) {
            if (res.data.length === 0) {
              util.showToast('没有更多了~')
              this.moreStutas = true
              return
            }
            this.data = this.data.concat(res.data)
          } else {
            this.data = res.data
          }
        } else {
          util.showToast(res.msg)
        }
      },
      goGoods(code) {
        if (code) {
          util.navigate('/pages/goods/goods?id=' + code)
        } else {
          util.showToast('没有code_id')
        }
      }
    },
    async onReachBottom() {
      this.page++
      await this.getShopAfterSales()
    },
    onUnload() {
      this.data = [{
        order_no: 'e',
        item: {
          img: ['https://staticds.999d.com/static/m/image/default_goods.png'],
          code: '',
          name: '',
          color_name: '',
          size: '',
          num: '',
          price: ''
        }
      }]
      this.page = 1
      this.moreStutas = false
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../static/css/base";

  page {
    background: #f4f4f4;
    min-height: 100%;
  }

  .container {
    background: #f4f4f4;
    min-height: 100%;
    padding-top: 10px;
  }

  .order-after {
    width: 100%;
    .item {
      background: @white;
      margin-bottom: 10px;
      .item-h {
        height: 40px;
        padding-left: 20px;
        line-height: 40px;
        font-size: @font_size_28;
        color: @base_font_color;
        border-bottom: 0.5px solid #ededed;
      }
      .item-info {
        padding: 20px;
        img {
          width: 100px;
          height: 100px;
          margin-right: 10px;
        }
        .item-txt {
          display: inline-block;
          width: 220px;
          .name {
            color: @base_font_color;
            font-size: 16px;
            line-height: 30px;
            height: 30px;
          }
          .spec {
            font-size: @font_size_28;
            color: #8a8c8f;
          }
          .num {
            font-size: @font_size_28;
            color: #8a8c8f;
            text-align: right;
          }
          .price {
            color: #f23030;
            font-size: 16px;
          }
        }
      }
      .item-statu {
        border-top: 0.5px solid #ededed;
        height: 40px;
        padding: 10px 20px;
        p {
          color: #8a8c8f;
          font-size: @font_size_28;
          line-height: 20px;
        }
        navigator {
          float: right;
          width: 70px;
          height: 20px;
          padding: 2px 3px;
          text-align: center;
          border-radius: 5px;
          font-size: @font_size_28;
          color: @base_font_color;
          border: 0.5px solid #cbcbcb;
        }
      }
    }
  }

  .myorder-null {
    text-align: center;
    margin-top: 100px;
    img {
      width: 96px;
      height: 96px;
      display: block;
      margin: 30px auto 20px;
    }
    h2 {
      font-size: 14px;
      color: #8a8c8f;
    }

  }
</style>
