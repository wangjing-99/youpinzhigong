import request from './request'
// const BaseUrl = 'http://yxds.i999d.cn:8809/xcx/'
// const BaseUrl = 'https://testyxds.999d.com/xcx/'
// const BaseUrl = 'http://yxds.i999d.cn:8805/yxzg/'
const BaseUrl = 'https://yxds.999d.com/yxzg/'
// const BaseUrl = 'http://yxds.i999d.cn:8807/yxzg/'
const api = {
  // 首页数据接口
  getIndexInfo: (paramObj) => request.get('/index/buys', paramObj, {
    baseURL: BaseUrl
  }),
  bindShop: (paramObj) => request.get('jump/bind', paramObj, {
    baseURL: BaseUrl
  }),
  jumpRouter: (paramObj) => request.get('jump/router', paramObj, {
    baseURL: BaseUrl
  }),
  // 店主首页
  getShopIndexInfo: (paramObj) => request.get('/index/index', paramObj, {
    baseURL: BaseUrl
  }),
  // 获得商品的详情
  getGoodsDetail: (paramObj) => request.get('/product/info', paramObj, {
    baseURL: BaseUrl
  }),
  // 绑定手机号
  bindPhone: (paramObj) => request.post('passport/bindMobile', paramObj, {
    baseURL: BaseUrl
  }),
  // 获取手机验证码
  getPhoneNumber: (paramObj) => request.post('passport/xcxSmscode', paramObj, {
    baseURL: BaseUrl
  }),
  // 添加商品到购物车
  CartAdd: (paramObj) => request.post('cart/addProduct', paramObj, {
    baseURL: BaseUrl
  }),
  // 下单前信息确认
  CartCheckout: (paramObj = {}) => request.get('order/confirmOrder', paramObj, {
    baseURL: BaseUrl
  }),
  // 获取购物车的数据
  getCartList: (paramObj = {}) => request.post('cart/index', paramObj, {
    baseURL: BaseUrl
  }),
  // 选择或取消选择商品
  CartChecked: (paramObj = {}) => request.post('cart/selected', paramObj, {
    baseURL: BaseUrl
  }),
  // 删除购物车的商品
  CartDelete: (paramObj = {}) => request.post('cart/delFromCart', paramObj, {
    baseURL: BaseUrl
  }),
  // 更新购物车的商品
  CartUpdate: (paramObj = {}) => request.post('cart/updateCart', paramObj, {
    baseURL: BaseUrl
  }),
  // 个人中心
  getUserIndex: (paramObj = {}) => request.post('user/index', paramObj, {
    baseURL: BaseUrl
  }),
  // 我的优惠券
  getMyCoupon: (paramObj = {}) => request.post('user/myCoupon', paramObj, {
    baseURL: BaseUrl
  }),
  // 收货地址列表
  getAddressList: (paramObj = {}) => request.post('address/orderAddressList', paramObj, {
    baseURL: BaseUrl
  }),
  // 添加新地址
  addAddress: (paramObj = {}) => request.post('address/addAddress', paramObj, {
    baseURL: BaseUrl
  }),
  // 添加修改
  getUpdateaddres: (paramObj = {}) => request.post('address/getUpdateaddres', paramObj, {
    baseURL: BaseUrl
  }),
  // 修改地址
  updateAddress: (paramObj = {}) => request.post('address/updateAddress', paramObj, {
    baseURL: BaseUrl
  }),
  // 删除地址
  deleteAddress: (paramObj = {}) => request.post('address/deleteAddress', paramObj, {
    baseURL: BaseUrl
  }),
  // 设置默认地址
  setDefault: (paramObj = {}) => request.post('address/setDefaultAddress', paramObj, {
    baseURL: BaseUrl
  }),
  getOrderPayMsg: (paramObj = {}) => request.get('wxpay/orderpay', paramObj, {
    baseURL: BaseUrl
  }),
  // 订单列表
  getMyOrder: (paramObj = {}) => request.get('order/getMyOrder', paramObj, {
    baseURL: BaseUrl
  }),
  // 获取区域列表
  getRegionList: (paramObj) => request.get('address/getXcxAddress', paramObj, {
    baseURL: BaseUrl
  }),
  // 获取地址信息
  getJsonAreas: (paramObj = {}) => request.post('user/getJsonAreas', paramObj, {
    baseURL: BaseUrl
  }),
  // 编辑信息
  editmyinfoAction: (paramObj = {}) => request.post('user/editmyinfo', paramObj, {
    baseURL: BaseUrl
  }),
  // http://yxds.i999d.cn:8809/xcx/address/getXcxAddress?id=148&level=3
  // 获取地址
  getXcxAddress: (paramObj = {}) => request.post('address/getXcxAddress', paramObj, {
    baseURL: BaseUrl
  }),
  // 提交订单
  OrderSubmit: (paramObj = {}) => request.post('order/createorder', paramObj, {
    baseURL: BaseUrl
  }),
  // 订单详情
  OrderInfo: (paramObj = {}) => request.post('order/info', paramObj, {
    baseURL: BaseUrl
  }),
  // 优惠券兑换
  CouponExchange: (paramObj = {}) => request.post('user/mycoupon', paramObj, {
    baseURL: BaseUrl
  }),
  // 查物流
  ExpressInfo: (paramObj = {}) => request.post('order/expressInfo', paramObj, {
    baseURL: BaseUrl
  }),
  // 更改订单状态
  changOrder: (paramObj = {}) => request.post('order/status', paramObj, {
    baseURL: BaseUrl
  }),
  // 搜索
  getGoodsList: (paramObj = {}) => request.get('shopproduct/list', paramObj, {
    baseURL: BaseUrl
  }),
  // 售后页面
  afterSales: (paramObj = {}) => request.get('order/afterSales', paramObj, {
    baseURL: BaseUrl
  }),
  // 售后退款详情
  refundInfo: (paramObj = {}) => request.get('order/refundInfo', paramObj, {
    baseURL: BaseUrl
  }),
  // 售后退货详情
  returnInfo: (paramObj = {}) => request.get('order/returnInfo', paramObj, {
    baseURL: BaseUrl
  }),
  // 退货页面
  applyReturnPage: (paramObj = {}) => request.get('order/applyReturnPage', paramObj, {
    baseURL: BaseUrl
  }),
  // 退款页面
  applyRefundPage: (paramObj = {}) => request.get('order/applyRefundPage', paramObj, {
    baseURL: BaseUrl
  }),
  // 退货提交
  applyReturn: (paramObj = {}) => request.post('order/applyReturn', paramObj, {
    baseURL: BaseUrl
  }),
  // 退款提交
  applyRefund: (paramObj = {}) => request.post('order/applyRefund', paramObj, {
    baseURL: BaseUrl
  }),
  // 退货物流信息
  returnExpress: (paramObj = {}) => request.post('order/returnExpress', paramObj, {
    baseURL: BaseUrl
  }),
  // 上传头像
  UploadImgs: BaseUrl + 'upload/imgs',
  // 使用util的request方法，字符串变量即可
  // 微信登录
  AuthLoginByWeixin: BaseUrl + 'passport/jscode2session',
  // 获取微信统一下单prepay_id
  PayPrepay: (paramObj = {}) => request.get('wxpay/XcxPay', paramObj, {
    baseURL: BaseUrl
  }),
  PayPrepayId: BaseUrl + 'wxpay/XcxPay',
  // 我的店 withdraw/index
  getMyshopIndex: (paramObj = {}) => request.get('myshop/index', paramObj, {
    baseURL: BaseUrl
  }),
  // 店铺信息
  getMyshopMessage: (paramObj = {}) => request.get('myshop/myshop', paramObj, {
    baseURL: BaseUrl
  }),
  // 编辑店铺
  edityMyshop: (paramObj = {}) => request.post('myshop/editmyshop', paramObj, {
    baseURL: BaseUrl
  }),
  // 编辑店铺
  getShopOrderList: (paramObj = {}) => request.get('shoporder/orderList', paramObj, {
    baseURL: BaseUrl
  }),
  // 编辑店铺
  getShopOrderInfo: (paramObj = {}) => request.get('shoporder/info', paramObj, {
    baseURL: BaseUrl
  }),
  // 店主商品详情
  getShopProduct: (paramObj = {}) => request.get('shopproduct/index', paramObj, {
    baseURL: BaseUrl
  }),
  // 店主售后详情
  getShopAfterSales: (paramObj = {}) => request.get('shoporder/afterSales', paramObj, {
    baseURL: BaseUrl
  }),
  // 店主退款详情
  getShopRefundInfo: (paramObj = {}) => request.get('shoporder/refundInfo', paramObj, {
    baseURL: BaseUrl
  }),
  // 店主退货详情
  getShopReturnInfo: (paramObj = {}) => request.get('shoporder/returnInfo', paramObj, {
    baseURL: BaseUrl
  }),
  // 店主销售统计
  getShopSales: (paramObj = {}) => request.get('myshopsales/index', paramObj, {
    baseURL: BaseUrl
  }),
  // 未结算收入
  getShopUnsettled: (paramObj = {}) => request.get('myshopasset/unsettled', paramObj, {
    baseURL: BaseUrl
  }),
  // 已结算收入
  getShopettled: (paramObj = {}) => request.get('myshopasset/settled', paramObj, {
    baseURL: BaseUrl
  }),
  // 提现信息
  withdraw: (paramObj = {}) => request.post('withdraw/index', paramObj, {
    baseURL: BaseUrl
  }),
  // 提现记录
  withdrawRecord: (paramObj = {}) => request.get('withdraw/record', paramObj, {
    baseURL: BaseUrl
  }),
  // 收支明细
  getShopDetailed: (paramObj = {}) => request.get('myshopasset/detailed', paramObj, {
    baseURL: BaseUrl
  }),
  // 根据卡号查银行卡信息
  querybankcard: (paramObj = {}) => request.post('withdraw/querybankcard', paramObj, {
    baseURL: BaseUrl
  }),
  // 绑定银行卡
  setBankcard: (paramObj = {}) => request.post('withdraw/setCard', paramObj, {
    baseURL: BaseUrl
  }),
  // 提现说明
  withdrawExplain: (paramObj = {}) => request.get('withdraw/explain', paramObj, {
    baseURL: BaseUrl
  }),
  // 提现记录详情
  withdrawRecordInfo: (paramObj = {}) => request.get('withdraw/recordInfo', paramObj, {
    baseURL: BaseUrl
  }),
  // 提现页面
  withdrawIndexInfo: (paramObj = {}) => request.get('withdraw/indexInfo', paramObj, {
    baseURL: BaseUrl
  }),
  // 提现
  withdrawDoIndex: (paramObj = {}) => request.post('withdraw/doIndex', paramObj, {
    baseURL: BaseUrl
  })
}

export default api
