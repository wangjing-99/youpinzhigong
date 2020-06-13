<template>
  <div class="container">
    <ul v-if="addressList.length>0">

      <!--id="li_add_0" -->
      <li v-for="item in addressList" :key="index" :id="'li_add_'+item.id">
        <div @click="selectAddress(item.id_code)" class="addr">
          <h3>
            <span class="name owt">{{item.accept_name}}</span>
            <span class="mob">{{item.mobile}}</span>
          </h3>
          <p>
            <img src="/static/images/my/i_location.png" alt="">
            {{item.province_name}}{{item.city_name}}{{item.area_name}}{{item.address}}
          </p>
        </div>
        <div class="operate">
          <div class="select" @click="setDefault(item.id);">
            <img src="/static/images/my/ic_select.png" v-if="item.is_default==1">
            <img src="/static/images/my/ic_select_a.png" v-if="item.is_default==2">
            <span>默认地址</span>
          </div>
          <span class="btn_sc" @click="delAddress([item.id,item.is_default])">删除</span>
          <navigator hover-class="none" :url="'/pages/ucenter/reviseAdd?id='+item.id" class="btn_sc">编辑</navigator>
        </div>
      </li>
    </ul>
    <view class="add-address" @click="addressAddOrUpdate" data-address-id="0">
      添加新地址
    </view>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'
  import wx from 'wx'

  export default {
    data() {
      return {
        addressList: []
      }
    },
    onShow: function () {
      this.getAddressList()
    },
    async mounted() {
      wx.hideShareMenu()
    },
    methods: {
      // 设置默认地址
      async setDefault(e) {
        util.showLoading();
        const res = await api.setDefault({address: e});
        if (res.code === 0) {
          this.getAddressList()
        } else {
          util.showToast(res.msg)
        }
      },
      async getAddressList() {
        util.showLoading()
        const res = await api.getAddressList()
        util.hideLoading()
        if (res.code === 0) {
          this.addressList = res.data.data
        } else {
          util.showToast(res.msg)
        }
      },
      selectAddress(id) {
        if (this.$route.query.act === 'order') {
          this.$store.commit('updateAddress', id)
          util.goBack()
        }
      },
      async delAddress(e) {
        const confirm = await util.showModal('确定要删除地址？')
        if (confirm) {
          util.showLoading()
          const res = await api.deleteAddress({address: e[0]})
          util.hideLoading()
          if (res.code === 0) {
            if (e[1] === '2' && this.addressList.length > 1) {
              this.setDefault(this.addressList[1].id)
            } else {
              this.getAddressList()
            }
          } else {
            util.showToast(res.msg)
          }
        }
      },
      // 点击修改，或者点击底部“新建”
      addressAddOrUpdate(event) {
        wx.navigateTo({
          url: '../ucenter/addressAdd'
        })
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../static/css/base";

  .container {
    height: 100%;
    width: 100%;
    background: @content-back;
  }

  .add-address {
    position: fixed;
    box-sizing: border-box;
    bottom: 10px;
    left: 10.5px;
    width: 354px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    border: 0;
    color: #fff;
    font-size: 16px;
    background: @aider_color1;

  }

  ul {
    width: 100%;
    padding-bottom: 60px;
    li {
      background: #fff;
      border-bottom: 0.5px @border_color_c solid;
      margin-top: 7.5px;
      .addr {
        padding: 20px;
        color: @base_font_color;
        h3 {
          height: 30px;
          line-height: 30px;
          font-size: @font_size_35;
          display: flex;
          justify-content: space-between;
          .name {
            max-width: 50%;
          }
        }
        p {
          font-size: @font_size_30;
          img {
            width: 30px;
            height: 30px;
            vertical-align: -8px;
          }
        }
      }
      .operate {
        padding: 10px 15px;
        border-top: 0.5px solid @border_color_c;
        .select {
          color: @base_font_color;
          font-size: 14px;
          display: inline-block;
          img {
            width: 22px;
            height: 22px;
            margin-right: 2px;
          }
          span {
            line-height: 22px;
            vertical-align: 5px;
          }
        }
        .btn_sc {
          background: @white;
          border: .5px @border_color_c solid;
          border-radius: 5px;
          padding: 0 25px;
          font-size: @font_size_28;
          height: 22px;
          line-height: 22px;
          color: @base_font_color;
          display: inline-block;
          text-align: center;
          float: right;
          margin-left: 10px;
        }
      }
    }
    .active {
      .operate .select {
      }
    }
  }
</style>
