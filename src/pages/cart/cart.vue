<template>
  <div class="cart">
    <tabBarNav></tabBarNav>
    <loginDialog v-if="loginShow" @closeLoginDialog="closeLoginDialog"></loginDialog>
    <div v-if="cartGoods.length > 0" class="cart-container">
      <scroll-view scroll-y="true" class="c-c-view" style="height: 100%">
        <div class="edit-item">
          <view class="delete" @click="editCart">{{!isEditCart ? '编辑' : '完成'}}</view>
        </div>
        <div class="list">
          <div :class="isEditCart ? 'edit item' : 'item'" v-for="(item, index) of cartGoods" :key="item.id">
            <div class="i-t">
              <div class="cart-checkbox">
                <i :class="item.selected==2 ? 'checked checkbox' : 'checkbox'" @click="checkedItem"
                   :data-cart="item">
                </i>
              </div>
              <div class="cart-goods">
                <a hover-class="none" :href="'/pages/goods/goods?id='+item.idcode" class="img">
                  <img :src="item['imgs'][0]"/>
                </a>
                <div class="info">
                  <a hover-class="none" :href="'/pages/goods/goods?id='+item.idcode" class="name">{{item.name}}</a>
                  <view class="name-desc">
                    {{item.color.name}} {{item.color.size.name}}
                  </view>
                  <view class="price-num">
                    <div class="price">
                      <span class="now-price">￥</span>{{item.color.size.price}}
                      <span v-if="item.color.size.price != item.color.size.org_price" class="org-price"><span
                        class="s-p">￥</span>{{item.color.size.org_price}}</span>
                    </div>
                    <div class="num">
                      <view class="selnum">
                        <view class="cut" @click="cutNumber" :data-cart="item">-</view>
                        <input :value="item.num" @blur="changeNum" :data-cart="item" class="number" type="number"/>
                        <view class="add" @click="addNumber" :data-cart="item">+</view>
                      </view>
                    </div>
                  </view>
                  <div v-if="item.promotions.etime" class='promotion'>
                    限时 {{item.promotions.etime}} 结束
                  </div>
                </div>
              </div>
            </div>
            <div class="i-b">
              小计：<span class="price"><span class="s-price">￥</span>{{item.total_price}}</span>
            </div>
          </div>
        </div>
        <!--<goodList v-if="like" :like="like"></goodList>-->
      </scroll-view>
    </div>
    <div v-else class="no-cart-content">
      <scroll-view scroll-y="true" style="height: 100%">
        <view class="no-cart" v-if="cartGoods.length <= 0">
          <view class="c">
            <img src="https://yxds.999d.com/static/m/image/ib_cart.png"/>
            <text>购物车为空，快去看看吧</text>
            <a open-type="redirect" href="/pages/index/index">去逛逛</a>
          </view>
        </view>
        <!--猜你喜欢-->
        <!--<goodList v-if="like" :like="like"></goodList>-->
      </scroll-view>
    </div>
    <div v-if="cartGoods.length > 0" class="price-container">
      <div class="e-checkbox">
        <i :class="checkedAllStatus ? 'checked checkbox' : 'checkbox'" @click="checkedAll"></i>
        全选
      </div>
      <view class="price">
        <block v-if="!isEditCart">
          <div class="promotion-price" v-if="(cartTotal.promotion_order_price + cartTotal.promotion_goods_price) > 0">
            优惠：<span><span class="s-price">￥</span>{{cartTotal.promotion_order_price + cartTotal.promotion_goods_price}}</span>
          </div>
          <div class="promotion-price">
            总价：<span><span class="s-price">￥</span>{{cartTotal.total_price}}</span>
          </div>
        </block>
      </view>
      <view class="checkout" @click="checkoutOrder" v-if="!isEditCart">结算</view>
      <view class="checkout blue" @click="deleteCart" v-else>删除</view>
    </div>
  </div>
</template>

