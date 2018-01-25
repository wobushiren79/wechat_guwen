var goodsPHPHttp = require("../../../../utils/http/RequestForPHPGoods.js");
var platformHttp = require("../../../../utils/http/RequestForPlatform.js");
var toastUtil = require("../../../../utils/ToastUtil.js");
var storageKey = require("../../../../utils/storage/StorageKey.js");
var pageUtil = require("../../../../utils/PageUtil.js");
var checkPermissions = require("../../../../utils/CheckPermissions.js");
var content;
Page({
  data: {
    goods_name: '',
    pageNumber: 0,
    pageSize: 4,
    order: 'total desc'
  },
  onLoad: function (e) {
    content = this;

    var orderBy = content.data.order
    var classAttId = e.id;
    var channelId = wx.getStorageSync(storageKey.GOODS_CHANNEL);

    content.setData({
      channel_id: channelId
    })
    pageUtil.initData();
    searchGoods(orderBy, channelId.id, classAttId);
  },

  jiage1: function () {
    var orderBy = 'total asc'
    var channelId = content.data.channel_id
    var classAttId = content.data.id

    pageUtil.initData();
    searchGoods(orderBy, channelId, classAttId);

    content.setData({
      xiaoliang: false,
      jiage: 0
    })
  },

  jiage2: function () {
    var orderBy = 'sort desc'
    var channelId = content.data.channel_id
    var classAttId = content.data.id

    pageUtil.initData();
    searchGoods(orderBy, channelId, classAttId);

    content.setData({
      xiaoliang: false,
      jiage: 1
    })
  },

  xiaoliang: function () {
    var orderBy = 'sale_amount desc'
    var channelId = content.data.channel_id
    var classAttId = content.data.id

    pageUtil.initData();
    searchGoods(orderBy, channelId, classAttId);

    content.setData({
      xiaoliang: true,
      jiage: 3
    })
  },

  //搜索
  bindKeyInput: function (e) {
    var orderBy = content.data.order
    var channelId = content.data.channel_id
    var classAttId = content.data.id
    var goodsName = e.detail.value;

    pageUtil.initData();
    searchGoods(orderBy, channelId, classAttId, goodsName);
  },

  //下拉添加记录条数
  onReachBottom:function () {
    var orderBy = content.data.order
    var classAttId = content.data.id
    var channelId = content.data.channel_id
    searchGoods(orderBy, channelId, classAttId);
  }
});


/**
 * 查询商品
 */
function searchGoods(orderBy, channelId, classAttrId, goodsName) {
  var searchGoodsRequest = pageUtil.getPageData();
  searchGoodsRequest.channel_id = channelId;
  searchGoodsRequest.order = orderBy;
  searchGoodsRequest.id = classAttrId;
  if (goodsName && goodsName.length > 0)
    searchGoodsRequest.goods_name = goodsName;

  var searchGoodsCallBack = pageUtil.getPageCallBack(
    function (data, res, isLast) {
      content.setData({
        list: data,
        channel_id: channelId,
        id: classAttrId,
        xianshi: isLast
      })
    },
    function (data, res) {
      toastUtil.showToast("查询失败");
    }
  );

  goodsPHPHttp.searchGoods(searchGoodsRequest, searchGoodsCallBack);
}