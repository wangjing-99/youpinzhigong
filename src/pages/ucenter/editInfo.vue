<template>
  <view class="container">
    <region :isDialog="isDialog" @completeRegion="completeRegion"></region>
    <view class="viewport">
      <view class="item">
        <view class="item-left">头像</view>
        <view @click="uploadHeadPhoto" class="item-right">
          <view class="r-l">
            <image class="head-img" :src="data.img?data.img:'/static/images/my/default_user.png'"></image>
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </view>

      <a hover-class="none" :href="'/pages/ucenter/editItem?type=name&title=修改昵称&text='+data.name" class="item">
        <view class="item-left">昵称</view>
        <view class="item-right">
          <view class="r-l">
            {{data.name}}
          </view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </a>

      <view class="item">
        <view class="item-left">性别</view>
        <view class="item-right">
          <picker class="r-l" :value="sexindex" :range="sexSele" @change="changSex" mode="selector">
            <view class="picker"> {{sexSele[sexindex]}}</view>
            <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
          </picker>
        </view>
      </view>

      <view class="item">
        <view class="item-left">生日</view>
        <view class="item-right">
          <picker class="r-l" mode="date" :value="data.birthData" start="1950-01-01" end="2016-01-01"
                  @change="changData">
            <view class="picker"> {{birthData}}</view>
            <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
          </picker>
        </view>
      </view>

      <view class="item">
        <view class="item-left">手机号</view>
        <view class="item-right">
          <view class="r-l">{{data.mobile}}</view>
          <view class="i-right"></view>
        </view>
      </view>

      <a hover-class="none" :href="'/pages/ucenter/editItem?type=real_name&title=修改真实姓名&text='+data.bank_real_name"
         class="item">
        <view class="item-left">真实姓名</view>
        <view class="item-right">
          <view class="r-l">{{data.bank_real_name}}</view>
          <image src="/static/images/i_ar_h_right.png" class="i-right"></image>
        </view>
      </a>

      <view @click="chooseRegion" class="item">
        <view class="item-left">所属地区</view>
        <view class="item-right">
          <view class="r-l">{{data.areas_name?data.areas_name:'省、市、区'}}</view>
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
  import region from '@/components/region'

  export default {
    components: {
      region
    },
    data() {
      return {
        data: {},
        isDialog: false,
        sexSele: ['保密', '男', '女'],
        sexindex: 0,
        birthData: '2016-01-01',
        headPhoto: ''
      }
    },
    onShow() {
      this.getUserIndex()
    },
    mounted() {
      // this.getJsonAreas()
    },
    methods: {
      async getUserIndex() {
        util.showLoading()
        const res = await api.getUserIndex()
        util.hideLoading()
        if (res.code === 0) {
          this.data = res.data.data
          this.birthData = this.data.birthday
          this.sexindex = parseInt(this.data.sex) - 1
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
      changSex(e) {
        this.sexindex = e.target.value;
        this.submit({
          sex: parseInt(this.sexindex) + 1,
          type: 'sex'
        })
      },
      async submit(obj) {
        const res = await api.editmyinfoAction(obj)
        if (res.code === 0) {
          if (this.headPhoto) {
            this.data.img = this.headPhoto
          }
          util.showToast('修改成功')
        } else {
          util.showToast(res.msg)
        }
      },
      changData: function (e) {
        this.birthData = e.target.value
        this.submit({
          birthday: this.birthData,
          type: 'birthday'
        })
      },
      changAds: function (e) {
        this.ads = e.target.value;
      },
      async getJsonAreas() {
        const res = await api.getJsonAreas({
          isnew: 1
        })
        if (res.code === 0) {
          this.objectMultiArray = res.data
          console.log(res)
        } else {
          util.showToast(res.msg)
        }
      },
      chooseRegion() {
        this.isDialog = true
      },
      completeRegion(res) {
        if (res) {
          this.submit({
            type: 'cityids',
            cityids: res.areaIds
          })
          this.data.areas_name = res.fullRegion
        }
        this.isDialog = false
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
