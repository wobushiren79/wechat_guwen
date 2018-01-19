var goodsHttp = require("../../../../utils/http/RequestForGoods.js")
var toastUtil = require("../../../../utils/ToastUtil.js");
var storageKey = require("../../../../utils/storage/StorageKey.js");
var content;
Page({
  data: {
    showTotalPrice: 0,
    totalPrice: 0,
  },
  onLoad: function (evet) {
    content = this;
    findGoodsOrderByOrderId(evet.orderId)
  },

  fukuang: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    submitOrder(orderId)
  }
})

/**
 * 查询订单详情
 */
function findGoodsOrderByOrderId(orderId) {
  var findRequest = {
    orderId: orderId
  }
  var findCallBack = {
    success: function (data, res) {
      content.setData({
        showTotalPrice: data.showTotalPrice,
        totalPrice: data.totalPrice,
        orderNumber: data.orderNumber,
        orderId: orderId
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("查询失败")
    }
  }
  goodsHttp.findGoodsOrderByOrderId(findRequest, findCallBack);
}

/**
 * 提交订单
 */
function submitOrder(orderId) {
  if (!orderId) {
    toastUtil.showToast("没有orderId")
    return
  }
  var submitRequest = {
    orderId: orderId
  }
  var submitCallBack = {
    success: function (data, res) {
      wx.redirectTo({
        url: '/pages/goods/order/order_goods_pay/order_goods_pay?orderId=' + orderId
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("提交失败");
    }
  }
  goodsHttp.confirmGoodsOrder(submitRequest, submitCallBack);
}


