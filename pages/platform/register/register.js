var platformHttp = require('../../../utils/http/RequestForPlatform.js');
var goodsHttp = require('../../../utils/http/RequestForGoods.js')
var cemeteryHttp = require('../../../utils/http/RequestForCemetery.js');
var storageKey = require('../../../utils/storage/StorageKey.js');
var toastUtil = require('../../../utils/ToastUtil.js');
var modalUtil = require('../../../utils/ModalUtil.js');
var safeJump=require("../../../utils/SafeJump.js");
var checkTools = require("../../../utils/CheckTools.js");
var content;
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
  validation: function (e) {
    var str = checkMobile(e.detail.value)
    if (!str) {
      toastUtil.showToast("手机号不正确");
      return;
    } else {
      this.setData({
        value3: str
      })
    }
  },
  refereesValidation: function (e) {
    var mobile = e.detail.value;
    if (mobile.length == 11) {
      validationAccount(false, mobile)
    }
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
    var str = checkMobile(e.detail.value.mobile)
    if (!str) {
      toastUtil.showToast("手机号不正确");
      return;
    }
    validationAccount(true, e.detail.value.mobile)
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
    if (formValues.referees != null && formValues.referees.length > 0) {
      if (!checkMobile(formValues.referees)) {
        toastUtil.showToast("推荐号不正确");
        return;
      }
    }
    registeredAccount(formValues.mobile, formValues.msgCode, formValues.referees);
  },


})


/**
 * 注册账号
 */
function registeredAccount(mobile, msgcode, referees) {
  var registeredAccountRequest = {
    mobile: mobile,
    msgCode: msgcode,
    refereeMobile: referees
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
 * 验证手机号
 */
function validationAccount(isGetSms, phone) {
  var validationRequest = {
    loginName: phone,
    mobile: phone
  }
  var validationCallBack = {
    success: function (data, res) {
      if (isGetSms)
        getSmsCode(phone)
      else 
        toastUtil.showToast("没有此推荐人");
    },
    fail: function (data, res) {
      if (isGetSms)
        toastUtil.showToast(data);
    }
  }
  platformHttp.validationAccount(validationRequest, validationCallBack);
}
/**
 * 获取验证码
 */
function getSmsCode(mobile) {
  var sendSmsCodeData = {
    mobile: mobile
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
}
/**
 * 查询用户签到情况
 */
function getCreditInfo() {
  var queryCreditCallBack = {
    success: function (data, res) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
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
  }, 1000)
}


/**
 * 检测手机号
 */
function checkMobile(mobile) {
  var str = checkTools.checkMobile(mobile)
  if (!str) {
    return false;
  } else {
    return str;
  }
}


