
//获取应用实例
var platformHttp = require("../../../utils/http/RequestForPlatform.js");
var cemeteryHttp = require("../../../utils/http/RequestForCemetery.js");
var goodsHttp = require("../../../utils/http/RequestForGoods.js")
var orderCenterHttp = require("../../../utils/http/RequestForOrderCenter.js");
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var checkPermissions = require("../../../utils/CheckPermissions.js");
var content;
var app = getApp()
Page({
  data: {
    value1: '殡仪服務',
    value2: "公墓服務",
    logo_src: "/images/logo.png",
    systemType: 2,
    value3: '',
    value4: '',
    str: '',
    subSystems: [
      "funeral.advisor",
    ],
    is_loction: 0,
    hasDealSubSystem: 0,
    indicatorDots: false,
    autoplay: false,
    duration: 500
  },
  onLoad: function (e) {
    content = this;
  },
  systemType: function (e) {
    this.setData({ systemType: e.detail.value })
  },
  formSubmit: function (e) {
    var Contentdata = e.detail.value
    loginPlatForm(Contentdata.username, Contentdata.password);
  },
  formSubmitByPhone: function (e) {
    loginByMoBile(e.detail.value.mobile, e.detail.value.msgCode) 
  },
  /**
* 发送验证码
*/
  phoneData: function (e) {
    if (!checkMobile(e.detail.value.mobile)) {
      toastUtil.showToast("手机号不正确");
      return;
    }
    var sendSmsCodeData = {
      mobile: e.detail.value.mobile
    }
    var sendSmsCodeCallBack = {
      success: function (data, res) {
        content.setData({
          selected: true,
          selected1: false,
          isSendMsg: true,
          second: 60,
        })
        countdown(content)
      },
      fail: function (data, res) {
        toastUtil.showToast(data);
      }
    }
    platformHttp.loginByPhone(sendSmsCodeData, sendSmsCodeCallBack);
  },

  //设置页面转发功能
  onShareAppMessage: function () {
    return {
      title: '圆满人生公共殡葬服务平台',
      path: '/pages/platform/login/login',
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          duration: 3000,
        })
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '转发失败',
          image: '/images/icon_info.png',
          duration: 3000,
        })
      }
    }
  },
})

/**
 * 登陆平台
 */
function loginPlatForm(userName, passWord) {
  if (userName == null || userName.length == 0) {
    toastUtil.showToast("账号不能为空");
    return;
  }
  if (passWord == null || passWord.length == 0) {
    toastUtil.showToast("密码不能为空");
    return;
  }
  var loginPlatData = {
    userName: userName,
    userPwd: passWord
  }
  var loginPlatCallBack = {
    success: function (data, res) {
      if (data) {
        loginSuccess(data, loginPlatData.userName, loginPlatData.userPwd)
      }
    },
    fail: function (data, res) {
      toastUtil.showToast(data);
    }
  }
  platformHttp.loginPlatform(loginPlatData, loginPlatCallBack);
}

/**
 * 手机登陆
 */
function loginByMoBile(mobile, smsCode) {
  //手机号登陆
  var loginByPhoneRequest = {
    mobile: mobile,
    msgCode: smsCode
  }
  var loginByPhoneCallBack = {
    success: function (data, res) {
      if (data) {
        loginSuccess(data, data.userObj.loginName, data.userObj.loginPwd)
      }
    },
    fail: function (data, res) {
      toastUtil.showToast(data);
    }
  }
  platformHttp.loginByPhone(loginByPhoneRequest, loginByPhoneCallBack);
}

/**
 * 登陆单项
 */
function loginGoods() {
  var loginGoodsCallBack = {
    success: function (data, res) {
      loginOrderCenter();
    },
    fail: function (data, res) {
      loginOrderCenter();
    }
  }
  goodsHttp.loginGoods(null, loginGoodsCallBack);
}

/**
 * 登陆工单系统
 */
function loginOrderCenter() {
  var loginOrderCenterCallBack = {
    success: function (data, res) {
      loginCemetery();
    },
    fail: function (data, res) {
      loginCemetery();
    }
  }
  orderCenterHttp.loginOrderCenter(null, loginOrderCenterCallBack);
}

/**
 * 登陆公墓
 */
function loginCemetery() {
  var loginCemeteryCallBack = {
    success: function (data, res) {
      wx.navigateBack({
        delta: 1
      })
    },
    fail: function (data, res) {
      wx.navigateBack({
        delta: 1
      })
    }
  }
  cemeteryHttp.loginCemetery(null, loginCemeteryCallBack);
}

/**
 * 查询用户级别
 */
function getUserLevel() {
  var resourceCodes = wx.getStorageSync(storageKey.PLATFORM_RESOURCE_CODES)
  var userId = wx.getStorageSync(storageKey.PLATFORM_USER_ID)
  // var hasGoodsAdvisorAmateur = checkPermissions.hasGoodsAdvisorAmateur();
  // if (hasGoodsAdvisorAmateur) {
    var queryLevelRequest = {
      userIds: [userId]
    }
    var queryLevelCallBack = {
      success: function (data, res) {
        wx.setStorageSync(storageKey.AMATEUR_LEVEL, data.resultList)
        loginGoods();
      },
      fail: function (data, res) {
        loginGoods();
      }
    }
    platformHttp.queryUserLevel(queryLevelRequest, queryLevelCallBack);
    return;
  // }
  // loginGoods();
}




/**
 * 登陆成功处理
 */
function loginSuccess(data, userName, userPwd) {
  //缓存用户名和密码
  wx.setStorageSync(storageKey.LOGIN_USER_NAME, userName)
  wx.setStorageSync(storageKey.LOGIN_USER_PASS, userPwd)
  //缓存平台登录用户ID
  if (data.userId)
    wx.setStorageSync(storageKey.PLATFORM_USER_ID, data.userId)
  //缓存用户信息
  if (data.userObj)
    wx.setStorageSync(storageKey.PLATFORM_USER_OBJ, data.userObj)
  //缓存用户权限
  if (data.resourceCodes)
    wx.setStorageSync(storageKey.PLATFORM_RESOURCE_CODES, data.resourceCodes)
  getUserLevel();
}

/**
 * 验证码倒计时
 */
function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    // console.log("Time Out...");
    that.setData({
      selected: false,
      selected1: true,
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}

/**
 * 检测手机号
 */
function checkMobile(mobile) {
  if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(mobile))) {
    return false;
  } else {
    return true;
  }
} 