<script>
  import api from '@/utils/api'
  import util from '@/utils/util'
  import user from '@/services/user'
  import wx from 'wx'
  import goodList from '@/components/goodList'
  import loginDialog from '@/components/loginDialog'
  import tabBarNav from '@/components/tabBarNav'

  export default {
    components: {
      goodList,
      loginDialog,
      tabBarNav
    },
    data() {
      return {
        like: [],
        loginShow: false,
        cartGoods: [],
        cartTotal: {
          total_price: 0,
          goods_total_price: 0,
          promotion_goods_price: 0,
          promotion_order_price: 0,
          discount: 0,
          cartProfuctNum: 0
        },
        isEditCart: false,
        checkedAllStatus: true
      }
    },
    // 每次打开触发，更新数据
    async onShow() {
      const isLogin = await user.checkLogin()
      if (!isLogin) user.redirectToLogin()
      if (user.checkBindPhone()) {
        this.loginShow = true
        return
      } else {
        this.loginShow = false
      }
      wx.hideShareMenu()
      this.getCartList()
    },
    methods: {
      // 请求购物车数据
      async getCartList() {
        util.showLoading()
        const res = await api.getCartList()
        util.hideLoading()
        if (res.code === 0) {
          this.like = res.data.rec_list
          if (res.data.data.products) {
            this.cartGoods = res.data.data.products
            this.cartTotal.total_price = parseFloat(res.data.data.total_price)
            this.cartTotal.goods_total_price = parseFloat(res.data.data.goods_total_price)
            this.cartTotal.promotion_goods_price = parseFloat(res.data.data.promotion_goods_price)
            this.cartTotal.promotion_order_price = parseFloat(res.data.data.promotion_order_price)
            this.cartTotal.discount = res.data.data.discount
            this.cartTotal.cartProfuctNum = res.data.cartProfuctNum
          } else {
            this.cartGoods = []
            this.cartTotal.total_price = 0
          }
        }
        this.checkedAllStatus = this.isCheckedAll()
      },
      // 判断购物车是否全选
      isCheckedAll() {
        return this.cartGoods.every(function (element, index, array) {
          return element.selected === '2'
        })
      },
      // 关闭登录弹框
      closeLoginDialog() {
        this.getCartList()
        this.loginShow = false
      },
      // checkbox的点击事件
      async checkedItem(event) {
        let cart = event.currentTarget.dataset.cart
        // 非编辑状态，发请求后台node进行计算
        const res = await api.CartChecked({
          cart_id: cart.cart_id,
          do: cart.selected === '1' ? 'set' : 'unset'
        });
        if (res.code === 0) {
          this.getCartList()
        } else {
          util.showToast(res.msg)
        }
        // this.checkedAllStatus = this.isCheckedAll();
      },
      changeNum(event) {
        let num = parseInt(event.target.value)
        console.log(num);
        let cart = event.currentTarget.dataset.cart
        if (num === parseInt(cart.num)) {
          return
        }
        if (num <= 0) {
          num = 1
        } else if (num >= cart.color.size.stork) {
          num = cart.color.size.stork
          util.showToast('库存不足')
        } else {
          if (!num) {
            num = cart.num
          }
        }
        this.updateCart(cart, num)
      },
      // 计算选中的商品数量
      getCheckedGoodsCount() {
        let checkedGoodsCount = 0;
        this.cartGoods.forEach(function (v) {
          if (v.checked === true) {
            checkedGoodsCount += v.number;
          }
        });
        // console.log('选中的商品数量', checkedGoodsCount);
        return checkedGoodsCount;
      },
      // 点击底部的“全选”
      async checkedAll() {
        // 非编辑状态，请求后台计算
        let productIds = this.cartGoods.map(function (v) {
          return v.cart_id;
        });
        const res = await api.CartChecked({
          cart_id: productIds.join(','),
          do: this.isCheckedAll() ? 'unset' : 'set'
        });
        if (res.code === 0) {
          this.getCartList()
        } else {
          util.showToast(res.msg)
        }
      },
      // 点击“编辑/完成”按钮
      editCart() {
        this.isEditCart = !this.isEditCart;
      },
      // 更新购物车数据，点击+或—触发
      async updateCart(cart, num) {
        const res = await api.CartUpdate({
          cart_id: cart.cart_id,
          sku: cart.color.size.sku,
          num: num,
          type: 'product',
          data: ''
        });
        if (res.code === 0) {
          this.getCartList()
        } else {
          this.getCartList()
          util.showToast(res.msg)
        }
      },
      // 减少数量
      async cutNumber(event) {
        let cart = event.currentTarget.dataset.cart
        let num = parseInt(cart.num)
        num--
        if (num <= 0) {
          const confirm = await util.showModal('确认删除这个商品？')
          if (confirm) {
            this.deleteProducts(cart.cart_id)
          }
          return
        }
        this.updateCart(cart, num)
      },
      // 增加数量
      addNumber(event) {
        let cart = event.currentTarget.dataset.cart
        let num = parseInt(cart.num)
        if (num >= cart.color.size.stork) {
          util.showToast('库存不足')
          return false
        }
        num++
        this.updateCart(cart, num);
      },
      // 点击“下单”，跳转到下单页
      checkoutOrder() {
        // 获取已选择的商品
        let checkedGoods = this.cartGoods.filter(function (element, index, array) {
          return element.selected === '2'
        })
        if (checkedGoods.length <= 0) {
          util.showErrorToast('未选择任何商品')
          return false;
        }
        wx.navigateTo({
          url: '../order/confirmOrder'
        })
      },
      async deleteProducts(productIds) {
        const res = await api.CartDelete({
          id: productIds
        })
        if (res.code === 0) {
          this.getCartList()
        } else {
          util.showToast(res.msg)
        }
      },
      // 点击“删除所选”
      deleteCart() {
        let productIds = this.cartGoods.filter(function (element, index, array) {
          return element.selected === '2'
        })
        if (productIds.length <= 0) return false
        productIds = productIds.map(function (element, index, array) {
          if (element.selected === '2') {
            return element.cart_id
          }
        })
        this.deleteProducts(productIds.join(','))
      }
    }
  }
