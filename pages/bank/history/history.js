var platformHttp = require("../../../utils/http/RequestForPlatform.js");
var pageUtil = require("../../../utils/PageUtil.js")
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var checkPermissions = require("../../../utils/CheckPermissions.js");
var thisPageData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab_item: 0
  },
  bind_tab: function (e) {
    this.setData({
      tab_item: e.currentTarget.dataset.tab_item
    })
    pageUtil.initData();
    var currentTab = thisPageData.data.tab_item;
    if (currentTab == 0) {
      queryReturnCashLogs();
    } else {
      queryCashingLogs();
    }
  },
  onShow: function () {
    pageUtil.initData();
    var currentTab = thisPageData.data.tab_item;
    if (currentTab == 0) {
      queryReturnCashLogs();
    } else {
      queryCashingLogs();
    }
  },
  //下拉事件
  onPullDownRefresh: function () {
    //关闭下拉
    wx.stopPullDownRefresh()
  },
  //上拉刷新
  onReachBottom: function () {
    var currentTab = thisPageData.data.tab_item;
    if (currentTab == 0) {
      queryReturnCashLogs();
    } else {
      queryCashingLogs();
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    thisPageData = this;

  },
})


/**
 * 查询提现记录
 */
function queryCashingLogs() {
  var queryRequest = pageUtil.getPageData();
  queryRequest.pageSize = 10;
  var queryCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      for (var i in data) {
        var price = parseInt(data[i].amount) / 100
        data[i].amount = getApp().ProcessingPrice(price)
        data[i].bank_card = data[i].bank_card.substring(data[i].bank_card.length - 4)
      }
      thisPageData.setData({
        tixianList_data: data,
        tixianLast: isLast,
      })
    },
    function (data, res) {
      toastUtil.showToast("查询失败");
    }
  );
  platformHttp.queryCashingLogs(queryRequest, queryCallBack);
}

/**
 * 查询返现记录
 */
function queryReturnCashLogs() {
  var queryRequest = pageUtil.getPageData();
  queryRequest.pageSize = 10;
  var queryCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      for (var i in data) {
        var price = parseInt(data[i].money_amount) / 100
        data[i].amount = getApp().ProcessingPrice(price)
        if (data[i].trans_type == null || data[i].trans_type == ""){
          data[i].transTypeStr  = "其他";
        } else if (data[i].trans_type == "YJ_ReturnCash"){
          data[i].transTypeStr = "佣金提成";
        }

      }
      thisPageData.setData({
        fanxianList_data: data,
        fanxianLast: isLast,
      })
    },
    function (data, res) {
      toastUtil.showToast("查询失败");
    }
  );
  platformHttp.queryReturnCashLogsForPage(queryRequest, queryCallBack);
}