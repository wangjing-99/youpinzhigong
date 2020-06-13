<template>
  <view class="container">
    <view class="search-header">
      <view class="input-box">
        <img class="icon" src="https://staticds.999d.com/static/m/image/ic_search.png"/>
        <!--<input name="input" class="keywrod" focus="true" :value="keyword" confirm-type="search" @input="inputChange" @focus="inputFocus" @confirm="onKeywordConfirm" :placeholder="defaultKeyword.keyword"/>-->
        <input name="input" class="keywrod" focus="true" v-model="keyword" confirm-type="search"
               @confirm="onKeywordConfirm" placeholder="搜索商品关键词"/>
        <img class="del" v-if="keyword" @click="clearKeyword"
             src="../../../static/images/clearIpt.png"/>
      </view>
      <view class="right" @click="searchResult">搜索</view>
    </view>
    <view class="search-content">
      <scroll-view scroll-y="true" scroll-with-animation="true" @scrolltolower="lower" style="height: 100%;">
        <view class="no-search" v-if="!searchStatus">
          <view class="serach-keywords search-hot" v-if="!keyword && hotKeyword.length">
            <view class="h">
              <text class="title">热门搜索</text>
            </view>
            <view class="b">
              <view :class="item.is_hot === 1 ? 'active item' : 'item'" hover-class="navigator-hover"
                    @click="onKeywordTap"
                    :data-keyword="item.keyword" v-for="(item, index) of hotKeyword" :key="item.keyword"
                    :data-index="index">{{item.keyword}}
              </view>
            </view>
          </view>
          <view class="serach-keywords search-history" v-if="!keyword && historyKeyword.length">
            <view class="b">
              <view class="item" @click="onKeywordTap" :data-keyword="item" v-for="(item, idx) of historyKeyword"
                    :key="item" :data-index="index">{{item}}
                <view @click.stop="clearItem" :data-key="idx" class="clear-item">
                  <image src="/static/images/close-block.png"/>
                </view>
              </view>
            </view>
            <view @click="clearHistory" class="clear-history">
              清空搜索记录
            </view>
          </view>

          <view class="shelper-list" v-if="keyword">
            <view class="item" hover-class="navigator-hover" v-for="(item, index) of helpKeyword" :key="item"
                  :data-index="index" @click="onKeywordTap" :data-keyword="item">{{item}}
            </view>
          </view>
        </view>
        <view class="search-result" v-if="searchStatus && goodsList.length">
          <div class="list">
            <div class="l-item" v-for="item of goodsList" :key="item.id">
              <a hover-class="none" :href="'../goods/goods?id='+ item.idcode">
                <div class="l-img">
                  <img :src="item.img" background-size="cover">
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
        </view>
        <view class="search-result-empty" v-if="!goodsList.length && searchStatus">
          <img class="icon"
               src="https://staticds.999d.com/static/m/image/ib_goods.png"/>
          <text class="text">找不到您想要的结果~</text>
        </view>
      </scroll-view>
    </view>

  </view>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'
  import wx from 'wx'

  export default {
    data() {
      return {
        keyword: '',
        searchStatus: false,
        goodsList: [],
        helpKeyword: [],
        historyKeyword: [],
        filterCategory: [],
        defaultKeyword: {},
        hotKeyword: [],
        page: 1,
        timer: null,
        moreStutas: false
      }
    },
    async mounted() {
      await Promise.all([
        this.getSearchKeyword()
      ])
    },
    methods: {
      // 获取历史记录，默认红色关键词，热门关键词
      async getSearchKeyword() {
        this.historyKeyword = wx.getStorageSync('searchData') || []
        this.hotKeyword = []
      },
      // 点击“取消”
      closeSearch() {
        wx.navigateBack()
      },
      clearItem(event) {
        let idx = event.currentTarget.dataset.key
        if (idx !== undefined) {
          let searchData = wx.getStorageSync('searchData')
          let sd = util.arrRemove(searchData, idx)
          wx.setStorageSync('searchData', sd)
          this.historyKeyword = sd
        }
      },
      searchResult() {
        this.getSearchResult(this.keyword)
      },
      // 清空关键词
      clearKeyword() {
        this.keyword = ''
        this.searchStatus = false
        this.moreStutas = false
        this.historyKeyword = wx.getStorageSync('searchData') || []
      },
      // 监听输入事件
      inputChange(e) {
        // debounce防抖 500ms
        if (this.timer) {
          clearTimeout(this.timer);
        }
        this.timer = setTimeout(() => {
          // console.log('延迟监听输入事件', e);
          this.keyword = e.target.value;
          this.searchStatus = false;
          this.getHelpKeyword();
        }, 500)
      },
      // 输入框获得焦点
      inputFocus() {
        this.searchStatus = false;
        this.goodsList = [];
        if (this.keyword) {
          this.getHelpKeyword();
        }
      },
      // 输入时获取关键词提示
      async getHelpKeyword() {
        const res = await api.SearchHelper({keyword: this.keyword});
        // console.log('关键词提示,请求结果', res);
        if (res.code === 0) {
          this.helpKeyword = res.data;
        }
      },
      // 清空历史记录
      async clearHistory() {
        this.historyKeyword = [];
        wx.setStorageSync('searchData', [])
      },
      // 获得搜索结果的商品列表
      async getGoodsList() {
        if (this.moreStutas) {
          util.showToast('没有更多了~')
          return
        }
        util.showLoading()
        const res = await api.getGoodsList({
          word: this.keyword,
          page: this.page
        })
        util.hideLoading()
        // console.log('搜索结果', res);
        if (res.code === 0) {
          if (this.page > 1) {
            if (res.data.products.length === 0) {
              util.showToast('没有更多了~')
              this.moreStutas = true
              return
            }
            this.goodsList = this.goodsList.concat(res.data.products)
          } else {
            this.searchStatus = true
            this.goodsList = res.data.products
          }
        }
      },
      // 关键词被点击
      onKeywordTap(event) {
        // console.log('点击关键词的event', event);
        this.getSearchResult(event.currentTarget.dataset.keyword);
      },
      // 上一个方法调用
      getSearchResult(keyword) {
        if (!keyword) {
          util.showToast('请输入商品关键字')
          return
        }
        this.keyword = keyword
        this.saveHistoryWord()
        this.moreStutas = false
        this.page = 1
        this.goodsList = []
        this.getGoodsList()
      },
      saveHistoryWord() {
        let searchData = wx.getStorageSync('searchData') || []
        searchData.unshift(this.keyword)
        let sd = util.arrUnique(searchData)
        wx.setStorageSync('searchData', sd)
      },
      // 键盘回车进行搜索
      onKeywordConfirm: function (event) {
        this.getSearchResult(event.target.value);
      },
      lower() {
        if (!this.keyword) return
        this.page++
        this.getGoodsList()
      }
    },
    onUnload() {
      this.keyword = ''
      this.searchStatus = false
      this.goodsList = []
    }
  }
