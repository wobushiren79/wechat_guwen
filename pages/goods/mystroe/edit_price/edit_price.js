var goodsHttp = require("../../../utils/http/RequestForGoods.js");
var toastUtil = require("../../../utils/ToastUtil.js");
var content;
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    content = this;
    var price = options.price
    var orderId = options.orderId
    var path = options.path
    var storeId = options.storeId
    content.setData({
      price: price,
      orderId: orderId,
      path: path,
      storeId: storeId
    })
  },
  formSubmit: function (options) {
    var storeId = content.data.storeId
    var orderId = content.data.orderId
    var path = content.data.path
    var price = content.data.price
    var nowPrice = options.detail.value.now_price
    if (!getApp().AmountVerification(nowPrice)) {
      toastUtil.showToast('价格错误');
    } else {
      //组装请求修改价格接口参数
      var changInfo = {}
      var get_data = {}
      var star = nowPrice.indexOf('.')
      if (star == -1) {
        changInfo.priceNew = nowPrice * 100
      } else {
        var a = parseInt(nowPrice.substring(0, star)) * 100
        var b = nowPrice.substring(star + 1)
        if (b.length == 1) {
          var c = parseInt(b) * 10
        } else {
          var c = parseInt(b)
        }

        changInfo.priceNew = a + c
      }
      changInfo.orderId = orderId
      changInfo.priceOriginal = price
      changeOrderPrice(changInfo)
    }
  }
})
/**
 * 修改价格
 */
function changeOrderPrice(changeRequest) {

  var changeCallBack = {
    success: function (data, res) {
      wx.navigateBack({
        delta: 1
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("修改失败")
    }
  }
  goodsHttp.changeOrderPrice(changeRequest, changeCallBack)
}