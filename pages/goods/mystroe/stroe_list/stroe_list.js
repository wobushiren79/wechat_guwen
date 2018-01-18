var goodsPHPHttp = require("../../../utils/http/RequestForPHPGoods.js");
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var content;
Page({
  data: {
  },
  onShow: function () {
    var userId = wx.getStorageSync(storageKey.PLATFORM_USER_ID);
    if (userId)
      getAdvistorStores(userId)
    else
      wx.navigateTo({
        url: '/pages/login/login',
      })
  },
  onLoad: function (e) {
    content = this;
  }
});


/**
 * 获取顾问门店
 */
function getAdvistorStores(userId) {
  var getRequest = {
    userid: userId
  }
  var getCallBack = {
    success: function (data, res) {
      if (data && data.length > 0) {
        content.setData({
          list: data,
          xianshi: false
        })
      } else {
        content.setData({
          xianshi: true
        })
      }
    },
    fail: function (data, res) {
      toastUtil.showToast("获取门店失败");
    }
  }
  goodsPHPHttp.getAdvistorStores(getRequest, getCallBack);
}