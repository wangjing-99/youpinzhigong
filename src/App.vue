<script>
  export default {
    mpType: 'app',
    onLaunch(e) {
      if (e.query && e.query.from_channel) {
        this.$store.commit('addFormChannel', e.query.from_channel)
      }
    }
  }
</script>

<style type="text/less" lang="less">
  page {
    height: 100%;
  }

  view[hidden] {
    display: none !important;
  }

  .zhanwei {
    height: 50px;
  }

  .container {
    width: 100%;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    box-sizing: border-box;
  }

  button.form_button {
    -webkit-transform: scale(0.5);
    transform: scale(1);
    content: '';
    background-color: transparent;
    border-radius: 0;
    text-align: left;
    padding: 0;
    margin: 0;
    display: inline;
    position: static;
    line-height: inherit;
    font-size: inherit;
    color: inherit;
    border: 0;

  }

  .lv1 {
    width: 54px;
    height: 16px;
    line-height: 16px;
    text-indent: -9999px;
    background: url(https://yxds.999d.com/static/m/image/level_v1.png) no-repeat center center;
    background-size: auto 16px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    margin: 0 5px;
  }

  .lv2 {
    width: 54px;
    height: 16px;
    line-height: 16px;
    text-indent: -9999px;
    background: url(https://yxds.999d.com/static/m/image/level_v2.png) no-repeat center center;
    background-size: auto 16px;
    display: inline-block;
    vertical-align: middle;
    overflow: hidden;
    margin: 0 5px;
  }

  button.form_button::after {
    content: '';
    width: 0;
    height: 0;
    -webkit-transform: scale(1);
    transform: scale(1);
    display: none;
    background-color: transparent;
  }


</style>
