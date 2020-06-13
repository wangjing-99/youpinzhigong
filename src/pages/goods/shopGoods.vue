<template>
  <div :style="isDialog?'position:fixed;':'position:relative;'">
    <div class="container">
      <div class="swiper-box">
        <button open-type="share" class="form_button btn_share"></button>
        <swiper class="goodsimgs" indicator-dots="true" autoplay="true" interval="3000" duration="1000">
          <swiper-item v-for="(item, index) of goodsInfo.imgs" :key="item.id" :data-index="index">
            <img :src="item" background-size="cover"/>
          </swiper-item>
        </swiper>
      </div>

      <div v-if="goodsInfo.valid_special_activity" class="service-policy">
        <h3>限时特卖</h3>
        <p>距结束仅剩
          <span>
            <label id="day_show">{{time.day}}天 </label>
            <label id="hour_show">
              <text id="h"></text>{{time.hour}}时
            </label>
            <label id="minute_show">
              <text></text>{{time.minute}}分
            </label>
            <label id="second_show">
              <text></text>{{time.second}}秒
            </label>
          </span>
        </p>
      </div>
      <div class="goods-info">
        <text class="name">{{goodsInfo.name}}</text>
        <div class="price">
          <span class="price-icon">￥</span>
          <span class="cur-price">{{goodsInfo.price?goodsInfo.price:0}} </span>
          <span class="earn_price"> 赚{{goodsInfo.earn_price?goodsInfo.earn_price:0}}</span>
          <span class="org-price"> ￥{{goodsInfo.price_tag?goodsInfo.price_tag:0}}</span>
          <span v-if="goodsInfo.valid_special_activity" class="discount">限时价</span>
        </div>
      </div>

      <div v-if="goodsInfo.adword" class="intro">
        <h3>精选推荐</h3>
        <p>{{goodsInfo.adword}}</p>
      </div>

      <block v-if="goodsInfo.product_status != 1 || goodsInfo.stocks < 1">
        <!--没库存、售罄-->
      </block>
      <block v-else>
        <div class="section-nav select-spc" @click="addToCart">
          <view class="t">选择:
            <span>{{specMsg}}</span>
          </view>
          <img class="i" src="/static/images/address_right.png" background-size="cover"/>
        </div>
      </block>

      <!--<div class="section-nav select-spc mg0" @click="switchAttrPop">-->
        <!--<view class="t">猜你喜欢-->
        <!--</view>-->
      <!--</div>-->
      <!--<div class="related-goods" v-if="likeProduct.length">-->
        <!--<div class="b">-->
          <!--<div class="item" v-for="(item, index) of likeProduct" :key="item.id" :data-index="index">-->
            <!--<navigator open-type="redirect" :url="'/pages/goods/shopGoods?id=' + item.id">-->
              <!--<img class="img" :src="item.img" background-size="cover"/>-->
              <!--<text class="name">{{item.name}}</text>-->
              <!--<text class="price">￥{{item.price}}</text>-->
            <!--</navigator>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
      <!--商品详情-->
      <wxParse v-if="goodsInfo.info" :content="goodsInfo.info"/>
      <!--<div class="section-nav select-spc mg0" @click="switchAttrPop">-->
        <!--<view class="t">大家都在买-->
        <!--</view>-->
      <!--</div>-->
      <!--<div class="related-goods" v-if="bestProduct.length">-->
        <!--<div class="b">-->
          <!--<div class="item" v-for="(item, index) of bestProduct" :key="item.id" :data-index="index">-->
            <!--<navigator open-type="redirect" :url="'/pages/goods/shopGoods?id=' + item.id">-->
              <!--<img class="img" :src="item.img" background-size="cover"/>-->
              <!--<text class="name">{{item.name}}</text>-->
              <!--<text class="price">￥{{item.price}}</text>-->
            <!--</navigator>-->
          <!--</div>-->
        <!--</div>-->
      <!--</div>-->
    </div>
    <div class="bottom-btn">
      <div class="l l-service">
        <button open-type="contact" class="box form_button">
          <icon class="icon"></icon>
          <div class="text">客服</div>
        </button>
      </div>
      <a :href="'/pages/index/shopIndex?shop='+shop" open-type="reLaunch" hover-class="none" class="l l-home">
        <div class="box">
          <icon class="icon"></icon>
          <div class="text">首页</div>
        </div>
      </a>
      <a href="/pages/cart/cart" open-type="reLaunch" hover-class="none" class="l l-cart">
        <div class="box">
          <text v-if="cartProfuctNum" class="cart-count">{{cartProfuctNum}}</text>
          <icon class="icon"></icon>
          <div class="text">购物车</div>
        </div>
      </a>
      <block v-if="goodsInfo.product_status != 1 || goodsInfo.stocks < 1">
        <div class="c c-c">买</div>
        <div class="r r-r">卖</div>
      </block>
      <block v-else>
        <div class="c" @click="addToCart">买</div>
        <button open-type="share" class="form_button r">卖</button>
      </block>
    </div>
    <div :animation="animationOut" class="add-cart-tip">
      成功加入购物车 <a href="/pages/order/confirmOrder">立即结算
      &gt; </a>
    </div>
    <block v-if="goodsInfo.product_status != 1 || goodsInfo.stocks < 1">
      <div v-if="goodsInfo.product_status != 1" class="tips">商品已经下架啦~</div>
      <div v-else class="tips">商品已经售罄 ~</div>
    </block>
    <detailCart v-if='goodsInfo.stocks && goodsInfo.name' :gid="gid" :isDialog="isDialog"
                @closeCartDialog="closeCartDialog"
                @updateSpecMsg="updateSpecMsg" :goodsInfo="goodsInfo"></detailCart>
    <loginDialog v-if="loginShow" @closeLoginDialog="closeLoginDialog"></loginDialog>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'
  import user from '@/services/user'
  import detailCart from '@/components/detailCart'
  import loginDialog from '@/components/loginDialog'
  import wxParse from 'mpvue-wxparse'

  export default {
    components: {
      wxParse,
      detailCart,
      loginDialog
    },
    data() {
      return {
        id: 0,
        gid: 0,
        num: 1,
        shop: '',
        cartProfuctNum: 0,
        isDialog: false,
        loginShow: false,
        goodsInfo: {
          name: '',
          imgs: [],
          info: '',
          product_status: 1,
          stocks: 1,
          spec: [{
            attr_name: '',
            list: [{
              attrname: ''
            }]
          }],
          limit_buy: false
        },
        shopInfo: {
          shopname: '',
          shopinfo: '',
          shoplogo: ''
        },
        likeProduct: [],
        bestProduct: [],
        specMsg: '',
        time: {
          'day': '00',
          'hour': '00',
          'miunte': '00',
          'second': '00'
        },
        timer: null,
        goodDetailHTMLstr: '',
        scrollTop: 0,
        animationOut: {}
      }
    },
    async mounted() {
      // 验证是否授权登录
      const isLogin = await user.checkLogin()
      if (!isLogin) user.redirectToLogin()
      this.shop = this.$store.state.shop
      if (this.$route.query.id) {
        this.gid = this.$route.query.id
      }
      await Promise.all([
        this.getShopProduct()
      ])
    },
    onShow() {
      this.animationOut = {}
    },
    methods: {
      addToCart() {
        user.checkBindPhone() ? this.loginShow = true : this.loginShow = false
        this.animationOut = {}
        this.isDialog = true
      },
      formatTime(date) {
        let intDiff = util.getTimestamp(date)
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.time = util.getDHMS(intDiff)
          if (intDiff <= 0) {
            clearInterval(intDiff)
            return
          }
          intDiff--
        }, 1000);
      },
      // 获取商品详情
      async getShopProduct() {
        util.showLoading()
        const res = await api.getShopProduct({id: this.gid});
        util.hideLoading()
        if (res.code === 0) {
          this.goodsInfo = res.data.info
          this.shopInfo = res.data.shop_info
          this.likeProduct = res.data.likeproduct
          this.bestProduct = res.data.bestproduct
          this.cartProfuctNum = res.data.cartProfuctNum
          if (this.goodsInfo.product_status !== '1' || this.goodsInfo.stocks < 1) {
            if (this.goodsInfo.product_status !== '1') {
              // 商品已下架
            } else {
              // 商品已售罄
              return
            }
          }
          const attrName1 = this.goodsInfo['spec'][0]['attr_name']
          const attrName2 = this.goodsInfo['spec'][0]['list'][0]['attr_name'] // 规格
          this.specMsg = attrName1 + ' ' + attrName2
          if (res.data.info.valid_special_activity) {
            this.formatTime(res.data.info.valid_special_activity.end_time)
          }
        }
      },
      // 关闭购物车弹窗
      closeCartDialog(num) {
        if (num) {
          this.cartProfuctNum = num
          const animation = wx.createAnimation({
            duration: 1000,
            delay: 0,
            timingFunction: 'ease'
          })
          animation.bottom('100rpx').step().bottom('0rpx').step({delay: 2000})
          this.animationOut = animation.export()
        }
        this.isDialog = false
      },
      closeLoginDialog() {
        this.loginShow = false
      },
      updateSpecMsg(str) {
        this.specMsg = str
      },
      // 跳转到购物车页面
      openCartPage() {
        wx.switchTab({
          url: '/pages/cart/cart'
        });
      }
    },
    async onPullDownRefresh() {
      await this.getShopProduct()
      wx.stopPullDownRefresh()
    },
    // 原生的分享功能
    onShareAppMessage() {
      return {
        title: this.goodsInfo.name,
        imageUrl: encodeURI(this.goodsInfo.imgs[0]),
        path: `/pages/goods/goods?id=${this.gid}&shop=${this.$store.state.shop}`
      }
    },
    onUnload() {
      this.loginShow = false
      this.isDialog = false
      this.animationOut = {}
      this.goodsInfo = {
        name: '',
        imgs: [],
        product_status: 1,
        stocks: 1,
        info: '',
        spec: [{
          attr_name: '',
          list: [{
            attrname: ''
          }]
        }]
      }
      this.time = {
        'day': '00',
        'hour': '00',
        'miunte': '00',
        'second': '00'
      }
    }
  }
