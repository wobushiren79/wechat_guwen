var goodsHttp = require("../../../../../utils/http/RequestForGoods.js");
var platformHttp = require("../../../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../../../utils/ToastUtil.js");
var storageKey = require("../../../../../utils/storage/StorageKey.js");
var checkPermissions = require("../../../../../utils/CheckPermissions.js");
var pageUtil = require("../../../../../utils/PageUtil.js");
var content;

Page({
    data: {
    },
    onShow: function () {
      pageUtil.initData();
      getOrderList(null, 0);
    },
    onLoad:function(){
      content=this
    },

    tel:function(e){
      var tel = e.currentTarget.dataset.tel
      wx.makePhoneCall({
        phoneNumber: tel, //仅为示例，并非真实的电话号码
        complete: function (res) {
          console.log(res)
        },
      })
    },
    //下拉添加记录条数
    onReachBottom:function() {
      getOrderList(null, 0);
    },
    //下拉事件
    onPullDownRefresh: function () {
      //关闭下拉
      wx.stopPullDownRefresh()
    },
    fukuang:function(e){
      var orderId = e.currentTarget.dataset.orderid
      wx.navigateTo({
        url: '/pages/goods/order/order_goods_paying/order_goods_paying?orderId=' + orderId
      })
    }
});

/**
 * 获取订单列表
 */
function getOrderList(orderStatus, payStatus) {
  var getListRequest = pageUtil.getPageData();
  getListRequest.content = new Object();
  if (orderStatus!=null)
    getListRequest.content.orderStatus = orderStatus;
  if (payStatus!=null)
    getListRequest.content.payStatus = payStatus;

  var getListCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      content.setData({
        list: data,
        xinshi: isLast
      })
    },
    function (data, res) {
      toastUtil.showToast("获取列表失败");
    }
  );
  goodsHttp.getGoodsOrderList(getListRequest, getListCallBack);
}