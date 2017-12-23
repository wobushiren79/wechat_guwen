var goodsPHPHttp = require("../../utils/http/RequestForPHPGoods.js");
var goodsHttp = require("../../utils/http/RequestForGoods.js");
var platformHttp = require("../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../utils/ToastUtil.js");
var storageKey = require("../../utils/storage/StorageKey.js");
var pageUtil = require("../../utils/PageUtil.js");
var checkPermissions = require("../../utils/CheckPermissions.js");
var content;

Page({
  data: {
    list_show: false,
    img_wrap: false,
    popup: false,
    package_a: false
  },
  bind_list: function () {
    var that = this;
    that.setData({
      list_show: (!that.data.list_show)
    })
  },
  bind_img: function () {
    var that = this;
    that.setData({
      img_wrap: (!that.data.img_wrap)
    })
  },
  call_phone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone,
      fail: function (res) {
        wx.showToast({
          title: '拨打电话失败',
          image: '../../images/icon_info.png',
          duration: 3000
        })
      }
    })
  },
  kehuphone: function () {
    wx.makePhoneCall({
      phoneNumber: '966188',
      fail: function (res) {
        wx.showToast({
          title: '拨打电话失败',
          image: '../../images/icon_info.png',
          duration: 3000
        })
      }
    })
  },
  popup_close: function () {
    this.setData({
      popup: false
    })
  },
  package_b: function () {
    this.setData({
      get_goodsItemPerforms: [],
      package_a: false
    })
  },
  onLoad: function (evet) {
    content = this;

    //是否职业顾问
    wx.getStorage({
      key: 'amateurLevel',
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

    var orderId = evet.orderid
    getGoodsOrderDetails(orderId)
  },
  packages: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后',
    })
    var get_goodsItemPerforms = []
    var id = e.currentTarget.dataset.id
    var goodsItemPerforms = that.data.listData
    for (var i in goodsItemPerforms.goodsPackages) {
      if (goodsItemPerforms.goodsPackages[i].id == id) {
        get_goodsItemPerforms = goodsItemPerforms.goodsPackages[i].goodsItemPerforms
      }
    }
    that.setData({
      get_goodsItemPerforms: get_goodsItemPerforms,
      package_a: true
    })
    wx.hideLoading()
  },
  zhixing: function (e) {
    var performId = e.currentTarget.dataset.id
    findPerformInfoByPerformId(performId)
  },
  queren: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../service_goods_order/service_goods_order?orderId=' + orderId
    })
  },
  fukuang: function (e) {
    var orderId = e.currentTarget.dataset.orderid
    wx.navigateTo({
      url: '../service_goods_pay/service_goods_pay?orderId=' + orderId
    })
  }
});


/**
 * 订单详情
 */
function getGoodsOrderDetails(orderId) {
  var getRequest = {
    id: orderId
  }
  var getCallBack = {
    success: function (data, res) {
      content.setData({
        listData: data
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }
  goodsHttp.getGoodsOrderDetails(getRequest, getCallBack)
}


/**
 * 获取执行详情
 */
function findPerformInfoByPerformId(performId) {
  var findRequest = {
    performId: performId
  }
  var findCallBack = {
    success: function (data, res) {
      content.setData({
        zhixing: data,
        popup: true
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取详情失败");
    }
  }

  findPerformInfoByPerformId(findRequest, findCallBack);
}