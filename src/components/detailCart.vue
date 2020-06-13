<template>
  <!--:style="isDialog?'display:block':'display:none'"-->
  <view :style="isDialog?'display:block':'display:none'" class="dialog">
    <view class="dialog-main">
      <view class="top">
        <img @click="previewImg" class="pic" :src="selectedItem.img" alt="">
        <view class="main">
          <view class="main-amount">¥ {{selectedSku.price? selectedSku.price :goodsInfo.price}}</view>
          <!--<view class="main-num">库存：{{goodsInfo.stocks}}</view>-->
          <view class="main-title">{{specMsg}}</view>
        </view>
        <image class="close" src="../../static/images/close-block.png" background-size="cover"
               @click="tapCloseDialog"></image>
      </view>
      <scroll-view scroll-y="true" class="range" v-if="goodsInfo.spec.length">
        <view class="text">{{selectedItem['attr_name']}}</view>
        <view class="box">
          <block v-for="(item, index) in goodsInfo.spec" :key="item.item_id" :data-index="index">
            <view v-if="item.empty==0" :class="selectedItem.item_id==item.item_id?'item itemActive':'item'"
                  @click="selectItem"
                  :data-spec="item">
              {{item.name}}
            </view>
            <view class="item nostocks" v-else>
              {{item.name}}
            </view>
          </block>
        </view>
        <view class="text">{{selectedItem['list'][0]['attr_name']}}</view>
        <view class="box">
          <!--itemActive-->
          <block v-for="(item, index) in selectedItem.list" :key="item.sku_id"
                 :data-index="index">
            <view v-if="item.stocks>0" :class="selectedSku.sku_id==item.sku_id?'item itemActive':'item'"
                  @click="selectSku" :data-sku="item">
              {{item.name}}
            </view>
            <view class="item nostocks" v-else>
              {{item.name}}
            </view>
          </block>
        </view>

        <view class="center">
          <view class="text">
            购买数量
            <span class="limit_buy" v-if="goodsInfo.limit_buy">{{goodsInfo.limit_buy.msg}}</span>
          </view>
          <view class="number">
            <view class="minus" @click="tapMinusNum">-</view>
            <input type='number' class="num" @input="bindinput"
                   confirm-type="done" v-model="num"/>
            <view class="add" @click="tapAddNum">+</view>
          </view>
        </view>
      </scroll-view>

      <view class="bottom">
        <view class="bottomMain">
          <view class="main">
            <view class="add-cart" @click="tapAddCart">加入购物车</view>
          </view>
          <view class="main">
            <view class="buy-now" @click="tapBuyNow">立即购买</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
  import util from '@/utils/util'
  import api from '@/utils/api'
  // import user from '@/services/user'
  export default {
    props: {
      goodsInfo: {
        type: Object,
        default() {
          return {}
        }
      },
      isDialog: {
        type: Boolean,
        default() {
          return false
        }
      },
      gid: {
        type: String,
        default() {
          return ''
        }
      }
    },
    data() {
      return {
        num: 1,
        specMsg: '',
        selectedItem: {
          item_id: 0,
          attr_name: '',
          list: [{attr_name: ''}]
        },
        selectedSku: {
          sku_id: 0
        }
      }
    },
    mounted() {
      let idx = 0
      let isSpec = false
      this.goodsInfo.spec.forEach((item, index) => {
        let store = 0
        item.list.forEach((i) => {
          store += i.stocks
        })
        if (store > 0) {
          if (!isSpec) {
            idx = index
            isSpec = true
          }
          this.goodsInfo.spec[index].empty = 0
        } else {
          this.goodsInfo.spec[index].empty = 1
        }
      })
      this.selectedItem = this.goodsInfo.spec[idx]
      this.selectedSku = this.selectedItem['list'].find((item) => {
        return item.stocks > 0
      })
      this.specMsg = `已选择：${this.selectedItem.name} ${this.selectedSku.name}`
    },
    methods: {
      async addCart(type) {
        util.showLoading()
        const res = await api.CartAdd({
          sku: this.selectedSku.sku_id,
          num: this.num,
          type: type
        })
        util.hideLoading()
        if (res.code === 0) {
          this.$emit('updateSpecMsg', `${this.selectedItem.name} ${this.selectedSku.name}`)
          this.$emit('closeCartDialog', res.data.cartProfuctNum)
          if (type === 2) {
            wx.navigateTo({
              url: '/pages/order/confirmOrder'
            })
          }
        } else {
          util.showToast(res.msg)
        }
      },
      // 立即购买
      tapBuyNow() {
        this.addCart(2)
      },
      // 添加购物车
      tapAddCart() {
        this.addCart(1)
      },
      // 关闭购物车dialog
      tapCloseDialog() {
        this.$emit('updateSpecMsg', `${this.selectedItem.name} ${this.selectedSku.name}`)
        this.$emit('closeCartDialog')
      },
      previewImg() {
        wx.previewImage({
          current: this.selectedItem.img,
          urls: [this.selectedItem.img]
        })
      },
      // 更新选择规格
      updateSpecMsg() {
        this.specMsg = `已选择：${this.selectedItem.name} ${this.selectedSku.name}`
      },
      // 选择第一个规格颜色
      selectItem(e) {
        if (this.selectedItem.item_id === e.target.dataset.spec.item_id) return
        this.selectedItem = e.target.dataset.spec
        this.selectedSku = e.target.dataset.spec.list[0]
        this.selectedSku = this.selectedItem.list.find((item) => {
          if (item.stocks > 0) {
            return item
          }
        })
        this.updateSpecMsg()
      },
      // 选择sku
      selectSku(e) {
        if (this.selectedSku.sku_id === e.target.dataset.sku.sku_id) return
        this.selectedSku = e.target.dataset.sku
        this.specMsg = `已选择：${this.selectedItem.name} ${this.selectedSku.name}`
        this.updateSpecMsg()
      },
      // 修改购买数量
      bindinput(e) {
        if (e.target.value <= 0) {
          this.num = 1
        } else if (this.goodsInfo.limit_buy && this.num >= parseInt(this.goodsInfo.limit_buy.limit_num)) {
          this.num = this.goodsInfo.limit_buy.limit_num
          util.showToast(this.goodsInfo.limit_buy.msg)
        } else if (e.target.value >= this.selectedSku.stocks) {
          this.num = this.selectedSku.stocks
          util.showToast('库存不足 无法添加更多')
        } else {
          this.num = e.target.value
        }
      },
      // 增加购买数量
      tapAddNum() {
        if (this.goodsInfo.limit_buy && this.num >= parseInt(this.goodsInfo.limit_buy.limit_num)) {
          this.num = this.goodsInfo.limit_buy.limit_num
          util.showToast(this.goodsInfo.limit_buy.msg)
        } else if (this.num < this.selectedSku.stocks) {
          this.num++
        } else {
          this.num = this.selectedSku.stocks
          util.showToast('库存不足 无法添加更多')
        }
      },
      // 减少购买数量
      tapMinusNum() {
        if (this.num > 1) {
          this.num--;
        } else {
          this.num = 1
          util.showToast('商品数量不能少于1')
        }
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../static/css/base";

  .dialog {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    color: @base_font_color;
    .dialog-main {
      width: 100%;
      height: auto;
      background-color: @white;
      position: absolute;
      bottom: 0;
      left: 0;
      .top {
        width: 348px;
        height: 88px;
        margin-left: 15px;
        border-bottom: 0.5px solid @border_color_c;
        position: relative;
        .close {
          width: 24px;
          height: 24px;
          position: absolute;
          top: 12px;
          right: 0;
        }
        .pic {
          width: 100px;
          height: 100px;
          position: absolute;
          left: 0;
          top: -28px;
          border-radius: 3px;
          background-color: #fff;
          border: 1 rpx solid @border_color_c;
        }
        .main {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: space-around;
          position: absolute;
          top: 9px;
          left: 110px;
          .main-title {
            font-size: @font_size_26;
          }
          .main-num {
            font-size: @font_size_24;
            line-height: 20px;
          }
          .main-amount {
            color: @aider_color2;
            font-size: @font_size_40;
            line-height: 30px;
            font-weight: bold;
          }
        }
      }
      .range {
        width: 348px;
        height: auto;
        margin-left: 15px;
        max-height: 320px;
        .text {
          font-size: @font_size_30;
          margin: 15px 0;
        }
        .center {
          width: 348px;
          height: 70px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: .5px solid @border_color_c;
          .text {
            font-size: @font_size_30;
          }
          .limit_buy {
            color: @aider_color2;
            font-size: @font_size_26;
          }
          .number {
            height: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            border: 0.5px solid @border_color;
            .num {
              text-align: center;
              width: 40px;
              height: 30px;
              line-height: 30px;
              font-size: @font_size_24;
              border-right: .5px solid @border_color;
              border-left: .5px solid @border_color;
              padding: 0 4px 0 0;
            }
            .add, .minus {
              width: 31px;
              height: 30px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: @font_size_24;
            }
          }
        }
        .box {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10px;
          .item {
            width: auto;
            height: auto;
            background-color: #F6F5FA;
            color: #757575;
            font-size: @font_size_26;
            padding: 6px 15px;
            margin-right: 15px;
            margin-bottom: 10px;
            border-radius: 2px;
            &.itemActive {
              background-color: @button_color3;
              color: #FFFFFF;
            }
            &.nostocks {
              background: #f4f4f4;
              color: #ccc;
            }
          }
        }
      }

      .bottom {
        width: 100%;
        height: auto;
        .bottomMain {
          width: 100%;
          height: 50px;
          display: flex;
          .main {
            width: 50%;
            .add-cart {
              width: 100%;
              height: 50px;
              background-color: @box-back-b;
              color: #fff;
              line-height: 50px;
              text-align: center;
              font-size: @font_size_30;
            }
            .buy-now {
              width: 100%;
              height: 50px;
              background-color: @button_color3;
              color: #fff;
              line-height: 50px;
              text-align: center;
              font-size: @font_size_30;
            }
          }
        }
      }
    }
  }

  /*.dialog-main1 {
    height: auto;
  }
  .dialog-main2 {
    height: 490rpx;
  }*/

</style>
