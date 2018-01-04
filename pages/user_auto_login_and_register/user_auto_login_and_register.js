var platformHttp = require('../../utils/http/RequestForPlatform.js');
var goodsHttp = require('../../utils/http/RequestForGoods.js')
var cemeteryHttp=require('../../utils/http/RequestForCemetery.js');
var storageKey = require('../../utils/storage/StorageKey.js');
var toastUtil = require('../../utils/ToastUtil.js');
var modalUtil = require('../../utils/ModalUtil.js');
var content;
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    value1: '殡仪服務',
    value2: "公墓服務",
    selected: false,
    selected1: true,
    logo_src: "/images/logo.png",
    systemType: 2,
    value3: '',
    value4: '',
    str: '',
    isSendMsg: true,
    subSystems: [
      "funeral.advisor",
    ],
    is_loction: 0,
    hasDealSubSystem: 0
  },

  systemType: function (e) {
    this.setData({ systemType: e.detail.value })
  },
  onLoad: function () {
    wx.clearStorageSync();
    content = this
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
    platformHttp.getMsgCode(sendSmsCodeData, sendSmsCodeCallBack);
  },


  formSubmit: function (e) {
    var formValues = e.detail.value
    if (!checkMobile(formValues.mobile)) {
      toastUtil.showToast("手机号不正确");
      return;
    }
    if (formValues.msgCode == "") {
      toastUtil.showToast("验证码为空");
      return;
    }
    registeredAccount(formValues.mobile, formValues.msgCode);
  },
})


/**
 * 注册账号
 */
function registeredAccount(mobile, msgcode) {
  var registeredAccountRequest = {
    mobile: mobile,
    msgCode: msgcode
  }
  var registeredAccountCallBack = {
    success: function (data, res) {
      wx.clearStorageSync();
      wx.setStorageSync(storageKey.LOGIN_USER_NAME, data.loginName)
      wx.setStorageSync(storageKey.LOGIN_USER_PASS, data.loginPwd)
      getCreditInfo()
    },
    fail: function (data, res) {
      toastUtil.showToast(data);
    }
  }
  platformHttp.buildAccountForOrderCenterBuild(registeredAccountRequest, registeredAccountCallBack)
}

/**
 * 查询用户签到情况
 */
function getCreditInfo() {
  var queryCreditCallBack = {
    success: function (data, res) {
     
    },
    fail: function (data, res) {

    }
  }
  platformHttp.queryCreditInfo(null, queryCreditCallBack);
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