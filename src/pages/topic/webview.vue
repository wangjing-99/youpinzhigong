<template>
  <web-view :src="url">
  </web-view>
</template>

<script type="text/ecmascript-6">
  export default {
    data() {
      return {
        url: 'https://yxds.999d.com'
      }
    },
    onLoad() {
      const index = this.$route.query.index
      if (index) {
        const carouselData = this.$store.state.carouselData
        const shop = wx.getStorageSync('shop')
        this.url = carouselData[index].img_url + '&shop=' + shop + '#wechat_redirect'
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
</style>
