var orderCenterHttp = require("../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../utils/ToastUtil.js");
var pageUtil = require("../../../utils/PageUtil.js");
var content;
Page({
  data: {


  },
  tel: function (e) {
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel, //仅为示例，并非真实的电话号码
      complete: function (res) {
        console.log(res)
      },
    })
  },
  onLoad: function (e) {
    content = this;
    var carApplyLogId = e.id
    getCarDetails(carApplyLogId)
  }

});


/**
 * 获取详情
 */
function getCarDetails(carApplyLogId) {
  var getRequest = {
    carApplyLogId: carApplyLogId
  }
  var getCallBack = {
    success: function (data, res) {
      content.setData({
        content: data
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }
  orderCenterHttp.getCarDetails(getRequest, getCallBack);
}