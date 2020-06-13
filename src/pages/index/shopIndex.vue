<template>
  <div class="container">
    <tabBarNav></tabBarNav>
    <scroll-view class="content" scroll-y="true" scroll-with-animation="true" :scroll-top="scrollTop">
      <img class="top-banner-img" src="../../../static/images/banner.png" alt="">
      <!--商品详情列表-->
      <div class="list">
        <div class="l-item" v-for="item of goodsData" :key="item.id">
          <a hover-class="none" :href="'../goods/shopGoods?id='+ item.idcode">
            <div class="l-img">
              <img :src="item.img">
            </div>
          </a>
          <div class="l-msg">
            <a hover-class="none" :href="'../goods/shopGoods?id='+ item.idcode">
              <div class="l-title">{{item.name}}</div>
            </a>
            <div class="l-price">
              <span class="price">￥</span>{{item.price}}
              <span class="earn-price">赚{{item.earn_price}}</span>
              <button open-type="share" :data-item="item" class="form_button btn_share">分享</button>
            </div>
          </div>

        </div>
      </div>
    </scroll-view>
    <view class="zhanwei"></view>
    <goTop></goTop>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'
  import wx from 'wx'
  import user from '@/services/user'
  import goTop from '@/components/goTop'
  import tabBarNav from '@/components/tabBarNav'

  export default {
    components: {
      goTop,
      tabBarNav
    },
    data() {
      return {
        navData: [], // 导航数据
        goodsData: [], // 商品
        bannerInfo: {}, // banner
        shopInfo: {}, // 店铺信息
        carouselData: [], // 轮播图
        categoryList: [],
        cid: 0, // 当前cid
        chilcdCid: 0, // 二级分类cid
        currentIndex: 0, // 当前位置
        scrollLeft: 0,
        scrollTop: 0,
        scrollHeight: 0,
        flexd: false,
        page: 1,
        size: 5 // 默认10000尽量大，查到所有符合的数据
      }
    },
    async mounted() {
      const isLogin = await user.checkLogin()
      if (!isLogin) user.redirectToLogin()
      // Object.assign(this.$data, this.$options.data())
      await Promise.all([
        this.getShopIndexInfo()
      ])
    },
    methods: {
      // 获取首页信息
      async getShopIndexInfo() {
        util.showLoading()
        const res = await api.getShopIndexInfo({
          cid: this.chilcdCid ? this.chilcdCid : this.cid,
          page: this.page
        })
        util.hideLoading()
        if (res.code === 0) {
          this.shopInfo = res.data.index_data.shop_info
          if (this.shopInfo.id === '53378c') {
            wx.setStorageSync('shop', this.shopInfo.id);
            wx.setStorageSync('userShop', '');
          }
          if (this.page > 1) {
            this.goodsData = this.goodsData.concat(res.data.index_data.product_list)
          } else {
            this.goodsData = res.data.index_data.product_list
            wx.setNavigationBarTitle({
              title: this.shopInfo.shopname + '的小店'
            })
          }
          // if (!this.chilcdCid) {
          //  this.tabMove()
          // }
        }
      },
      // 移动tab
      tabMove() {
        const currentIndex = this.currentIndex
        const navListCount = this.navData.length
        const activeKey = this.minAndMax(currentIndex, navListCount)
        const width = parseInt(750 / (navListCount > 5 ? 5 : navListCount))
        const move = width * activeKey
        this.scrollLeft = (move - width * 2.1) / 2
      },
      minAndMax(activeKey, length) {
        const max = length
        const min = 0
        if (activeKey > max) {
          return max
        } else if (activeKey < min) {
          return 0
        } else {
          return activeKey
        }
      },
      // 切换商品类别
      switchCate(event) {
        const cid = event.currentTarget.dataset.id
        const index = event.currentTarget.dataset.index
        this.cid = cid === '0' ? 0 : cid
        this.currentIndex = index
        this.page = 1
        this.chilcdCid = 0
        this.scrollTop = 0
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 0
        })
        // 重新请求数据
        this.getShopIndexInfo()
      },
      goSearch() {
        // this.form(e)
        wx.navigateTo({
          url: '/pages/search/search'
        })
      },
      // 切换子分类商品
      changeChildNav(event) {
        const ccid = event.currentTarget.dataset.id
        this.page = 1
        this.chilcdCid = ccid
        this.getShopIndexInfo()
      }
    },
    async onPullDownRefresh() {
      this.page = 1
      await this.getShopIndexInfo()
      wx.stopPullDownRefresh()
    },
    async onReachBottom() {
      this.page++
      await this.getShopIndexInfo()
    },
    onPageScroll(obj) {
      if (obj.scrollTop >= 82 && this.flexd === false) {
        this.flexd = true
      } else if (obj.scrollTop < 82 && this.flexd === true) {
        this.flexd = false
      }
    },
    // 原生的分享功能
    onShareAppMessage(e) {
      if (e.from === 'button') {
        const item = e.target.dataset.item
        return {
          title: item.name,
          imageUrl: encodeURI(item.img_box),
          path: `/pages/goods/goods?id=${item.idcode}&shop=${this.$store.state.shop}`
        }
      } else {
        return {
          title: this.shopInfo.shopname,
          desc: this.shopInfo.shopinfo,
          path: '/pages/index/index?shop=' + this.$store.state.shop
        }
      }
    }
  }
