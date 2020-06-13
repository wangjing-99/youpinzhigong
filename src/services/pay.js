/**
 * 支付相关服务
 */
import wx from 'wx'
import api from '@/utils/api'
import util from '@/utils/util'

async function payOrder(no, pay = 'payment') {
  const obj = {}
  if (pay === 'order') {
    obj.order_no = no
  } else {
    obj.payment_no = no
  }
  const res = await api.PayPrepay(obj)
  if (res.code === 0) {
    const payParam = res.data
    const timeStampParam = payParam.timeStamp ? payParam.timeStamp : ''
    const nonceStrParam = payParam.nonceStr ? payParam.nonceStr : ''
    const packageParam = payParam.package ? payParam.package : ''
    const signTypeParam = payParam.signType ? payParam.signType : 'MD5'
    const paySignParam = payParam.paySign ? payParam.paySign : ''
    wx.requestPayment({
      'timeStamp': timeStampParam,
      'nonceStr': nonceStrParam,
      'package': packageParam,
      'signType': signTypeParam,
      'paySign': paySignParam,
      'success': function (res) {
        util.redirect('/pages/pay/payResult?status=1&payment_no=' + payParam.payment_no)
      },
      'fail': function (res) {
        util.redirect('/pages/pay/payResult?status=0&payment_no=' + payParam.payment_no)
      }
    })
  } else {
    util.redirect('/pages/pay/payResult?status=0&payment_no=')
  }
}

const pay = {
  payOrder
}

export default pay
