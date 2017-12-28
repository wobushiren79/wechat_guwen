var goodsPHPHttp = require("../../utils/http/RequestForPHPGoods.js");
var platformHttp = require("../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../utils/ToastUtil.js");
var storageKey = require("../../utils/storage/StorageKey.js");
var checkPermissions = require("../../utils/CheckPermissions.js");
var content;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderCenter: false,
    cemeteryAdvisor: false,
    goodsAdvisor: false,
  },

  onShow: function () {
    if (checkPermissions.hasOrderCenterAdvisor()) {
      content.setData({
        orderCenter: true
      })
      if (checkPermissions.hasCemeteryAdvisor()) {
        content.setData({
          cemeteryAdvisor: true
        })
        if (checkPermissions.hasOrderCenterBuilder()){
          content.setData({
            CenterBuilder: true
          })
        }
        if (checkPermissions.hasGoodsAdvisor() || checkPermissions.hasGoodsAdvisorAmateur) {
          content.setData({
            goodsAdvisor: true
          })
        }
      }
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    content = this;
  }
})