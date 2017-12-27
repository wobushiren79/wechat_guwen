var RequestForPlatformm=require('../../../utils/http/RequestForPlatform.js');
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
  money:function(e){
    // console.log(e.detail.value)
    this.setData({
      money: e.detail.value
    })
  },
  onShow: function () {
    this.onLoad()
  },
  onLoad: function () {
    var that = this
    var getCallBack={
      success: function (opt,res){
              var defaultBankCard = opt.defaultBankCard
              if (defaultBankCard){
                //取前四位 defaultBankCard.cardNo.substring(0, 4) + '****' + 
              defaultBankCard.cardNo = defaultBankCard.cardNo.substring(defaultBankCard.cardNo.length - 4)
              var usableMoney = opt.usableMoney / 100
              that.setData({
                usableMoney: getApp().ProcessingPrice(usableMoney),
                mobile: opt.mobile,
                defaultBankCard: defaultBankCard,
                bankCardId: defaultBankCard.id
              })
              }else{
                var usableMoney = opt.usableMoney / 100
                that.setData({
                  usableMoney: getApp().ProcessingPrice(usableMoney),
                  mobile: opt.mobile,
                  defaultBankCard: defaultBankCard,
                  // bankCardId: defaultBankCard.id
                })
              }
       },
       fail:function(){
         toastUtil.showToast("获取银行卡失败");
       }
    }
    RequestForPlatformm.getCashingInit(null, getCallBack);
  },
  phoneData: function (e) {
    var that = this
    var getRequest = {
      phone: that.data.mobile
    }
    var getCallBack={
      success:function(res){
            that.setData({
              selected: true,
              selected1: false,
              xianshi: true,
              second: 60,
              msgCode: res
            })
            countdown(that)
            wx.showToast({
              title: '发送成功',
              duration: 3000,
              // mask:true
            })
      },
      fail:function(){
        toastUtil.showToast("发送失败");
      }
    }
    RequestForCemetery.SendVerificationCode(getRequest, getCallBack);
  },
  formSubmit: function (e) {
    var that = this
    var platform = getApp().globalData.platform
    var msgCode = that.data.msgCode
    var get_data = e.detail.value
    if (get_data.getMoney != '') {
      if (getApp().AmountVerification(get_data.getMoney)) {
      if (get_data.getMoney <= that.data.usableMoney){
      get_data.bankCardId = that.data.bankCardId
      if (get_data.msgCode == msgCode) {
        if (get_data.getMoney != '' || get_data.getMoney.length > 0) {
          if (get_data.bankCardId != undefined || get_data.bankCardId != undefined) {
            get_data.cashMoney = parseFloat(get_data.getMoney) * 100
            var  getRequest= get_data
            var getCallBack={
              success:function(opt){
                      that.setData({
                        disabled:true
                      })
                toastUtil.showToast("申请成功");
                      setTimeout(function () {
                        wx.navigateBack({
                          delta: 1
                        })
                      }, 3000)
              },
              fail:function(){
                toastUtil.showToast("申请失败");
              }
            }
            RequestForPlatformm.getApplyCash(getRequest,getCallBack);
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '银行卡为空',
              image: '../../../images/icon_info.png',
              duration: 3000,
            })
          }
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '金额为空',
            image: '../../../images/icon_info.png',
            duration: 3000,
            // mask:true
          })
        }
      } else {
        wx.hideLoading()
        wx.showToast({
          title: '验证码错误',
          image: '../../../images/icon_info.png',
          duration: 3000,
          // mask:true
        })
      }
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '金额过大',
            image: '../../../images/icon_info.png',
            duration: 3000,
            // mask:true
          })
        }
    }else{
      wx.hideLoading()
      wx.showToast({
        title: '金额错误',
        image: '../../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }
    } else {
      wx.hideLoading()
      wx.showToast({
        title: '金额为空',
        image: '../../../images/icon_info.png',
        duration: 3000,
        // mask:true
      })
    }
  }
})

function countdown(that) {
  // console.log(that.data.second);
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
