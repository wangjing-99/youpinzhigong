<template>
  <view class="container">
    <view class="add-address">
      <view class="add-form">
        <view class="form-item">
          <input class="input" @input="bindinputName" placeholder="请输入收货人姓名" :value="address.accept_name" auto-focus/>
        </view>
        <view class="form-item">
          <input class="input" @input="bindinputMobile" :value="address.accept_phone" placeholder="请输入手机号码"/>
        </view>
        <view @click="isDialog=true" class="form-item">
          <input class="input" :value="address.full_region" disabled="true" placeholder="省、市、区"/>
          <view class="select-address">请选择
            <image class="icon-arrow" src="/static/images/i_ar_h_right.png" alt=""></image>
          </view>
        </view>
        <view class="form-item">
          <textarea class="textarea" @input="bindinputAddress" :value="address.address"
                    placeholder="请输入详细地址, 如街道、楼盘号等"></textarea>
        </view>
        <view class="form-item form-default" @click="bindIsDefault">
          <view class="f-l">设为默认地址</view>
          <view class="f-r">
            <img src="/static/images/my/ic_select.png" v-if="address.is_default===1">
            <img src="/static/images/my/ic_select_a.png" v-if="address.is_default===2">
          </view>
        </view>
      </view>

      <view class="btns" @click="saveAddress">
        保存地址
      </view>
      <region :isDialog="isDialog" @completeRegion="completeRegion"></region>
    </view>
    <view class="bg-mask" @click="cancelSelectRegion" v-if="openSelectRegion"></view>
  </view>
</template>

<script>
  import api from '@/utils/api'
  import wx from 'wx'
  import util from '@/utils/util'
  import region from '@/components/region'

  export default {
    components: {
      region
    },
    data() {
      return {
        address: {
          accept_name: '',
          accept_phone: '',
          cityids: '',
          address: '',
          is_default: 2,
          full_region: ''
        },
        isDialog: false,
        addressId: 0,
        regionType: 1,
        regionList: [],
        selectRegionDone: false
      }
    },
    async mounted() {
    },
    methods: {
      completeRegion(res) {
        if (res) {
          this.address.full_region = res.fullRegion
          this.address.cityids = res.areaIds
        }
        this.isDialog = false
      },
      // 获得输入的电话号码
      bindinputMobile(event) {
        // console.log('输入的电话号码', event);
        let address = this.address;
        address.accept_phone = event.target.value;
        this.address = address;
      },
      // 获得输入的收货人姓名
      bindinputName(event) {
        // console.log('输入的收货人姓名', event);
        let address = this.address;
        address.accept_name = event.target.value;
        this.address = address;
      },
      // 获得输入的地址
      bindinputAddress(event) {
        // console.log('输入的地址', event);
        let address = this.address;
        address.address = event.target.value;
        this.address = address;
      },
      // 设置是否为默认地址
      bindIsDefault() {
        // console.log('点击，设置默认地址', this.address); = !address.is_default
        let address = this.address;
        address.is_default = address.is_default === 1 ? 2 : 1;
        this.address = address;
      },
      // 点击底部“取消按钮”退出本页面
      cancelAddress() {
        wx.navigateTo({
          url: '../ucenter/address'
        })
      },
      // 点击底部“保存按钮”保存地址
      async saveAddress() {
        let address = this.address;
        if (address.accept_name === '') {
          util.showErrorToast('请输入姓名')
          return false
        }
        if (address.accept_phone === '') {
          util.showErrorToast('请输入手机号码')
          return false
        } else {
          let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/
          if (!reg.test(address.accept_phone)) {
            util.showToast('请输入正确的手机号码')
            return false;
          }
        }
        if (address.cityids === '') {
          util.showErrorToast('请输入省市区')
          return false;
        }
        if (address.address === '') {
          util.showErrorToast('请输入详细地址')
          return false;
        }
        const res = await api.addAddress({
          id: address.id,
          accept_name: address.accept_name, // 用户名
          accept_phone: address.accept_phone, // 用户电话
          cityids: address.cityids, // 省id，市id，县id
          address: address.address, // 详细地址
          is_default: address.is_default // 是否默认
        })
        if (res.code === 0) {
          util.goBack()
        }
      }
    },
    onUnload() {
      this.address = {
        accept_name: '',
        accept_phone: '',
        cityids: '',
        address: '',
        is_default: 2,
        full_region: ''
      }
      this.isDialog = false
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../static/css/base";

  .container {
    background: @content-back;
    width: 100%;
    height: 100%;
  }

  .add-address {
    margin-top: 7.5px;
    background: #fff;
    width: 100%;
    .add-form {
      width: 100%;
      height: auto;
    }
    .form-item {
      padding: 20px 15px;
      border-bottom: .5px solid @border_color_c;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: @font_size_30;
      color: @base_font_color;
      input {
        flex: 1;
      }
      .select-address {
        color: @aider_font_color;
        vertical-align: middle;
        image {
          width: 25px;
          height: 25px;
          vertical-align: -7.5px;
          /*margin-top: 12.5px;*/
        }
      }
      .textarea {
        width: 100%;
        height: 70px;
      }
      &.form-default {
        .f-l {
          flex: 1;
          text-align: left;
        }
        .f-r {
          img {
            width: 22px;
            height: 22px;
            margin-right: 2px;
          }
        }
      }
    }
  }

  .add-address .btns {
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

  .add-address .cannel, .add-address .save {
    flex: 1;
    height: 50px;
    text-align: center;
    line-height: 50px;
    font-size: @font_size_28;
    color: #fff;
    border: none;
    border-radius: 0;
  }

  .add-address .cannel {
    background: #333;
  }

  .add-address .save {
    background: #b4282d;
  }

  .region-select {
    width: 100%;
    height: 300px;
    background: #fff;
    position: fixed;
    z-index: 10;
    left: 0;
    bottom: 0;
  }

  .region-select .hd {
    height: 35px;
    width: 92%;
    border-bottom: .5px solid #f4f4f4;
    padding: 10px 15px 0 15px;
    font-size: @font_size_30;
  }

  .region-select .region-selected {
    float: left;
    height: 30px;
    display: flex;
  }

  .region-select .region-selected .item {
    max-width: 70px;
    margin-right: 15px;
    text-align: left;
    line-height: 30px;
    height: 100%;
    color: #333;
    font-size: @font_size_28;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .region-select .region-selected .item.disabled {
    color: #999;
  }

  .region-select .region-selected .item.selected {
    color: #b4282d;
  }

  .region-select .done {
    float: right;
    height: 30px;
    width: 30px;
    border: none;
    background: #fff;
    line-height: 30px;
    text-align: center;
    color: #333;
    font-size: @font_size_28;
  }

  .region-select .done.disabled {
    color: #999;
  }

  .region-select .bd {
    height: 246px;
    width: 100%;
    padding: 0 15px;
    overflow-y: auto;
  }

  .region-select .region-list {
    height: auto;
    overflow: scroll;

  }

  .region-select .region-list .item {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: left;
    color: #333;
    font-size: @font_size_28;
  }

  .region-select .region-list .item.selected {
    color: #b4282d;
  }

  .bg-mask {
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 8;
  }

</style>
