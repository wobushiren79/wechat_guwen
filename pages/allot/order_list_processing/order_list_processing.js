
var orderCenterHttp = require("../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../utils/ToastUtil.js");
var pageUtil = require("../../../utils/PageUtil.js");
var checkPermissions = require("../../../utils/CheckPermissions.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var orderData;
Page({
  data: {
    pageSize: 2,

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
    getOrderList(2)
  },
  //上拉添加记录条数
  onReachBottom() {
    getOrderList(2)
  },
  onLoad: function () {
    orderData = this;
  },
  //跳转新建工单页面
  nav: function () {
    var hasOrderCenterExecutor = checkPermissions.hasOrderCenterExecutor();
    var hasOrderCenterBuilder = checkPermissions.hasOrderCenterBuilder();
    if (hasOrderCenterExecutor && !hasOrderCenterBuilder) {
      toastUtil.showToast("没有权限");
      return
    } else {
      wx.navigateTo({
        url:'../../new_/new_',
      })
    }
  },
  bindHandle:function(e){
    var orderId = e.target.dataset.id
    wx.navigateTo({
      url: '../order_edit/order_edit?orderId='+orderId,
    })
  },
  bindChooseGoods: function (e){
    var orderId = e.target.dataset.id;
    var datas = orderData.data.listdata;
    for (var i = 0; i < datas.length; i++) {
      if (datas[i].workOrder != null && datas[i].workOrder.id == orderId) {
        wx.setStorageSync(storageKey.ORDER_CENTER_DETAIL, datas[i]);
        break;
      }
    }
    wx.navigateTo({
      url: '../../service/service',
    })
  }
});


/**
 * 获取列表
 */
function getOrderList(listType) {
  var listRequest = pageUtil.getPageData();
  listRequest.params = {
    listType: listType
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
      orderData.setData({
        listdata: data,
        notNumber: isLast,
        updateTime: updateTime
      })
    },
    function (data, res) {

    }
  )
  orderCenterHttp.getOrderList(listRequest, listCallBack)
}
