var goodsPHPHttp = require("../../../../utils/http/RequestForPHPGoods.js");
var toastUtil = require("../../../../utils/ToastUtil.js");
var storageKey = require("../../../../utils/storage/StorageKey.js");
var safeJump=require("../../../../utils/SafeJump.js")
var content;
Page({
  data: {
  },
  onShow: function () {
    var userId = wx.getStorageSync(storageKey.PLATFORM_USER_ID);
    if (userId)
      getAdvistorStores(userId)
    else
      safeJump.startNavigate('/pages/platform/login/login');
  },
  onLoad: function (e) {
    content = this;
  },
  // 打开C端我的门店
  bind_go_c: function (e) {
    var storeId = e.currentTarget.dataset.storeid;
    var userId = wx.getStorageSync(storageKey.PLATFORM_USER_ID);
    wx.navigateToMiniProgram({
      appId: 'wxe8c2277798630262',
      path: '/pages/Customer/customer_index/customer_index?storeId=' + storeId + '&storeUserId=' + userId,
      // extraData: {
      //   storeId: storeId,
      //   storeUserId: userId
      // },
      envVersion: 'release',
      success(res) {
        // 打开成功
      }
    })
  },
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

