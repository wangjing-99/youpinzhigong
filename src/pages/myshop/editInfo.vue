<template>
  <view class="container">
    <region :isDialog="isDialog" @completeRegion="completeRegion"></region>
    <view class="viewport">
      <a hover-class="none" :href="'/pages/myshop/editItem?type=shopname&title=修改店名&text='+data.shopname" class="item">
        <view class="item-left">店名</view>
        <view class="item-right">
          <view class="r-l">
            {{data.shopname}}
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </a>
      <a hover-class="none" :href="'/pages/myshop/editItem?type=shopinfo&title=修改店铺简介&text='+data.shopinfo" class="item">
        <view class="item-left">店铺简介</view>
        <view class="item-right">
          <view class="r-l">
            {{data.shopinfo}}
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </a>

      <view class="item">
        <view class="item-left">头像</view>
        <view @click="uploadHeadPhoto" class="item-right">
          <view class="r-l">
            <image class="head-img" :src="data.shoplogo?data.shoplogo:'/static/images/my/default_shop.png'"></image>
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </view>

    </view>
    <!--<button class="submit">保存</button>-->
  </view>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'
  export default {
    data() {
      return {
        data: {},
        headPhoto: ''
      }
    },
    onShow() {
      this.getMyshopMessage()
    },
    mounted() {
      // this.getJsonAreas()
    },
    methods: {
      async getMyshopMessage() {
        util.showLoading()
        const res = await api.getMyshopMessage()
        util.hideLoading()
        if (res.code === 0) {
          this.data = res.data
        } else {
          util.showToast(res.msg)
        }
      },
      uploadHeadPhoto() {
        const _this = this
        wx.chooseImage({
          success: function (res) {
            _this.headPhoto = res.tempFilePaths[0]
            wx.uploadFile({
              url: api.UploadImgs,
              filePath: res.tempFilePaths[0],
              header: {
                'content-type': 'multipart/form-data'
              },
              name: 'file',
              formData: {},
              success: function (res) {
                res = JSON.parse(res.data);
                if (res.code === 0) {
                  _this.submit({
                    head: res.data[0].path,
                    type: 'head'
                  })
                } else {
                  util.showToast(res.msg)
                }
              }
            })
          }
        })
      },
      async submit(obj) {
        const res = await api.edityMyshop(obj)
        if (res.code === 0) {
          if (this.headPhoto) {
            this.data.shoplogo = this.headPhoto
          }
          util.showToast('修改成功')
        } else {
          util.showToast(res.msg)
        }
      }
    }
  }
</script>

<style scoped lang="less" type="text/less">
  @import "../../../static/css/base";

  .container {
    background: @content-back;
    width: 100%;
  }

  .viewport {
    width: 100%;
    margin-top: 8px;
    background: @white;
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
        width: 80px;
      }
      .item-right {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .r-l {
          text-align: right;
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

  .submit {
    width: 80%;
    height: 50px;
    line-height: 50px;
    margin-top: 20px;
    font-size: @font_size_30;
    color: @white;
    background: @button_color3;
  }

</style>