</script>

<style lang="less" type="text/less">
  @import '../../../static/css/base';

  page {
    background: @content-back;
  }

  .cart {
    position: fixed;
    width: 100%;
    height: 100%;
    border-top: .5px solid @border_color_c;
  }

  .no-cart-content {
    position: absolute;
    border-top: .5px solid @border_color_c;
    top: 0;
    bottom: 44px;
    width: 100%;
    box-sizing: border-box;
    color: @base_font_color;
    .no-cart {
      padding-bottom: 30px;
      .c {
        width: 50%;
        margin: 75px auto 0;
        text-align: center;
        color: @aider_font_color;
        img {
          display: block;
          margin: 0 auto;
          width: 90px;
          height: 90px;
        }
        text {
          margin-top: 20px;
          font-size: @font_size_30;
          line-height: 70px;
        }
        a {
          border: 1px solid #cbcbcb;
          font-size: @font_size_30;
          width: 78px;
          line-height: 23px;
          border-radius: 5px;
          margin: 15px auto 0;
          background: #fff;
          color: @base_font_color;
        }
      }
    }
  }

  .checkbox {
    display: inline-block;
    height: 17px;
    width: 17px;
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA9CAMAAADGfvrlAAAAh1BMVEUAAACZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZnpOnTbAAAALHRSTlMA+kLaD/by5+HMCogUMAfVt3hbHe2inYA4r2YjwKmWU0sqBXPEuo5tYCEZvgPfqJYAAALMSURBVEjHxZfpkqIwFIVjgAACsi+yC4gb7/98k5tAOyoI6ZqqOT+6C8nnPXfhWqB/L7NOo6MtgZzC9U7NZjK7OFJAhh8pgar3yWELikMJwDft1O4ir6JHdViQYrdfcb/XpqOaE7VXqtQo9N0UPq+XzXv2eEw3cHaX+cG9eT+lBRmjl/cFNuaOd0V127/eaWTLlTj+sOZQOSIcxebc7YPfclyqZzrrMMuaN+8L8CxS4AhJm/c7nD0yU4t4qrLEvbfPS/alvb/WSZ3Ze3XusnxbeX36HqwbfxusmR13j9Z1O7P0bs9CMzOljLbIYofjn2sDEj7f0DZVGqSNp++CqyBBW+VCY4pxGkK4SA+bYTmEfl0R6ASBcx9tF5agZuZPiyskoh4GDUIfdAgM1RIMHUHxVMi4EYKbEiaFljii5VItJKaKwFAh1NF/4V0QzhygEAL7HhJVTKnuhqBRiTBcUcrGiNC/J2E4oYaDC6L1OmfC8CmnGytG8DyZwrAZQcUANvbC8N6ACf0vMPTKAbj/JXxGfAGJSjYm2BFv1T1k1VbokIhPWNbRPvcwnqQWhi2VTliKYBdchGHMN2gB5mXRYrvwYJgIyiZhQdjPKfUY15D7C9ckRsg8QrN88S5r8CC3g3DJToS5pkp09kslOptBOu4jwaytADYvQjy0UMF5lciU6GUQqdmeFSlvpikv4DLa9mA2tQIZP41i2L+Kuy1hWPS7kl88jQftli7pcFSXX7sOdCyvecYdHJSSz1U6KOH39X+4gufPR9g/DpBLV33rUa+yENfPxRININWwlsJ6Z3ZC8+amPSYsuD6Ly974DmDj+e579sBwO/Sy16DYfWj8XrFoLImUgZvvQtfDmU9lVanh2OPnUrs4hxD88XyfsbtHnue6FkwfkTL53sgsdXbDrNSyNldn91b19gepnF28hk65e3GRq4RzAbwl1bPT8wfTlXl9ZHTdywAAAABJRU5ErkJggg==) no-repeat;
    background-size: 100% 100%;
    vertical-align: -2.5px;
    &.checked {
      background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAAA9CAMAAADGfvrlAAAAM1BMVEUAAADyMDDyMDDyMDDyMDDyMDDyMDDyMDDyMDDyMDDyMDDyMDDyMDDyMDDyMDDyMDDyMDA/A+gRAAAAEHRSTlMAz2CAEO8wIL/fUECvn49wucSDhwAAAapJREFUSMeUk9uWgCAIRUHM1C7j/3/tTMQaKizqvLRMN4eLQl9joIyNhZnCCK+V1tIuKmt6hQZsXWHwUTU1Ks94ymq0UJ3+VGnRVPJD8tREc4hwUAxzE9ENGuXEQGOn/TRI3NidDgoab2ILjp3Qad/KDyMd8x4+mY1BS/KaMlwMIvLfCo4qe+C5srmfz111s0lHWZ+mww8upcIrVT6sRtntlUkzgyjoypN6BVnwW3CerBlrORgTfBCpNW6djl/guFnjf6vJB35O1tLw1a1YruByqHpjVmnX/IJtO603skiQ4LObJjhNd9w/0WUvFpHXXDt+ZGVEBFmL8VnVwpeSQ3xmJWHznlJJLitvi+Hp/F6H5LIwWZjZprSyLiynlVbWgy2t7BNcoUMb1jZMR2Xo39LLHAdgEAaCDSCS/z84TaQtBgtZQz8V3gssvipHAhosjiTnCRoszjPCAE0WwjhLcjw1G0lWZrBmycYMfhsaBxosbKg2wPVevHcZ61Wmn7iZ7bhRQWciVoW7qxV5u1dotqpSpsS5+uiLa78y7yHKupkJdqD4aeRHmZiD8n3SUzWKXIpaagAAAABJRU5ErkJggg==) no-repeat;
      background-size: 100% 100%;
    }
  }

  .cart-container {
    position: absolute;
    border-top: .5px solid @border_color_c;
    top: 0;
    bottom: 94px;
    width: 100%;
    box-sizing: border-box;
    color: @base_font_color;
    .edit-item {
      height: 40px;
      padding: 0 10px;
      border-bottom: .5px solid @border_color_c;
      background: @white;
      font-size: @font_size_30;
      margin-top: 7.5px;
      text-align: right;

      .delete {
        line-height: 40px;
      }
    }
    .list {
      .item {
        background: @white;
        margin-bottom: 7.5px;
        border-bottom: .5px solid @border_color_c;
        .i-t {
          padding: 10px;
          display: flex;
          border-bottom: .5px solid @border_color_c;
          .cart-checkbox {
            width: 47px;
            text-align: center;
            .checkbox {
              display: inline-block;
              margin-top: 31px;
            }
          }
          .cart-goods {
            flex: 1;
            display: flex;
            .img {
              width: 80px;
              height: 80px;
              margin-right: 10px;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .info {
              font-size: @font_size_28;
              flex: 1;
              .name {
                font-size: @font_size_30;
                line-height: 25px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
              }
              .name-desc {
                color: @aider_font_color;
                line-height: 20px;
              }
              .price-num {
                display: flex;
                align-items: flex-end;
                .price {
                  flex: 1;
                  color: @aider_color2;
                  font-size: @font_size_35;
                  margin-top: 15px;
                  .now-price {
                    font-size: @font_size_26;
                  }
                  .org-price {
                    font-size: @font_size_26;
                    color: @aider_font_color;
                    text-decoration: line-through;
                    .s-p {
                      font-size: @font_size_24;
                    }
                  }
                }
                .num {
                  vertical-align: bottom;
                  .selnum {
                    height: 28px;
                    display: flex;
                    overflow: hidden;
                    .cut {
                      width: 28px;
                      height: 100%;
                      text-align: center;
                      line-height: 25px;
                      background: #f4f4f4;
                      color: #b8b8b8;
                      border-radius: 5px 0 0 5px;
                    }
                    .number {
                      flex: 1;
                      width: 30px;
                      height: 100%;
                      background: #f4f4f4;
                      color: @base_font_color;
                      text-align: center;
                      line-height: 22px;
                      margin: 0;
                      padding: 0;
                      border-right: 2px solid #fff;
                      border-left: 2px solid #fff;
                    }
                    .add {
                      width: 28px;
                      height: 100%;
                      text-align: center;
                      line-height: 24px;
                      background: #f4f4f4;
                      color: #b8b8b8;
                      border-radius: 0 5px 5px 0;
                    }
                  }

                }
              }
              .promotion {
                background: #fbe9e9;
                color: @aider_color2;
                font-size: @font_size_26;
                display: inline-block;
                padding: 0 10px;
                margin-top: 14px;
              }

            }
          }
        }
        .i-b {
          padding: 0 10px;
          text-align: right;
          line-height: 40px;
          font-size: @font_size_30;
          .price {
            color: @aider_color2;
            font-size: @font_size_35;
            font-weight: bold;
            .s-price {
              font-size: @font_size_24;
            }
          }
        }

      }
    }
  }

  .price-container {
    position: absolute;
    bottom: 44px;
    left: 0;
    width: 100%;
    height: 50px;
    background: @white;
    display: flex;
    .e-checkbox {
      line-height: 50px;
      color: @base_font_color;
      font-size: @font_size_30;
      padding-left: 15px;
    }
    .price {
      flex: 1;
      color: @aider_color2;
      font-size: @font_size_35;
      line-height: 50px;
      text-align: right;
      padding-right: 12px;
      font-weight: bold;
      display: flex;
      flex-direction: column;
      justify-content: center;
      .promotion-price {
        line-height: 20px;
        .s-price {
          font-size: @font_size_28;
        }
      }

    }
    .checkout {
      width: 128.5px;
      text-align: center;
      line-height: 50px;
      color: #fff;
      font-size: @font_size_35;
      background: @base_color;
      &.blue {
        background: @aider_color1;
      }
    }
  }

</style>
