var goodsPHPHttp = require("../../utils/http/RequestForPHPGoods.js");
var toastUtil = require("../../utils/ToastUtil.js");
var storageKey = require("../../utils/storage/StorageKey.js");
var content;
Page({
  data: {

  },
  goodsclass: function (e) {
    var classId = e.target.dataset.id
    var index = e.target.dataset.index
    var name = e.target.dataset.name
    content.setData({
      active: index,
      name: name,
    })
    getClassAttrGoods(classId);
  },
  
  onShow:function(){
  
  },
  onLoad: function () {
    content = this;
    var channelId = wx.getStorageSync(storageKey.GOODS_CHANNEL);
    var userId = wx.getStorageSync(storageKey.PLATFORM_USER_ID);
    if (!channelId || !userId) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
      return
    }
    getGoodsClass(channelId.id, userId);
  }
});


/**
 * 获取商品分类
 */
function getGoodsClass(channelId, userId) {
  var getGoodsClassRequest = {
    channel_id: channelId,
    user_id: userId,
  }
  var getGoodsClassCallBack = {
    success: function (data, res) {
      var list = res.data.list
      if (list && list.length > 0) {
        content.setData({
          list: list,
          active: 0,
          name: list[0].name,
          channeldata: channelId,
        })
        getClassAttrGoods(list[0].id)
      }
    },
    fail: function () {
      toastUtil.showToast("获取分类失败")
    }
  }

  goodsPHPHttp.getGoodsClass(getGoodsClassRequest, getGoodsClassCallBack);
}

/**
 * 获取分类下列表
 */
function getClassAttrGoods(classId) {
  var getClassAttrGoodsRequest = {
    id: classId
  }
  var getClassAttrGoodsCallBack = {
    success: function (data, res) {
      var attrlist = res.data.list
      if (!attrlist)
        return
      content.setData({
        attrlist: attrlist,
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("获取商品失败");
    }
  }
  goodsPHPHttp.getClassAttrGoods(getClassAttrGoodsRequest, getClassAttrGoodsCallBack);
}