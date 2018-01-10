var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.appPHPUrl;

/**
 * 查询顾问门店列表信息
 */
function getHelpList(data, callback) {
  baseRequest.sendGetHttp(baseUrl + "Home/index/help", data, callback, true)
}

module.exports.getHelpList = getHelpList;


