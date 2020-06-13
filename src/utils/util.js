import wx from 'wx';
import api from '@/utils/api';
import getCurrentPages from 'wxFunction'

function formatTime(date) {
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hour = date.getHours()
  let minute = date.getMinutes()
  let second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

/**
 * 封封微信的的request
 */
function request(url, data = {}, method = 'GET') {
  let type = 'application/json'
  if (method === 'POST') {
    type = 'application/x-www-form-urlencoded'
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': type
      },
      success: function (res) {
        // console.log('请求成功，url:', url);
        // console.log('请求参数，data:', data);
        if (res.statusCode === 200) {
          if (res.data.code === 400317) {
            // 需要登录后才可以操作
            let code = null;
            return login().then((res) => {
              code = res.code;
              return getUserInfo();
            }).then((userInfo) => {
              // 登录远程服务器
              request(api.AuthLoginByWeixin, {
                code: code,
                userInfo: userInfo
              }, 'POST').then(res => {
                reject(res);
              }).catch((err) => {
                reject(err);
              });
            }).catch((err) => {
              reject(err);
            })
          } else {
            resolve(res.data);
          }
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
        // console.log('请求失败，url', url);
        // console.log('请求参数，data:', data);
      }
    })
  })
}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true)
      },
      fail: function () {
        reject(false)
      }
    })
  });
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          // 登录远程服务器
          // console.log('微信登陆成功', res)
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

/**
 * 调用微信获取用户信息接口，需要button授权
 */
function getUserInfo() {
  return new Promise(function (resolve, reject) {
    // 查看button是否授权
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            withCredentials: true,
            success: function (res) {
              // console.log('获取用户信息成功', res);
              resolve(res);
            },
            fail: function (err) {
              // console.log('获取用户信息失败', err);
              reject(err);
            }
          })
        } else { // 没有授权
          // console.log('但获取用户信息失败，未同意button授权');
        }
      }
    })
  });
}

function navigate(url) {
  wx.navigateTo({
    url: url
  })
}

function reLaunch(url) {
  wx.reLaunch({
    url: url
  })
}

function redirect(url) {
  wx.redirectTo({
    url: url
  })
}

function goBack() {
  wx.navigateBack()
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

function showToast(msg) {
  wx.showToast({
    title: msg,
    icon: 'none'
  })
}

function filter(str) { // 特殊字符转义
  str += ''; // 隐式转换
  str = str.replace(/%/g, '%25')
  str = str.replace(/\+/g, '%2B')
  str = str.replace(/ /g, '%20')
  str = str.replace(/\//g, '%2F')
  str = str.replace(/\?/g, '%3F')
  str = str.replace(/&/g, '%26')
  str = str.replace(/#/g, '%23')
  return str;
}

function formateObjToParamStr(paramObj) {
  const sdata = [];
  for (let attr in paramObj) {
    sdata.push(`${attr}=${filter(paramObj[attr])}`)
  }
  return sdata.join('&')
}

function showModal(msg) {
  return new Promise(function (resolve, reject) {
    wx.showModal({
      title: '提示',
      content: msg,
      confirmColor: '#d6004f',
      success: (res) => {
        if (res.confirm) {
          resolve(true)
        } else {
          resolve(false)
        }
      }
    })
  })
}

function showLoading(msg) {
  wx.showLoading({
    title: msg || '数据加载中...',
    mask: true
  })
}

function hideLoading() {
  wx.hideLoading()
}
/**
 * 数组去重
 */
function arrUnique(arr) {
  let res = []
  let json = {}
  for (let i = 0; i < arr.length; i++) {
    if (!json[arr[i]]) {
      res.push(arr[i])
      json[arr[i]] = 1
    }
  }
  return res
}

/**
 * 删除数组的键值、键
 */
function arrRemove(arr, obj) {
  for (let i = 0; i < arr.length; i++) {
    let temp = arr[i];
    if (!isNaN(obj)) {
      temp = i;
    }
    if (temp === obj) {
      for (let j = i; j < arr.length; j++) {
        arr[j] = arr[j + 1];
      }
      arr.length = arr.length - 1;
    }
  }
  return arr;
}

// 获取当前页面url
function getPageUrl() {
  const pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let url = currentPage.route
  let options = currentPage.options
  let str = ''
  for (let key in options) {
    if (options.hasOwnProperty(key)) {
      str += `${key}=${options[key]}&`
    }
  }
  return str ? encodeURIComponent(`/${url}?${str}`.slice(0, -1)) : encodeURIComponent('/' + url)
}

// 获取当前路径
function getCurPage() {
  const pages = getCurrentPages()
  let currentPage = pages[pages.length - 1]
  let url = currentPage.route
  if (url.indexOf('/') !== 0) {
    url = '/' + url
  }
  return url
}

// 处理ios时间不兼容
function dateFromString(time) {
  time = time.replace(/-/g, ':').replace(' ', ':')
  time = time.split(':')
  return new Date(time[0], (time[1] - 1), time[2], time[3], time[4], time[5])
}

// 获取倒计时时间戳
function getTimestamp(date) {
  return parseInt((this.dateFromString(date) - Date.parse(new Date())) / 1000)
}

// 根据时间戳获取天时分秒
function getDHMS(timestamp) {
  if (timestamp <= 0) {
    return {'day': '00', 'hour': '00', 'minute': '00', 'second': '00'}
  }
  let day = Math.floor(timestamp / (60 * 60 * 24))
  let hour = Math.floor(timestamp / (60 * 60)) - (day * 24)
  let minute = Math.floor(timestamp / 60) - (day * 24 * 60) - (hour * 60)
  let second = Math.floor(timestamp) - (day * 24 * 60 * 60) - (hour * 60 * 60) - (minute * 60)
  if (minute <= 9) minute = '0' + minute
  if (second <= 9) second = '0' + second
  return {'day': day, 'hour': hour, 'minute': minute, 'second': second}
}

const util = {
  formatTime,
  dateFromString,
  getTimestamp,
  formateObjToParamStr,
  getDHMS,
  request,
  redirect,
  navigate,
  reLaunch,
  goBack,
  showErrorToast,
  showToast,
  showModal,
  checkSession,
  getCurPage,
  login,
  getUserInfo,
  showLoading,
  hideLoading,
  getPageUrl,
  arrUnique,
  arrRemove
}

export default util
