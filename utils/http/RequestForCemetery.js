var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.JavaCemeteryUrl;

/**
 * 登陆公墓
 */
function loginCemetery(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "login_subsystem_api", data, callback, true)
}
/**
 * 查询墓位信息
 */
function findPositionByCondition(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/findPositionByCemeteryIdAndCondition", data, callback, true)
}

/**
 * 查询墓位详情
 */
function queryMgtFeeByPositionId(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/queryDetailByPositionId", data, callback, true)
}

/**
 * 查询墓位缴费记录
 */
function queryMgtFeePage(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/queryMgtFeePage", data, callback, true)
}

/**
 * 缴管理费
 */
function payMgt(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/payMgt", data, callback, true)
}

/**
 * 更新管理费商户订单号
 */
function updateOutTradeNo(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/fee/updateOutTradeNo", data, callback, true)
}
/**
 * 发送短信验证码
 */
function SendVerificationCode(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/wechat/sms", data, callback, true)
}

/**
 * 待看墓列表查询
 */
function orderListForWait(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/bespeak/build/list/wait", data, callback, true)
}

/**
 * 看墓中列表查询
 */
function orderListForLook(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/bespeak/build/list/look", data, callback, true)
}

/**
 * 未定墓列表查询
 */
function orderListForNo(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/bespeak/build/list/no", data, callback, true)
}

/**
 * 未定墓列表查询
 */
function orderListForHas(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/bespeak/build/list/has", data, callback, true)
}

/**
 * 获取订单详情
 */
function getOrderDetails(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/order/buycemetery/get", data, callback, true)
}

/**
 * 获取逝者信息
 */
function getOrderDeadInfo(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/order/dead/get", data, callback, true)
}

/**
 * 获取经办人信息
 */
function getOrderAgentInfo(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "marketing/order/agentinfo/get", data, callback, true)
}


module.exports.findPositionByCondition = findPositionByCondition;
module.exports.queryMgtFeeByPositionId = queryMgtFeeByPositionId;
module.exports.loginCemetery = loginCemetery;
module.exports.queryMgtFeePage = queryMgtFeePage;
module.exports.payMgt = payMgt;
module.exports.updateOutTradeNo = updateOutTradeNo;
module.exports.orderListForWait = orderListForWait;
module.exports.orderListForLook = orderListForLook;
module.exports.orderListForNo = orderListForNo;
module.exports.orderListForHas = orderListForHas;
module.exports.getOrderDetails = getOrderDetails;
module.exports.getOrderDeadInfo = getOrderDeadInfo;
module.exports.getOrderAgentInfo = getOrderAgentInfo;
module.exports.SendVerificationCode = SendVerificationCode;
