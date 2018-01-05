var orderCenterHttp = require("../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../utils/ToastUtil.js");
var pageUtil = require("../../../utils/PageUtil.js");
var checkPermissions = require("../../../utils/CheckPermissions.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var orderData;
Page({
  data: {

  },
  onLoad: function (e) {
    orderData = this
    getOrderList();//待完成工单
    var datas = wx.getStorageSync(storageKey.ORDER_CENTER_DETAIL);
    var orderId = datas.workOrder.id;
    console.log(orderId)
    orderData.setData({
      orderId: orderId
    })
  },
  bindSelectTap: function (e) {
    var datas = orderData.data.listDatas;
    for (var i = 0; i < datas.length; i++) {
      if (datas[i].workOrder!= null&&datas[i].workOrder.id==e.detail.value){
        wx.setStorageSync(storageKey.ORDER_CENTER_DETAIL,datas[i]);
        break;
      }
    }
    wx.navigateBack({
      delta:1
    })
  }
});

/**
 * 获取列表
 */
function getOrderList() {
  var listRequest = {
  }
  var listCallBack = pageUtil.getPageCallBack(
    function (data, res) {
      orderData.setData({
        listDatas: data
      })
    },
    function (data, res) {

    }
  )
  orderCenterHttp.getOrderListByAdvisorIdAndOrderStatus(listRequest, listCallBack)
}
