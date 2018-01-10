var platformHttp = require("../../../utils/http/RequestForPlatform.js");
var pageUtil = require("../../../utils/PageUtil.js")
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var checkPermissions = require("../../../utils/CheckPermissions.js");
var content;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  onShow: function () {
    pageUtil.initData();
    queryCashingLogs()
  },
  //上拉刷新
  onReachBottom: function () {
    // console.log(111111)
    queryCashingLogs()
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    content = this;

  },
})


/**
 * 查询提现记录
 */
function queryCashingLogs() {
  var queryRequest = pageUtil.getPageData();

  var queryCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      for (var i in data) {
        var price = parseInt(data[i].amount) / 100
        data[i].amount = getApp().ProcessingPrice(price)
        data[i].bank_card = data[i].bank_card.substring(data[i].bank_card.length - 4)
      }
      content.setData({
        list_data: data,
        xianshi: isLast,
      })
    },
    function (data, res) {
      toastUtil.showToast("查询失败");
    }
  );
  platformHttp.queryCashingLogs(queryRequest, queryCallBack);
}