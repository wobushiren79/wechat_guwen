var orderCenterHttp = require("../../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../../utils/ToastUtil.js");
var pageUtil = require("../../../../utils/PageUtil.js");
var content;
Page({
  data: {
    pageSize: 2,
    valid: [0]
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
  onShow: function () {
    pageUtil.initData();
    getOrderList(1)
  },
  //下拉事件
  onPullDownRefresh: function () {
    //关闭下拉
    wx.stopPullDownRefresh()
  },
  //上拉添加记录条数
  onReachBottom: function () {
    getOrderList(1)
  },
  onLoad: function () {
    content = this;
  },
  orsers: function (evet) {
    var orderId = evet.target.dataset.orderid
    acceptOrder(orderId)
  }
});


/**
 * 获取列表
 */
function getOrderList(listType) {
  var listRequest = pageUtil.getPageData();
  listRequest.params = {
    financeType: 'order_servicing'
  }
  var listCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      var updateTime = []
      for (var i in data) {
        for (var j in data[i].listOrderStatusChange) {
          if (data[i].listOrderStatusChange[j].updataStatus == 2) {
            updateTime.push(data[i].listOrderStatusChange[j].updateTime)
            break;
          }
        }
      }
      content.setData({
        listdata: data,
        notNumber: isLast,
        updateTime: updateTime
      })
    },
    function (data, res) {

    }
  )
  orderCenterHttp.getOrderCenterList(listRequest, listCallBack)
}

/**
 * 接单
 */
function acceptOrder(orderId) {
  var acceptReqeust = {
    orderId: orderId
  }
  var acceptCallBack = {
    success: function (data, res) {
      content.onShow();
    },
    fail: function (data, res) {
      toastUtil.showToast("接单失败")
    }
  }
  orderCenterHttp.acceptOrder(acceptReqeust, acceptCallBack)
}