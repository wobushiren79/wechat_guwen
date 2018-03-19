
var platformHttp = require("../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var checkPermissions = require("../../../utils/CheckPermissions.js");
var safeJump = require("../../../utils/SafeJump.js");
var content;
Page({
  data: {
    usableMoney: '0.00',
    isDreamMaster: false,
    dreamMasterClassKey: "dreamMaster"
  },
  // onShow: function () {
  //   this.onLoad()
  // },
  dele: function () {
    wx.showModal({
      title: '退出',
      content: '是否退出账号',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorageSync()
          safeJump.startNavigate('/pages/platform/login/login');
        }
      }
    })
  },
  onShow: function () {
    var userInfo = wx.getStorageSync(storageKey.PLATFORM_USER_OBJ);
    if (!userInfo) {
      safeJump.startNavigate('/pages/platform/login/login');
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
//     用户圆梦师级别
    getDreamMasterClass();
  },
  onLoad: function () {
    content = this;
  }
});


/**
 * 获取钱包信息
 */
function getWalletInfo() {
  var walletInfoCallBack = {
    success: function (data, res) {
      var usableMoney = data.usableMoney / 100
      content.setData({
        usableMoney: getApp().ProcessingPrice(usableMoney)
      })
    },
    fail: function (data, res) {
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

/**
 * 用户圆梦师级别
 */
function getDreamMasterClass(){
	var userLevelData = wx.getStorageSync(storageKey.AMATEUR_LEVEL);
	var isDreamMasterClass = false;
	var dreamMasterClass = "";
	if (userLevelData != null && userLevelData.length != 0) {
		var classKey = content.data.dreamMasterClassKey;		
		for (var i in userLevelData){
			var levelObj = userLevelData[i];
			if (levelObj == null || levelObj.systemLevel == null || 
				classKey != levelObj.systemLevel.levelType){
				continue;
			} else if (levelObj.systemLevel.levelType == classKey){
				dreamMasterClass = levelObj.systemLevel.levelName;
				isDreamMasterClass = true;
				break;
			}
		}
	}
	content.setData({
		isDreamMaster: isDreamMasterClass,
		dreamMasterClass: dreamMasterClass
	});
}