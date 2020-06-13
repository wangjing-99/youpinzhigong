<template>
  <view class="container">
  </view>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'

  export default {
    data() {
      return {
        moreStutas: false
      }
    },
    async mounted() {
      console.log(this.$route.query)
      const res = await api.jumpRouter({
        shop: this.$store.state.shop,
        url: this.$route.query.q
      })
      console.log(res)
      if (res.code === 0) {
        if (res.data.shop_code && res.data.product_idcode) {
          util.redirect(`/pages/goods/goods?id=${res.data.product_idcode}&shop=${res.data.shop_code}`)
        } else if (res.data.shop_code && !res.data.product_idcode) {
          util.redirect(`/pages/index/index?shop=${res.data.shop_code}`)
        } else {
          util.redirect(`/pages/index/index`)
        }
      } else {
        util.showToast(res.msg)
      }
    },
    methods: {}
  }
</script>

<style type="text/less" lang="less">
</style>
