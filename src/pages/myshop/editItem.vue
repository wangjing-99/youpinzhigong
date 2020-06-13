<template>
  <div class="container edititem">

    <div class="input">
      <input focus="true" type="text" v-model="text">
    </div>
    <div @click="submit" class="submit">确定</div>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        text: '',
        type: 'shopinfo'
      }
    },
    mounted() {
      this.text = this.$route.query.text
      this.name = this.$route.query.name
      this.type = this.$route.query.type
      wx.setNavigationBarTitle({
        title: this.$route.query.title
      })
      // this.getJsonAreas()
    },
    methods: {
      async submit() {
        const type = this.type
        let obj
        if (type === 'shopname') {
          obj = {
            name: this.text,
            type: this.type
          }
        } else if (type === 'shopinfo') {
          obj = {
            info: this.text,
            type: this.type
          }
        }
        const res = await api.edityMyshop(obj)
        if (res.code === 0) {
          util.goBack()
        } else {
          util.showToast(res.msg)
        }
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../../static/css/base";

  .container {
    background: @content-back;
  }

  .edititem {
    font-size: @font_size_30;
    color: @base_font_color;
    .submit {
      box-sizing: border-box;
      width: 354px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      color: #fff;
      margin: 10px auto 0;
      background: @aider_color1;
    }
    .input {
      margin-top: 7.5px;
      line-height: 20px;
      width: 100%;
      background: @white;
      overflow: hidden;
      input {
        padding: 10px;
      }
    }
  }
</style>
