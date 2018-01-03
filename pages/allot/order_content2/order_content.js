var orderCenterHttp = require("../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../utils/ToastUtil.js");
var pageUtil = require("../../../utils/PageUtil.js");
var checkTools = require("../../../utils/CheckTools.js")
var content;
Page({
  data: {
    popup_img: false
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
  bind_popup_img: function (e) {
    var imgurl = e.currentTarget.dataset.imgurl
    this.setData({
      popup_img: true,
      imgurl: imgurl
    })
  },
  bind_popup_close: function () {
    this.setData({
      popup_img: false
    })
  },
  onLoad: function (e) {
    content = this;
    getOrderDetails(e.orderId)
  }
});
/**
 * 获取工单详情
 */
function getOrderDetails(orderId) {
  var getRequest = {
    orderId: orderId
  }
  var getCallBack = {
    success: function (data, res) {
      var get_data = []
      for (var i in data.listPerformRecord) {
        get_data.push(data.listPerformRecord[i].performPic.split(","))
      }
      content.setData({
        content: data,
        get_data: get_data,
        orderId: orderId
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }
  orderCenterHttp.getOrderDetails(getRequest, getCallBack);
}
