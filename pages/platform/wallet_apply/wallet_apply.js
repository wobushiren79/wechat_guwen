var RequestForPlatformm = require('../../../utils/http/RequestForPlatform.js');
var RequestForCemetery = require('../../../utils/http/RequestForCemetery.js');
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
Page({
  data: {
    second: 60,
    selected: false,
    selected1: true,
    systemType: 2,
    value3: '',
    value4: ''
  },
  money: function (e) {
    // console.log(e.detail.value)
    this.setData({
      money: e.detail.value
    })
  },
  onShow: function () {
  },
  onLoad: function () {
    var that = this
    var getCallBack = {
      success: function (opt, res) {
        var defaultBankCard = opt.defaultBankCard
        if (defaultBankCard) {
          defaultBankCard.cardNo = defaultBankCard.cardNo.substring(defaultBankCard.cardNo.length - 4)
          var usableMoney = opt.usableMoney / 100
          that.setData({
            usableMoney: getApp().ProcessingPrice(usableMoney),
            mobile: opt.mobile,
            defaultBankCard: defaultBankCard,
            bankCardId: defaultBankCard.id
          })
        } else {
          var usableMoney = opt.usableMoney / 100
          that.setData({
            usableMoney: getApp().ProcessingPrice(usableMoney),
            mobile: opt.mobile,
            defaultBankCard: defaultBankCard,
          })
        }
      },
      fail: function (data,res) {
        toastUtil.showToast(data);
      }
    }
    RequestForPlatformm.getCashingInit(null, getCallBack);
  },
  phoneData: function (e) {
    var that = this
    var getRequest = {
      mobile: that.data.mobile
    }
    var getCallBack = {
      success: function (res, opt) {
        var Code = opt.data.message
        var star = Code.indexOf(':') + 1;
        var co = Code.substring(star)
        console.log(co)
        that.setData({
          selected: true,
          selected1: false,
          xianshi: true,
          second: 60,
          msgCode: co
        })
        countdown(that)
        toastUtil.showToastReWrite('发送成功');
      },
      fail: function () {
        toastUtil.showToast("发送失败");
      }
    }
    RequestForPlatformm.changeForPassWord(getRequest, getCallBack);
  },
  formSubmit: function (e) {
    var that = this
    var platform = getApp().globalData.platform
    var msgCode = that.data.msgCode
    var get_data = e.detail.value
    var submitPrice = parseFloat(get_data.getMoney);
    var totalPrice = parseFloat(that.data.usableMoney);
    if (get_data.getMoney == '') {
      toastUtil.showToast("金额为空");
      return
    }
    if (!getApp().AmountVerification(get_data.getMoney)) {
      toastUtil.showToast("金额错误");
      return
    }
    if (submitPrice > totalPrice) {
      toastUtil.showToast("金额过大");
      return
    }
    get_data.bankCardId = that.data.bankCardId
    if (get_data.msgCode != msgCode) {
      toastUtil.showToast("验证码错误");
      return
    }
    if (get_data.bankCardId == undefined || get_data.bankCardId == null) {
      toastUtil.showToast("未选银行卡");
      return
    }
    get_data.cashMoney = submitPrice * 100
    var getRequest = get_data
    var getCallBack = {
      success: function (opt) {
        that.setData({
          disabled: true
        })
        toastUtil.showToastReWrite("申请成功");
        setTimeout(function () {
          wx.navigateBack({
            delta: 1
          })
        }, 3000)
      },
      fail: function () {
        toastUtil.showToast("申请失败");
      }
    }
    RequestForPlatformm.getApplyCash(getRequest, getCallBack);
  }
})

function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
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
