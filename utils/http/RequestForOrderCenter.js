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
  baseRequest.sendPostHttpForContent(baseUrl + "api/workorder/create", data, callback, true)
}

/**
 * 获取工单列表
 */
function getOrderList(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/performer/list", data, callback, true)
}

/**
 * 接单
 */
function acceptOrder(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/performer/accept", data, callback, true)
}

/**
 * 工单处理
 */
function dealOrder(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/performer/dealAgain", data, callback, true)
}

/**
 * 工单处理
 */
function getCarInfo(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/car/check", data, callback, true)
}

/**
 * 创建用车申请
 */
function createCarOrder(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/car/create", data, callback, true)
}

module.exports.loginOrderCenter = loginOrderCenter;
module.exports.createOrder = createOrder;
module.exports.getOrderList = getOrderList;
module.exports.acceptOrder = acceptOrder;
module.exports.dealOrder = dealOrder;
module.exports.getCarInfo = getCarInfo;
module.exports.createCarOrder = createCarOrder;