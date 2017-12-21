// pages/signin/signin.js
var platformHttp = require("../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../utils/ToastUtil.js");
var content;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sign: false
  },

  bind_sign: function () {
    this.setData({
      sign: true
    })
  },

  onLoad: function () {
    content=this;
    getCreditInfo();
  },
})

/**
 * 查询用户签到情况
 */
function getCreditInfo() {
  var queryCreditCallBack = {
    success: function (data, res) {
      content.setData({
        usableCredit: data.usableCredit,
        canCheckin: data.canCheckin,
        keeps: data.keeps,
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("查询签到失败")
    }
  }
  platformHttp.queryCreditInfo(null, queryCreditCallBack);
}

/**
 * 用户签到
 */
function userSign() {
  var userSignCallBack = {
    success: function (data, res) {
      content.setData({
        usableCredit: data.usableCredit,
        keeps: data.keeps,
        canCheckin: false,
      })
      toastUtil.showToastReWrite("签到成功");
    },
    fail: function (data, res) {
      toastUtil.showToast(data);
    }
  }
  platformHttp.userCreditSign(null, userSignCallBack);
}