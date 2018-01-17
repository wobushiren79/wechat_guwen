var goodsHttp = require("../../../utils/http/RequestForGoods.js");
var platformHttp = require("../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var checkPermissions = require("../../../utils/CheckPermissions.js");
var pageUtil = require("../../../utils/PageUtil.js");
var content;
var storeId;
Page({
  data: {
  },

  onShow: function () {
    pageUtil.initData();
    getGoodsOrderList(null, [3, 4], storeId)
  },
  onLoad: function (e) {
    content = this; 
    content.setData({
      storeId: e.storeId
    })
    storeId = e.storeId
  },
  tel: function (e) {
    var tel = e.currentTarget.dataset.tel
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: tel, //仅为示例，并非真实的电话号码
      complete: function (res) {
        console.log(res)
      },
    })
  },
  //下拉添加记录条数
  onReachBottom() {
    getGoodsOrderList(null, [3, 4], storeId)
  },
  //下拉事件
  onPullDownRefresh: function () {
    //关闭下拉
    wx.stopPullDownRefresh()
  },
  //评价
  appraise: function (e) {
    // wx.showLoading({
    //   title: '请稍后',
    //   mask: true,
    // })
    var orderId = e.currentTarget.dataset.orderid
    console.log(orderId)
  }
});

/**
 * 获取订单列表
 */
function getGoodsOrderList(payStatus, orderStatus, storeId) {
  var getRequest = pageUtil.getPageData();
  getRequest.content = new Object();
  if (payStatus != null) {
    getRequest.content.payStatus = payStatus
  }
  if (orderStatus != null) {
    getRequest.content.orderStatus = orderStatus
  }
  if (storeId != null) {
    getRequest.content.storeId = storeId
  }
  var getCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      content.setData({
        list: data,
        xinshi: isLast
      })
    },
    function (data, res) {
      toastUtil.showToast("查询失败")
    }
  );
  goodsHttp.getGoodsOrderList(getRequest, getCallBack);
}
