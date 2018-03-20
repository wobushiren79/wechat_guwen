var orderCenterHttp = require("../../../../utils/http/RequestForOrderCenter.js")
var toastUtil = require("../../../../utils/ToastUtil.js");
var pageUtil = require("../../../../utils/PageUtil.js");
var checkTools = require("../../../../utils/CheckTools.js")
var content;
var orderId;
Page({
  data: {
    icon: "/images/dog_chang.jpg",
    icon2: "/images/dog.png",
    tab_0: 0,
    tab_1: 0,
    tab_2: 0,
    tab: 0,
    popup_img: false,
    name: [],
    call: false,
    right_nav: 0,
    mystroe_right_nav_btn: '/images/mystroe_right_nav_btn.png',
    cemetery:''
  },
  /**
    * 上拉
    */
  onReachBottom: function (e) {
    content=this
    if (content.data.tab == 0){
      payList(orderId)
    }
    if (content.data.tab == 1){
      useList(orderId)
    }
  },
  //下拉事件
  onPullDownRefresh: function () {
    //关闭下拉
    this.onShow();
    wx.stopPullDownRefresh();
  },
  bind_tab: function (e) {
    pageUtil.initData();
    if (e.currentTarget.dataset.tab == 0) {
      payList(orderId)
    }
    if (e.currentTarget.dataset.tab == 1) {
      useList(orderId)
    }
    this.setData({
      tab: e.currentTarget.dataset.tab
    })
  },
  // 快捷导航
  bind_right_nav: function (e) {
    if (content.data.right_nav == 1) {
      content.setData({
        right_nav: 0,
        mystroe_right_nav_btn: '/images/mystroe_right_nav_btn.png'
      });
    } else {
      content.setData({
        right_nav: 1,
        mystroe_right_nav_btn: '/images/mystroe_right_nav_btn_close.png'
      });
    }
  },
  onShow:function(){
    pageUtil.initData();
    depositDetails(orderId)
    if (content.data.tab == 0) {
      payList(orderId)
    }
    if (content.data.tab == 1) {
      useList(orderId)
    }
  },
  onLoad:function(evet){
    content=this
    pageUtil.initData();
     orderId = evet.orderId
    content.setData({
      orderId: orderId
    })
  }
});
/**
 * 查询缴纳定金记录
 */
function payList(orderId) {
  var getListRequest = pageUtil.getPageData();
  getListRequest.params = new Object();
  getListRequest.params.orderId = orderId

  var getListCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      content.setData({
    
        pay_list: data
      })
    },
    function (data, res) {
      toastUtil.showToast("获取列表失败");
    }
  )
  orderCenterHttp.payList(getListRequest, getListCallBack);
}
/**
 * 查询定金使用记录
 */
function useList(orderId) {
  var getListRequest = pageUtil.getPageData();
  getListRequest.params = new Object();
  getListRequest.params.orderId = orderId

  var getListCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      content.setData({
        use_list: data
      })
    },
    function (data, res) {
      toastUtil.showToast("获取列表失败");
    }
  )
  orderCenterHttp.useList(getListRequest, getListCallBack);
}
/**
 * 查询定金详情
 */
function depositDetails(orderId) {
  var order_id={}
  order_id.orderId = orderId
  var createOrderCallBack = {
    success: function (data) {
      // debugger
      content.setData({
        details: data.depositSummary
      })
    },
    fail: function (data, res) {
      toastUtil.showToast(data)
    }
  }
  orderCenterHttp.depositDetails(order_id, createOrderCallBack);
}