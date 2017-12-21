var goodsHttp = require("../../utils/http/RequestForGoods.js");
var platformHttp = require("../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../utils/ToastUtil.js");
var storageKey = require("../../utils/storage/StorageKey.js");
var checkPermissions = require("../../utils/CheckPermissions.js");
var pageUtil = require("../../utils/PageUtil.js");
var content;
Page({
  data: {
    pageSize: 3,
    pageNumber: 0

  },
  onShow: function () {
    pageUtil.initData();
    //是否职业顾问
    wx.getStorage({
      key: storageKey.AMATEUR_LEVEL,
      success: function (res) {
        content.setData({
          amateurLevel: true
        })
      },
      fail: function () {
        content.setData({
          amateurLevel: false
        })
      }
    })
    getOrderList([3,4], null);
  },
  onLoad: function () {
    content = this;
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
    getOrderList([3, 4], null);
  },
});
/**
 * 获取订单列表
 */
function getOrderList(orderStatus, payStatus) {
  var getListRequest = pageUtil.getPageData();
  getListRequest.content = new Object();
  if (orderStatus)
    getListRequest.content.orderStatus = orderStatus;
  if (payStatus)
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