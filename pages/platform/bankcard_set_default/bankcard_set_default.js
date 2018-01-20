var RequestForPlatformm = require('../../../utils/http/RequestForPlatform.js');
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var content;
Page({
  data: {

  },
  defaultBankCard: function (e) {
    var that = this
    var pid = that.data.pid
    var content = {}
    content.bankCardId = e.target.dataset.id
    var getRequest = content
    var getCallBack = {
      seccuss: function (opt) {
        toastUtil.showToast("设置成功");
        if (pid == 1) {
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 2000)
        }
      },
      fail: function () {
        toastUtil.showToast("设置失败");
      }
    }
    RequestForPlatformm.settingDefaultCard(getRequest, getCallBack);
  },
  onShow: function () {
    queryCardInfoForList()
  },
  onLoad: function (vent) {
    content = this;
    var pid = vent.pid
    content.setData({
      pid: pid
    })
  }
});

function queryCardInfoForList() {
  var getCallBack = {
    success: function (opt) {
      var defaultBankCard = opt.defaultBankCard
      if (defaultBankCard) {
        defaultBankCard.cardNo = defaultBankCard.cardNo.substring(0, 4) + '****' + defaultBankCard.cardNo.substring(defaultBankCard.cardNo.length - 4)
      }
      var userBankCardList = opt.userBankCardList
      if (userBankCardList) {
        for (var i in userBankCardList) {
          userBankCardList[i].cardNo = userBankCardList[i].cardNo.substring(0, 4) + '****' + userBankCardList[i].cardNo.substring(userBankCardList[i].cardNo.length - 4)
        }
      }
      content.setData({
        defaultBankCard: defaultBankCard,
        userBankCardList: userBankCardList,
      })
    },
    fail: function () {
      toastUtil.showToast("操作失败");
    }
  }
  RequestForPlatformm.queryCardInfoForList(null, getCallBack);
}
