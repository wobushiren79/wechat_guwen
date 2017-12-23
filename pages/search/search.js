var goodsPHPHttp = require("../../utils/http/RequestForPHPGoods.js");
var toastUtil = require("../../utils/ToastUtil.js");
var storageKey=require("../../utils/storage/StorageKey.js");
var content;
Page({
  data: {
    listshow: false,
    puxiao: ''
  },
  onLoad: function () {
    content = this;
    var that = this
    // 取出渠道信息
    wx.getStorage({
      key: storageKey.GOODS_CHANNEL,
      success: function (res) {
        // console.log(res.data.id)
        that.setData({
          channel_id: res.data.id
        })
      }
    })
  },
  quxiao: function () {
    this.setData({
      listshow: false,
      puxiao: ''
    })
  },
  bindKeyInput: function (e) {
    var channelId = content.data.channel_id
    var searchName = e.detail.value
    searchGoodsByName(channelId, searchName)
  },
  search_b: function (opt) {
    var channelId = content.data.channel_id
    var searchName = opt.currentTarget.dataset.search
    searchGoodsByName(channelId, searchName)
  }
});


/**
 * 搜索商品
 */
function searchGoodsByName(channelId, searchName) {
  var searchRequest = {
    channel_id: channelId,
    search: searchName
  }
  var searchCallBack = {
    success: function (data, res) {
      content.setData({
        search_data: res.data.list,
        listshow: true,
        puxiao: '取消'
      })
    },
    fail: function (data, res) {
      toastUtil.showToast("搜索失败");
    }
  }
  goodsPHPHttp.searchGoodsByName(searchRequest, searchCallBack);
}
