
var platformHttp = require("../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var checkPermissions = require("../../../utils/CheckPermissions.js");
var content;
Page({
  data: {
    usableMoney: '0.00'
  },
  onShow: function () {
    this.onLoad()
  },
  dele: function () {
    wx.clearStorageSync()
    //跳转登录页面
    wx.reLaunch({
      url: '../../login/login',
    })

  },
  onLoad: function () {
    content=this;
    var userInfo = wx.getStorageSync(storageKey.PLATFORM_USER_OBJ);
    if (!userInfo) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }

    content.setData({
      UserName: userInfo.name
    })

    wx.getUserInfo({
      success: function (res) {
        // success
        content.setData({
          nickName: res.userInfo.nickName,
          userInfoAvatar: res.userInfo.avatarUrl
        })
      },
      fail: function () {
        // fail
        console.log("获取失败！")
      },
    })
    
    getWalletInfo();
    getCreditInfo();

  }
});


/**
 * 获取钱包信息
 */
function getWalletInfo(){
  var walletInfoCallBack={
    success:function(data,res){
      var usableMoney = data.usableMoney / 100
      content.setData({
        usableMoney: getApp().ProcessingPrice(usableMoney)
      })
    },
    fail:function(data,res){
      toastUtil.showToast("获取钱包失败");
    }
  }
  platformHttp.getWalletInfo(null, walletInfoCallBack);
}

/**
 * 查询用户签到情况
 */
function getCreditInfo() {
  var queryCreditCallBack = {
    success: function (data, res) {
      content.setData({
        usableCredit: data.usableCredit,
        canCheckin: data.canCheckin,
      })
    },
    fail: function (data, res) {

    }
  }
  platformHttp.queryCreditInfo(null, queryCreditCallBack);
}
