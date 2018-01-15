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
    getGoodsOrderList(null, [1,2], storeId)
  },
  onLoad: function (e) {
    content = this;
    storeId = e.storeId
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
  //下拉事件
  onPullDownRefresh: function () {
    //关闭下拉
    wx.stopPullDownRefresh()
  },
  //下拉添加记录条数
  onReachBottom() {
    getGoodsOrderList(null, [1, 2], storeId)
  },
  fukuang: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../../service_goods_pay/service_goods_pay?orderId=' + orderId + '&store=1'
    })
  },
  //修改价格
  EditPrice: function (e) {
    var that = this
    var pages = getCurrentPages()
    var path = pages[pages.length - 1].route
    var orderId = e.currentTarget.dataset.orderid
    var price = e.currentTarget.dataset.price
    var storeId = that.data.storeId
    wx.navigateTo({
      url: '../edit_price/edit_price?orderId=' + orderId + '&price=' + price + '&path=' + path + '&storeId=' + storeId,
    })
  }
});
/**
 * 获取订单列表
 */
function getGoodsOrderList(payStatus, orderStatus, storeId) {
  var getRequest = pageUtil.getPageData();
  getRequest.content = new Object();
  if (payStatus) {
    content.payStatus = payStatus
  }
  if (payStatus) {
    content.orderStatus = orderStatus
  }
  if (payStatus) {
    content.storeId = storeId
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