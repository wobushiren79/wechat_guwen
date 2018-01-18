var orderCenterHttp = require("../../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../../utils/ToastUtil.js");
var checkPermissions = require("../../../../utils/CheckPermissions.js");
var storageKey = require("../../../../utils/storage/StorageKey.js");
var orderData;
Page({
  data: {

  },
  onLoad: function (e) {
    orderData = this
    getOrderList();//待完成工单
  },
  //下拉事件
  onPullDownRefresh: function () {
    //关闭下拉
    wx.stopPullDownRefresh()
  },
  bindSelectTap: function (e) {
    var datas = orderData.data.listDatas;
    for (var i = 0; i < datas.length; i++) {
      if (datas[i].workOrder != null && datas[i].workOrder.id == e.detail.value) {
        wx.setStorageSync(storageKey.ORDER_CENTER_DETAIL, datas[i]);
        break;
      }
    }
    wx.navigateBack({
      delta: 1
    })
  }
});

/**
 * 获取列表
 */
function getOrderList() {
  var listRequest = {
  }
  var listCallBack ={
    success:function(data,res){
      var orderCenterData = wx.getStorageSync(storageKey.ORDER_CENTER_DETAIL);
      var orderId;
      var notNumber=0;
      if(data==null||data.length==0){
        notNumber=1;
      }
      if (orderCenterData) {
        orderId = orderCenterData.workOrder.id;
      }
      for (var i in data) {
        if (orderId != null && orderId == data[i].workOrder.id) {
          data[i].isCheck = true;
        } else {
          data[i].isCheck = false;
        }
      }
      orderData.setData({
        listDatas: data,
        notNumber: notNumber
      })
    },
    fail:function(data,res){

    }
  }
  orderCenterHttp.getOrderListByAdvisorIdAndOrderStatus(listRequest, listCallBack)
}