</script>

<style scoped type="text/less" lang="less">
  @import "../../../static/css/base";

  .container {
    background-color: @content-back;
  }
  .top-banner-img{
    width: 100%;
    height: 175px;
  }
  .btn_share {
    float: right;
    height: 30px;
    line-height: 30px;
    font-size: @font_size_28;
    padding: 0 10px 0 35px;
    background: url(https://staticds.999d.com/static/m/image/is_share.png) no-repeat 5px center #f23030;
    background-size: 20px auto;
    border-radius: 5px;
    display: inline-block;
    color: #fff;
    vertical-align: middle;
  }

  .flexd-box {
    padding-top: 10px;
    background: @white;
    border-top: .5px solid @border_color_c;
    width: 100%;
    &.flexd {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 999;
    }
  }

  .shopinfo {
    box-sizing: border-box;
    padding: 10px 20px;
    display: flex;
    background: @white;
    border-top: .5px solid @border_color_c;
    .s-pic {
      width: 50px;
      height: 50px;
      border-radius: 25px;
      border: .5px solid @border_color_c;
      overflow: hidden;
      margin-right: 10px;
      vertical-align: middle;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .s-info {
      flex: 1;
      width: 275px;
      h3 {
        color: @base_font_color;
        font-size: @font_size_35;
        margin-top: 5px;
      }
      p {
        color: @aider_font_color;
        font-size: @font_size_28;
      }
    }
  }

  .search {
    display: block;
    position: relative;
    .button {
      width: 100%;
      height: 100%;
      opacity: 0;
      position: absolute;
      top: 0;
      left: 0;
    }
    .main {
      width: 350px;
      height: 30px;
      background-color: #F6F5FA;
      border-radius: 100px;
      margin-left: 12.5px;
      display: flex;
      align-items: center;
      image {
        width: 16px;
        height: 16px;
        margin-left: 12px;
      }
      .input {
        max-width: 300px;
        height: 20px;
        border: none;
        outline: none;
        font-size: @font_size_26;
        color: #C6C6C9;
        margin-left: 4px;
      }
    }
  }

  .bar {
    width: 100%;
    background-color: #fff;
    /*position: relative;*/
    /*top: 30px;*/
    /*left: 0;*/
    /*z-index: 9999;*/
    .fui-tab-scroll {
      height: 40px;
      background: #fff;
      position: relative;
      white-space: nowrap;
      display: -webkit-flex;
      display: flex;
      border-bottom: 0.5px solid @border_color;
      padding: 0 12px;
      .item {
        height: 38.5px;
        color: @base_font_color;
        margin: 0 12.5px;
        font-size: @font_size_28;
        display: inline-block;
        position: relative;
        text-align: center;
        line-height: 38.5px;
        &:last-child {
          margin-right: 25px;
        }
        .button {
          height: 38.5px;
          width: 100%;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
        }
        &.active {
          color: @base_color;
        }
        .activeBottom {
          width: 100%;
          height: 2px;
          background-color: @base_color;
          border-radius: 15px;
          position: absolute;
          bottom: -1.5px;
          left: 0;
        }
      }
    }
  }

  .content {
    width: 100%;
    box-sizing: border-box;
    /*padding-top: 70px;*/
    .carousel {
      width: 375px;
      height: 175px;
      a {
        display: block;
        width: 100%;
        height: 100%;
        image {
          width: 100%;
          height: 100%;
        }
      }
    }
    .list {
      margin: 10px 7.5px;
      .l-item {
        background: #fff;
        margin-bottom: 10px;
        box-sizing: border-box;
        border: 0.5px solid @border_color_c;
        .l-img {
          width: 100%;
          height: 175px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .l-msg {
          width: 100%;
          /*height: 88px;*/
          padding: 10px;
          box-sizing: border-box;
          .l-title {
            font-size: @font_size_30;
            color: @base_font_color;
            width: 100%;
            /*overflow: hidden;*/
            /*white-space: nowrap;*/
            /*text-overflow: ellipsis;*/
          }
          .l-price {
            color: @aider_color2;
            font-size: @font_size_50;
            margin-top: 10px;
            .price {
              font-size: @font_size_30;
              font-weight: 500;
            }
            .earn-price {
              font-size: @font_size_24;
              height: 20px;
              line-height: 20px;
              display: inline-block;
              vertical-align: middle;
              background: @aider_color2;
              color: #fff;
              margin-right: 10px;
              padding: 0 5px;
            }
          }
        }
      }
    }
    .banner {
      height: 75px;
      margin: 10px 7.5px 0;
      box-sizing: border-box;
      border-radius: 5px;
      overflow: hidden;
      a {
        width: 100%;
        height: 100%;
        img {
          width: 100%;
          height: 100%;
        }
      }

    }
    .category {
      white-space: nowrap;
      background: @white;
      margin-top: 10px;
      .cate-item {
        width: 70px;
        height: 70px;
        display: inline-block;
        padding: 10px 0 0 5px;
        vertical-align: top;
        text-align: center;
        position: relative;
        .cate-active {
          position: absolute;
          top: 4px;
          left: 37.5px;
          width: 7px;
          height: 7px;
          border-radius: 3.5px;
          background: @aider_color1;
        }
        text {
          font-size: @font_size_30;
          color: @base_font_color;
          line-height: 70px;
          text-align: center;
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }

</style>
