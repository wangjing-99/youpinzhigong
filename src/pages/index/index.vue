<template>
  <div class="container">
    <tabBarNav></tabBarNav>
    <scroll-view class="content" scroll-y="true" scroll-with-animation="true" :scroll-top="scrollTop">
      <img class="top-banner-img" src="../../../static/images/banner.png" alt="">
      <!--<div v-if="cid === 0" class="shopinfo">-->
      <!--<div class="s-pic">-->
      <!--<img :src="shopInfo.shoplogo" alt="">-->
      <!--</div>-->
      <!--<div class="s-info">-->
      <!--<h3 class="owt">{{shopInfo.shopname}}</h3>-->
      <!--<p class="owt">{{shopInfo.shopinfo}}</p>-->
      <!--</div>-->
      <!--</div>-->
      <!--<div :class="flexd?'flexd-box flexd':'flexd-box'">-->
      <!--<form class="search" report-submit @submit='goSearch'>-->
      <!--<div class="main">-->
      <!--<image src="../../static/images/icon-search.png" mode="aspectFit"/>-->
      <!--<div class="input">输入关键字进行搜索</div>-->
      <!--</div>-->
      <!--<button class="button" formType="submit"></button>-->
      <!--</form>-->
      <!--<div class="bar">-->
      <!--<scroll-view scroll-x="true" scroll-with-animation="true" class="fui-tab-scroll" :scroll-left="scrollLeft">-->
      <!--<form :class="cid === 0 ? 'active item' : 'item'"-->
      <!--@submit="switchCate" data-id="0" data-index="0">-->
      <!--全部-->
      <!--<div :class="cid === 0 ? 'activeBottom' : ''"></div>-->
      <!--<button class="button" form-type="submit"></button>-->
      <!--</form>-->
      <!--<form v-for="item of navData" :class="cid === item.id ? 'active item' : 'item'" :key="item.id"-->
      <!--@submit="switchCate" :data-id="item.id" :data-index="index+1">-->
      <!--{{item.name}}-->
      <!--<div :class="cid === item.id ? 'activeBottom' : ''"></div>-->
      <!--<button class="button" form-type="submit"></button>-->
      <!--</form>-->
      <!--</scroll-view>-->
      <!--</div>-->
      <!--</div>-->
      <!--首页全部只有全部显示轮播图和banner-->
      <div v-if="cid === 0">
        <!--<swiper class="carousel" indicator-dots="true" autoplay="true" interval="3000" duration="1000">-->
        <!--<swiper-item v-for="item of carouselData" :key="item.id">-->
        <!--<a hover-class="none" :href="'/pages/topic/webview?index='+ index">-->
        <!--<img :src="item.img" background-size="cover"/>-->
        <!--</a>-->
        <!--</swiper-item>-->
        <!--</swiper>-->
        <!--<div class="banner">-->
        <!--<a :href="'/pages/topic/topicDetail?url='+ url">-->
        <!--<img :src="bannerInfo.img" alt="">-->
        <!--</a>-->
        <!--</div>-->
      </div>
      <div v-else>
        <!--切换显示二级分类-->
        <div v-for="(item, index) in navData" v-if="item.id === cid" :key="item.id">
          <scroll-view class="category" scroll-x="true"
                       scroll-with-animation="true">
            <div @click="changeChildNav" v-for="(i,idx) in item.child" :key="i.id" :data-id="i.id" hover-class="none"
                 class="cate-item">
              <i v-if="chilcdCid == i.id" class="cate-active"></i>
              <img v-if="i.pic" :src="i.pic" alt="">
              <text class="pic-name" v-else>{{i.name}}</text>
            </div>
          </scroll-view>
        </div>
      </div>
      <!--商品详情列表-->
      <div class="list">
        <div class="l-item" v-for="item of goodsData" :key="item.id">
          <a hover-class="none" :href="'../goods/goods?id='+ item.idcode">
            <div class="l-img">
              <img :src="item.img">
            </div>
            <div class="l-msg">
              <div class="l-title">{{item.name}}</div>
              <div class="l-price">
                <span class="price">￥</span>{{item.price}}
              </div>
            </div>
          </a>
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
    onShow() {
      this.$store.dispatch('updateShop', this.$route.query.shop)
    },
    async mounted() {
      const isLogin = await user.checkLogin()
      if (!isLogin) user.redirectToLogin()
      // Object.assign(this.$data, this.$options.data())
      await Promise.all([
        this.getIndexInfo()
      ])
    },
    methods: {
      // 获取首页信息
      async getIndexInfo() {
        util.showLoading()
        const res = await api.getIndexInfo({
          cid: this.chilcdCid ? this.chilcdCid : this.cid,
          page: this.page
        })
        util.hideLoading()
        if (res.code === 0) {
          // if (this.cid === 0) {
          // this.navData = res.data.index_data_nav.category_list
          // this.bannerInfo = res.data.index_data.banner
          // this.carouselData = res.data.index_data.carousel
          // this.$store.commit('carouselData', this.carouselData)
          // }
          this.shopInfo = res.data.index_data.shop_info

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
        this.getIndexInfo()
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
        this.getIndexInfo()
      }
    },
    async onPullDownRefresh() {
      this.page = 1
      await this.getIndexInfo()
      wx.stopPullDownRefresh()
    },
    async onReachBottom() {
      this.page++
      await this.getIndexInfo()
    },
    onPageScroll(obj) {
      if (obj.scrollTop >= 82 && this.flexd === false) {
        this.flexd = true
      } else if (obj.scrollTop < 82 && this.flexd === true) {
        this.flexd = false
      }
    },
    // 原生的分享功能
    onShareAppMessage() {
      return {
        title: this.shopInfo.shopname,
        desc: this.shopInfo.shopinfo,
        path: '/pages/index/index?shop=' + this.$store.state.shop
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
