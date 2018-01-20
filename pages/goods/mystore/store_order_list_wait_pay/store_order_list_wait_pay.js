var goodsHttp = require("../../../../utils/http/RequestForGoods.js");
var platformHttp = require("../../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../../utils/ToastUtil.js");
var storageKey = require("../../../../utils/storage/StorageKey.js");
var checkPermissions = require("../../../../utils/CheckPermissions.js");
var pageUtil = require("../../../../utils/PageUtil.js");
var content;
var storeId;
Page({
  data: {
  },

  onShow: function () {
    pageUtil.initData();
    getGoodsOrderList(0, null, storeId)
  },
  onLoad: function (e) {
    content = this;
    content.setData({
      storeId: e.storeId
    })
    storeId = e.storeId
  },
  //下拉事件
  onPullDownRefresh: function () {
    //关闭下拉
    wx.stopPullDownRefresh()
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
  //下拉添加记录条数
  onReachBottom: function (){
    getGoodsOrderList(0, null, storeId)
  },


  fukuang: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '/pages/goods/order/order_goods_paying/order_goods_paying?orderId=' + orderId + '&store=1'
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
      url: '/pages/goods/mystore/store_edit_price/store_edit_price?orderId=' + orderId + '&price=' + price + '&path=' + path + '&storeId=' + storeId,
    })
  }
});

/**
 * 获取订单列表
 */
function getGoodsOrderList(payStatus, orderStatus, storeId) {
  var getRequest = pageUtil.getPageData();
  getRequest.content = new Object();
  if (payStatus!=null) {
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