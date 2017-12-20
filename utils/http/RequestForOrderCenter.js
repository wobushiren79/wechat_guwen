var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.javaOrderCenterUrl;

/**
 * 登陆工单
 */
function loginOrderCenter(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "login_subsystem_api", data, callback, true)
}

module.exports.loginOrderCenter = loginOrderCenter;