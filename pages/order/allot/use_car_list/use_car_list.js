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
  //上拉添加记录条数
  onReachBottom() {
    getCarList(content.data.orderId)
  },
  //下拉事件
  onPullDownRefresh: function () {
    //关闭下拉
    wx.stopPullDownRefresh()
  },
  onLoad: function (e) {
    content = this;
    pageUtil.initData();
    getCarList(e.orderId)
  }
});


/**
 * 获取用车列表
 */
function getCarList(orderId) {
  var getReqeust = pageUtil.getPageData();
  getReqeust.params = {
    orderId: orderId
  }
  var getCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      content.setData({
        dateList: res.data.content.listCarApplyLog,
        orderId: orderId
      })

    },
    function (data, res) {
      toastUtil.showToast("查询失败")
    }
  );
  orderCenterHttp.getCarList(getReqeust, getCallBack);
}