</script>

<style type="text/less" lang="less">
  @import "../../utils/wxParse/wxParse";
  @import "../../../static/css/base";

  .container {
    padding-bottom: 60px;
    background: @content-back;
  }
  .swiper-box{
    width: 100%;
    position: relative;
    .btn_share {
      position: absolute;
      display: block;
      width: 50px;
      height: 50px;
      line-height: 50px;
      color: #fff;
      text-align: left;
      right: 0;
      top: 0;
      background: url(https://staticds.999d.com/static/m/image/ic_share.png) no-repeat center;
      background-size: 30px auto;
      z-index: 2;
    }
  }

  .tips {
    position: fixed;
    left: 0;
    bottom: 50px;
    right: 0;
    background-color: #929393;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: @font_size_28;
    text-align: center;
    z-index: 98;
  }

  .goodsimgs {
    width: 100%;
    height: 375px;
    image {
      width: 100%;
      height: 100%;
      background-color: #eee;
    }
  }

  .goods-info {
    width: 100%;
    box-sizing: border-box;
    background: @white;
    padding: 5px 14px;
    /*line-height: 30px;*/
    border-bottom: 0.5px solid @border_color_c;
    .name {
      font-size: @font_size_30;
      color: @base_font_color;
    }
    .price {
      line-height: 35px;
      .price-icon {
        color: @aider_color2;
        font-size: @font_size_30;
      }
      .cur-price {
        color: @aider_color2;
        font-size: @font_size_50;
      }
      .org-price {
        color: @aider_font_color;
        text-decoration: line-through;
        font-size: @font_size_28;
      }
      .earn_price{
        font-size: @font_size_24;
        padding: 0 6px;
        height: 14px;
        line-height: 14px;
        display: inline-block;
        vertical-align: middle;
        background: @aider_color2;
        margin-right: 5px;
        color: #fff;
      }
      .discount {
        height: 20px;
        line-height: 20px;
        padding: 0 5px;
        background: @box-back;
        color: @aider_color2;
        font-size: @font_size_28;
        display: inline-block;
        vertical-align: middle;
        margin: 0 10px;
      }
    }
  }

  .intro {
    width: 100%;
    background: @white;
    padding: 10px 10px 10px 0;
    box-sizing: border-box;
    border-bottom: 0.5px solid @border_color_c;
    h3 {
      width: 80px;
      padding: 40px 0 0 0;
      line-height: 20px;
      font-size: 12px;
      text-align: center;
      color: #f23030;
      background: url(https://staticds.999d.com/static/m/image/ico_zan.png) no-repeat top center;
      background-size: 40px auto;
      float: left;
    }
    p {
      margin-left: 80px;
      height: 60px;
      line-height: 20px;
      overflow: hidden;
      color: @aider_font_color;
      display: table-cell;
      vertical-align: middle;
      font-size: @font_size_26;
    }
  }

  .section-nav-item {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    box-sizing: border-box;
    padding: 10px;
    margin-bottom: 7.5px;
    border-bottom: .5px solid @border_color_c;
    .s-l {
      width: 60px;
      height: 60px;
      border-radius: 30px;
      overflow: hidden;
      margin: 0 10px 0 5px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .s-c {
      flex: 1;
      width: 200px;
      color: @base_font_color;
      font-size: @font_size_28;
      padding: 10px 0;
      h3 {
        font-size: @font_size_30;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      p {
        font-size: @font_size_26;
        color: @aider_font_color;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
    .s-r {
      font-size: @font_size_26;
    }
    .i {
      float: right;
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }

  .section-nav {
    width: 100%;
    padding: 10px;
    background: #fff;
    box-sizing: border-box;
    overflow: hidden;
    border-bottom: 0.5px solid @border_color_c;
    .t {
      float: left;
      width: 300px;
      font-size: @font_size_28;
      color: @base_font_color;
      margin-left: 10px;
    }
    .i {
      float: right;
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
  }

  .select-spc {
    margin: 7.5px 0;
  }

  .mg0 {
    margin: 0;
  }

  .related-goods {
    width: 100%;
    height: auto;
    overflow: hidden;
    .h {
      position: relative;
      height: 72.75px;
      width: 100%;
      padding: 28.125px 0;
      background: @white;
      text-align: center;
      border-bottom: 1px solid @border_color_c;
      .line {
        display: inline-block;
        position: absolute;
        top: 36px;
        left: 0;
        z-index: 2;
        height: 1px;
        margin-left: 112.5px;
        width: 150px;
        background: #ccc;
      }
      .title {
        display: inline-block;
        position: absolute;
        top: 28.0625px;
        left: 0;
        z-index: 3;
        height: 16.5px;
        margin-left: 142.5px;
        width: 100px;
        background: @white;
      }
    }
    .b {
      width: 100%;
      height: auto;
      overflow: hidden;
      .item {
        float: left;
        background: @white;
        width: 156px;
        height: auto;
        overflow: hidden;
        padding: 7.5px 15.625px;
        border-right: 1px solid @border_color_c;
        border-bottom: 1px solid @border_color_c;
        .img {
          width: 155.725px;
          height: 155.725px;
        }
        .name {
          display: block;
          width: 155.725px;
          height: 17.5px;
          margin: 5.75px 0 7.5px 0;
          overflow: hidden;
          font-size: 15px;
          color: #333;
        }
        .price {
          display: block;
          width: 155.725px;
          height: 15px;
          font-size: 15px;
          color: @aider_color2;
        }
      }
    }
  }

  .service-policy {
    width: 100%;
    box-sizing: border-box;
    height: 30px;
    padding: 0 10px 0 30px;
    line-height: 30px;
    color: #fff;
    background: url(https://staticds.999d.com/static/m/image/isover_bar.png) no-repeat #ff9000;
    background-size: auto 30px;
    font-size: @font_size_28;
    h3 {
      float: left;
    }
    p {
      float: right;
      span {
        display: inline-block;
      }
    }
  }

  .bottom-btn {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    height: 50px;
    display: flex;
    background: @white;
    font-size: @font_size_30;
    color: #fff;
    .l {
      float: left;
      height: 50px;
      /*width: 58.5px;*/
      width: 50px;
      border-top: 0.5px solid @border_color_c;
      color: @base_font_color;
      font-size: 10px;
      text-align: center;
      padding-top: 8px;
      box-sizing: border-box;
      .icon {
        display: inline-block;
        height: 22px;
        width: 22px;
      }
      .box {
        position: relative;
        height: auto;
        width: 30px;
        display: inline-block;
      }
      &.l-service {
        .box {
          padding-left: 7.5px;
        }
        .icon {
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAMAAACf4xmcAAAAhFBMVEUAAABMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTloqmhzZAAAAK3RSTlMA7maI+swF4XEq5Tjx6tM0Eb60VQr3pHbdx51IIhiUjoJqXUMlHbCEXEyXxN40hQAAAYRJREFUOMuN1NlygkAURdHT2EFmkBkR5zHn//8vTIWEtJD11lVbuHAtMKaXj9ATUgovPJY61OzU4YiT2qpow5obHgxNMw6hy1oxDeM9SevhY+A/LJL7eFztvDrSJtPoWh16OwzM+vwd44/4m7TM4Vou5RlKT0l31//GoyzxQSnpdfc5kGd8dCYP7WCSW8zYUjbjpRTBXBYIpkAlecSsI2UFjbzNZxWpIWXRv/a1mFj3SymYwuO+O5z4xwmtPT0IGv1untrEs9+eQYHmxgs0EgmNpexEBzlXS9mKOe7cLGUh78iYBMNevkaGDcbNXNf3MwT8JXg/wRXYMNfRiVYjETp63o5VkhlmZOSlmzDxP1d2whCNm6D1cfs7l6JC6yK5NtWVaVFe0IskHeX/3Egoo/fx5ZCR8kPgvDBydaY70191xK8rflm3mW5kkW2adpTdBUnX0KHIqoIjeRYAisy2SIctsTk271KVnSSlgcD0fbO9jDpzSfeCBWuSxQ3/yLY6Fq2Ehhk/nPsty41G6sgAAAAASUVORK5CYII=') no-repeat;
          background-size: 100% 100%;
        }
        .text {
          font-size: 10px;
          line-height: 14px;
        }
      }
      &.l-home {
        .icon {
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAABIFBMVEUAAABSVWIMDA1MTlpRU2AODxErLDNUVmRMTloSExYgISZMTlpOUF04OUI4OUJMTlpRU2FMTlpOUF0vMDdMTlpSVWJMTlpMTlpMTlpSVGFQUl8KCgtMTlpPUV5NT1tMTltTVWNTVmNUVmRQU2BTVWJTVmMyMztNT1svMDhRU2BMTlpMTlpSVGJQUl9MTlpMTlpQUl5NT1tNT1tSVWJMTlpMTltKTFdOUF1TVWJRU2ATFBhQUl8nKS9SVWJMTlpMTlpMTlpQUl5MTlpUVmROUF1NT1tMTltTVmNPUV5UV2RMTlpMTlo5OkRRVGBRU2A4OUJUVmRUV2Q4OUJERVA4OUIqKzJSVGEvMThISlVTVmMzNDwTFBcnKC4ODxFMTlpOUF14QnjXAAAAXnRSTlMAnQ2IwBwXzUQGAv3oSKL6t9SBDfEi6+HKZz8K99rFo5OOc1tNOSMYExL03caxsauYjX54eG1lU0MuFwwF5+fk2Mq8urm1hoB7YmBILB4Wq6mmclFRTUg9NTQwLSYYMcb5XwAAAfpJREFUSMftlWl7mkAQgEdsU4GmhAAiGI+o8UjUGq9oNGnuO+l9t9P//y+6O0EJjyj75GvyfmHZ4d1ld4YFwtlomtpBQQJh5AIS2VtRQ1pHj62hmGG8xSmmqwgYdylkHFzXttfYVd2JNqwtbhyWWdNJ8mY3yvhBj60YwFm2+TytxcZnExG13GQBZZ07TXmB0dtExLUzv8PIqszJLs01aMFaHx6g0PZlbsIFJaay6GYCgsS5864UZlQbPLY/nBnJoQQ5s8afOo/otyGzf6P37czUoc6N0xqEMbR5MG8EOktJ6pTm5TfLwx92H0xd1JDRmb//ux+RkbKCta5dKotqlarb/glEmu72S7CYgsZTMODjjihZ+gZEUaT1FhUYUa3XyxDN9wwy+tDnl4YBIpQP+ZcKV4haCwQxTlQ8gvFpsg3itLcr8EiUWhVEqIzAY+zg3lcB40JVJ6l4WUfMRxvVF4jraU95hRiLVpaYEpOehGK1m0e5S0lcucshYTqyoGLpOKGVFlKkBvp0FAFFGfDTsVepFOkMrwko4zxi5hdvySfM2RFQ5BX89x6IL68RLwSVN0AsM2X1WZlV/h4j6ldu4p7rVEDJJTzcno147hVQ+hwDBJQgLnj83hNUjv2f0sAORMxPQFQzQSNlgY9UWo1POZvW1U037tN1ZeD8B0rSvNVbnvoQAAAAAElFTkSuQmCC') no-repeat;
          background-size: 100% 100%;
        }
      }
      &.l-cart {
        .box {
          padding-right: 10px;
        }
        .icon {
          background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAkCAMAAADM4ogkAAAAflBMVEUAAABMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlpMTlqu3IXoAAAAKXRSTlMARGYE+nrqopU+F1cy7+LPyLqaJR0K9NvYtK2LhFpPSSzEwg8O5nBvZyO/8FwAAAEUSURBVDjLnZTJcoMwEERlSwaMzWrWgCGJs73//8EcckBITJlK31p0AfN6SkqpEILooZ4rAcj18+A5KjO4qz2KoVS71JLvC77Q6F3BE9x2BSe4KKXPhy3Zr6hgVCpiW0Vtw+zlINESzOmkT88ZwRIMMeLYIWYxI/LYb3SLucMsBQN6q3D4FnIfMKzajoTgFY6WbSiE4AXOls1I5Xrj1VpQS3QS2w7wKtHJbfsDk0QntO0BTgKd9YMKSonOxfba8C7RuSpbHZ8SndqhQHj09ZXSOv9iEOQOOQVsyQzeotabCx6r/0tX2j+M/bM5oHXrfhQYdxadgMd8BG9ZKoDAu5Pwb8QU6P1aMDe3/cwULgtdNunfSvwCutYnSHxBpf4AAAAASUVORK5CYII=') no-repeat;
          background-size: 100% 100%;
        }
        .cart-count {
          height: 15px;
          width: 15px;
          z-index: 10;
          position: absolute;
          top: -3px;
          right: 5px;
          background: @base_color;
          text-align: center;
          font-size: 10px;
          color: #fff;
          line-height: 14px;
          border-radius: 50%;
        }
      }
    }
    .c {
      float: left;
      height: 50px;
      line-height: 50px;
      background: @box-back-b;
      flex: 1;
      text-align: center;
      &.c-c {
        background: #ffc48d;
      }
    }
    .r {
      background: @base_color;
      float: left;
      height: 50px;
      line-height: 50px;
      flex: 1;
      text-align: center;
      &.r-r {
        background: #eb8bad;
      }
    }
  }

  .add-cart-tip {
    position: fixed;
    left: 0;
    bottom: 0;
    right: 0;
    padding: 0 35px 0 10px;
    width: 100%;
    height: 40px;
    font-size: 15px;
    line-height: 40px;
    color: #fff;
    box-sizing: border-box;
    background: rgba(0, 0, 0, .7);
    min-width: 320px;
    max-width: 640px;
    margin: auto;
    a {
      color: #fc033c;
      float: right;
    }
  }

  .wxParse {
    margin-top: 7.5px;
    background: #fff;
  }

  .wxParse view {
    width: 100%;
    text-align: center;
  }

</style>
