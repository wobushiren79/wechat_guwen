var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.goodsPHPUrl;

/**
 * 查询顾问门店列表信息
 */
function findAdviserStoreList(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "Api/Stores/MoreDistanceQueryStores", data, callback, false)
}

/**
 * 获取门店详情
 */
function findStoreInfoByStoreId(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "Api/Stores/storesInfo", data, callback, true)
}

/**
 * 获取商品分类详情
 */
function findStoreGoodsClass(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "Api/Stores/storesClass", data, callback, true)
}


/**
 * 获取商品分类详情
 */
function findStoreGoods(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "Api/Stores/storesGoods", data, callback, true)
}

/**
 * 获取商品详情
 */
function findGoodsDetails(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "Api/getgoods/getattrgoods", data, callback, true)
}

/**
 * 获取商品详情
 */
function findGoodsInfo(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "Api/Goods/details", data, callback, true)
}

/**
 * 微信支付
 */
function wechatPay(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "api/Weixing/Ctoken", data, callback, true)
}

/**
 * 关联支付订单
 */
function updateOutTradeNo(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "api/goods/order/updateOutTradeNo", data, callback, true)
}

/**
 * 门店搜索
 */
function storesSearch(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "api/Stores/StoresSearch", data, callback, true)
}

/**
 * 获取所有渠道ID
 */
function getChannel(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "api/Channel/channel", data, callback, true)
}

/**
 * 获取商品推荐标题
 */
function getLabelTag(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "api/Label/label", data, callback, true)
}

/**
 * 获取商品推荐内容
 */
function getLabelGoods(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "api/Label/lobelgoods", data, callback, true)
}

module.exports.findAdviserStoreList = findAdviserStoreList;
module.exports.findStoreInfoByStoreId = findStoreInfoByStoreId;
module.exports.findStoreGoodsClass = findStoreGoodsClass;
module.exports.findStoreGoods = findStoreGoods;
module.exports.findGoodsDetails = findGoodsDetails;
module.exports.findGoodsInfo = findGoodsInfo;
module.exports.wechatPay = wechatPay;
module.exports.updateOutTradeNo = updateOutTradeNo;
module.exports.storesSearch = storesSearch;
module.exports.getChannel = getChannel;
module.exports.getLabelTag = getLabelTag;
module.exports.getLabelGoods = getLabelGoods;