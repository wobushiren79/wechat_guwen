var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.javaOrderCenterUrl;

/**
 * 登陆工单
 */
function loginOrderCenter(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "login_subsystem_api", data, callback, true)
}

/**
 * 创建工单
 */
function createOrder(data, callback) {
  baseRequest.sendPostHttpForForm(baseUrl + "api/workorder/create", data, callback, true)
}

module.exports.loginOrderCenter = loginOrderCenter;
module.exports.createOrder = createOrder;