</script>

<style type="text/less" lang="less">
  @import "../../../static/css/base";

  page {
    min-height: 100%;
    background-color: @content-back;
  }

  .container {
    position: relative;
    height: 100%;
  }

  .search-header {
    position: absolute;
    top: 0;
    width: 100%;
    box-sizing: border-box;
    height: 45px;
    display: flex;
    background: #fff;
    border-bottom: .5px solid @border_color_c;
    border-top: .5px solid @border_color_c;
    padding: 7.5px 10px;
    font-size: @font_size_28;
    color: @base_font_color;
    z-index: 10;
    .input-box {
      position: relative;
      float: left;
      width: 0;
      flex: 1;
      height: 30px;
      line-height: 30px;
      padding: 0 10px;
      background: #f0f2f5;
      border-radius: 15px;
    }
    .icon {
      position: absolute;
      top: 3.5px;
      left: 6px;
      width: 22.5px;
      height: 22.5px;
    }
    .del {
      position: absolute;
      top: 2.5px;
      right: 5px;
      width: 25px;
      height: 25px;
      z-index: 10;
    }
    .right {
      margin-left: 15px;
      margin-right: 2.5px;
      /*width: 58rpx;*/
      /*height: 43rpx;*/
      line-height: 30px;
      float: right;
    }
    .keywrod {
      position: absolute;
      top: 0;
      left: 20px;
      width: 255px;
      font-size: @font_size_28;
      height: 30px;
      padding: 0 0 0 15px;
    }
  }

  .search-content {
    position: absolute;
    top: 45px;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  }

  .no-search {
    height: 100%;
    /*overflow: hidden;*/
  }

  .serach-keywords {
    width: 100%;
    height: auto;
    overflow: hidden;
    margin-bottom: 7.5px;
    color: @base_font_color;
    .h {
      padding: 0 10px;
      height: 45px;
      line-height: 45px;
      width: 100%;
      box-sizing: border-box;
      font-size: @font_size_28;
    }
    .b {
      width: 100%;
      height: auto;
      overflow: hidden;
      box-sizing: border-box;
    }
    &.search-hot {
      background: #fff;
      padding-left: 15px;
      .item {
        display: inline-block;
        box-sizing: border-box;
        width: auto;
        height: 30px;
        line-height: 30px;
        padding: 0 15px;
        background: #f2f2f2;
        margin: 0 10px 10px 0;
        font-size: @font_size_28;
        border-radius: 5px;

        &.active {
          color: @base_color;
          border: .5px solid @base_color;
        }
      }
    }
    &.search-history {
      .item {
        box-sizing: border-box;
        border-bottom: .5px solid @border_color_c;
        width: 100%;
        height: 45px;
        line-height: 45px;
        padding: 0 15px 0 20px;
        background: @white;
        font-size: @font_size_28;
        .clear-item {
          width: 35px;
          height: 35px;
          float: right;
          margin-top: 5px;
          image {
            float: right;
            width: 20px;
            height: 20px;
            margin-top: 7.5px;
          }
        }
      }
      .clear-history {
        width: 170px;
        background: @white;
        margin: 15px auto 0;
        text-align: center;
        font-size: @font_size_28;
        line-height: 30px;
        border: .5px solid @border_color_c;
        border-radius: 5px;
      }
    }

  }

  .serach-keywords .icon {
    margin-top: 10px;
    float: right;
    display: block;
    margin-left: 255px;
    height: 22.5px;
    width: 22.5px;
  }

  .shelper-list {
    width: 100%;
    height: auto;
    overflow: hidden;
    background: #fff;
    padding: 0 15.5px;
  }

  .shelper-list .item {
    height: 45px;
    width: 344px;
    line-height: 45px;
    font-size: @font_size_26;
    color: #333;
    border-bottom: 1px solid #f4f4f4;
  }

  .search-result-empty {
    width: 100%;
    padding-top: 150px;
  }

  .search-result-empty .icon {
    margin: 0 auto;
    display: block;
    width: 120px;
    height: 120px;
  }

  .search-result-empty .text {
    display: block;
    width: 100%;
    height: 20px;
    font-size: @font_size_28;
    text-align: center;
    color: #999;
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
        height: 186px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .l-msg {
        width: 100%;
        height: 88px;
        padding: 10px;
        box-sizing: border-box;
        .l-title {
          font-size: @font_size_30;
          color: @base_font_color;
          width: 100%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
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
</style>
