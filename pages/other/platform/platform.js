var goodsPHPHttp = require("../../../utils/http/RequestForPHPGoods.js");
var platformHttp = require("../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../utils/ToastUtil.js");
var storageKey = require("../../../utils/storage/StorageKey.js");
var checkPermissions = require("../../../utils/CheckPermissions.js");
var content;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCenter: false,
    cemeteryAdvisor: false,
    goodsAdvisor: false,
    orderCenterBuild:false
  },

  onShow: function () {
    content.setData({
      orderCenter: false,
      cemeteryAdvisor: false,
      goodsAdvisor: false,
    })

    if (checkPermissions.hasCemeteryAdvisor()) {
      content.setData({
        cemeteryAdvisor: true
      })
    }
    if (checkPermissions.hasGoodsAdvisor() || checkPermissions.hasGoodsAdvisorAmateur()) {
      content.setData({
        goodsAdvisor: true
      })
    }
    if ((checkPermissions.hasOrderCenterBuilder() && checkPermissions.hasOrderCenterExecutor())
      || (!checkPermissions.hasOrderCenterBuilder() && checkPermissions.hasOrderCenterExecutor())) {
      content.setData({
        orderCenter: true
      })
    }
    if (checkPermissions.hasOrderCenterBuilder() ) {
      content.setData({
        orderCenterBuild: true
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    content = this;
  }
})