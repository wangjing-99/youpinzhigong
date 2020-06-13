/**
 * 用户相关服务
 */
import wx from 'wx';
import api from '@/utils/api';
import util from '@/utils/util';

/**
 * 调用微信登录
 */
function loginByWeixin() {
  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return util.getUserInfo();
    }).then((userInfo) => {
      // 把用户信息传给后台，存入数据库，并计算一个token给前台存起来
      util.request(api.AuthLoginByWeixin, {
        code: code,
        info: JSON.stringify(userInfo),
        shop: wx.getStorageSync('shop')
      }, 'POST').then(res => {
        if (res.code === 0) {
          console.log(res);
          // 存储用户信息
          wx.setStorageSync('userInfo', res.data.userInfo)
          wx.setStorageSync('sid', res.data.sid)
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

function userAuthorization() {
  let code = null;
  return new Promise(function (resolve, reject) {
    return util.login().then((res) => {
      code = res.code;
      return util.getUserInfo();
    }).then((userInfo) => {
      util.request('https://yxds.999d.com/m/shareredpacket/userAuthorization?shop=53affw', {
        code: code,
        encryptedData: userInfo.encryptedData,
        iv: userInfo.iv,
        user_id: 1,
        user_name: '似水流年'
      }, 'POST').then(res => {
        if (res.code === 0) {
          resolve(res);
        } else {
          reject(res);
        }
      }).catch((err) => {
        reject(err);
      });
    }).catch((err) => {
      reject(err);
    })
  });
}

// 添加用户shopid
function setUserShop(userShop) {
  wx.setStorageSync('userShop', userShop)
}

// 检测用户是否开店
function checkShop() {
  return !!wx.getStorageSync('userShop')
}
// 检测是否显示店主的首页
function checkShopIndex() {
  return wx.getStorageSync('userShop') === wx.getStorageSync('shop')
}

/**
 * 判断用户是否登录
 */
function checkLogin() {
  return new Promise(function (resolve, reject) {
    if (wx.getStorageSync('userInfo') && wx.getStorageSync('sid')) {
      util.checkSession().then(() => {
        resolve(true);
      }).catch(() => {
        resolve(false);
      });
    } else {
      resolve(false);
    }
  });
}

// 判断用户是否绑定手机号
function checkBindPhone() {
  const userInfo = wx.getStorageSync('userInfo')
  if (userInfo && !userInfo.id) {
    return true
  }
  return false
}

function redirectToLogin() {
  const page = util.getPageUrl()
  wx.redirectTo({
    url: '/pages/user/login?page=' + page
  })
}

const user = {
  loginByWeixin,
  userAuthorization,
  checkLogin,
  checkShop,
  checkShopIndex,
  setUserShop,
  redirectToLogin,
  checkBindPhone
}

export default user
