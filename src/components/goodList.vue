<template>
  <div class="c-goodlist">
    <div class="like-title">
      <i></i>
      <div class="l-t">你可能还喜欢</div>
      <b></b>
    </div>
    <div class="like-content">
      <div class="list" v-for="item of like" :key="item.id">
        <div class="pic">
          <a hover-class="none" :href="'/pages/goods/goods?id='+item.idcode"><img
            :src="item.img"></a>
        </div>
        <div class="txt">
          <div class="title">
            <h3>{{item.name}}</h3>
          </div>
          <div class="info">
            <span class="price"><span>￥</span>{{item.price}}</span> <span class="oldprice">￥{{item.price_tag}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      like: {
        type: Array,
        default() {
          return []
        }
      }
    }
  }
</script>

<style lang="less" type="text/less" scoped>
  @import "../../static/css/base";

  .c-goodlist {
    width: 100%;
    .like-content {
      padding: 10px 5px 0;
      .list {
        width: 50%;
        height: auto;
        float: left;
        margin: 0 0 10px;
        .pic {
          height: 170px;
          margin: 0 5px;
          background: rgb(238, 238, 238);
          overflow: hidden;
          img {
            width: 100%;
            height: 170px;
          }
        }
        .txt {
          padding: 10px;
          margin: 0 5px;
          background: rgb(255, 255, 255);
          .title {
            height: 36px;
            line-height: 18px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            text-overflow: ellipsis;
            overflow: hidden;
            font-style: normal;
            font-size: @font_size_28;
          }
          .info {
            line-height: 30px;
            .price {
              font-size: @font_size_40;
              color: @aider_color2;
              span {
                font-size: @font_size_24;
              }
            }
            .oldprice {
              font-size: @font_size_28;
              color: @aider_font_color;
              text-decoration: line-through;
              margin-left: 10px;
            }
          }
        }
      }
    }

    .like-title {
      width: 100%;
      padding: 20px 0;
      text-align: center;
      i, b {
        width: 30px;
        display: inline-block;
        vertical-align: middle;
        padding: 1px 0;
        border-bottom: 1px solid rgb(203, 203, 203);
      }
      .l-t {
        display: inline-block;
        color: @aider_font_color;
        font-size: @font_size_30;
        font-weight: normal;
        vertical-align: middle;
        padding: 0 20px;
      }
    }
  }



</style>
