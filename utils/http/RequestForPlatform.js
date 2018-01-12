var baseRequest = require('base/BaseRequest.js')
var baseUrl = getApp().globalData.JavaPlatformUrl;

/**
 * 登陆平台
 */
function loginPlatform(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "applogin", data, callback, true)
}

/**
 * 手机号登陆
 */
function loginByPhone(data, callback) {
  baseRequest.sendPostHttpForLogin(baseUrl + "appLoginMobile", data, callback, true)
}


/**
 * 修改密码发送短信验证
 */
function changeForPassWord(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/usersInfo/forgetKeys", data, callback, true)
}

/**
 * 提交投诉
 */
function submitComplaints(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/opinions/complaint", data, callback, true)
}

/**
 * 提交评价
 */
function submitEvaluation(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/opinions/evaluation", data, callback, true)
}


/**
 * 根据评价对象ID查询评价list
 */
function findEvaluationListByUserId(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/opinions/list_evaluation", data, callback)
}


/**
 * 根据手机号获取验证码(注册)
 */
function sendVerificationCode(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/usersInfo/registerAccount", data, callback)
}

/**
 * 通过类型查询标签列表
 */
function queryTagsListByType(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/tags/listByType", data, callback)
}

/**
 * 查询用户星级
 */
function findUserStarts(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/advisorservice/findByUserId", data, callback)
}

/**
 * 查询评价标签
 */
function findListByEvaluateTag(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/tags/listByEvaluateTag", data, callback)
}

/**
 * 通过系统枚举id查询公墓列表
 */
function queryCemeterySubsysListBySysEnumId(data, callback) {
  baseRequest.sendPostHttp(baseUrl + "api/syssystem/getSubsystemList", data, callback);
}

/**
 * 通过系统枚举id查询公墓列表不需要登录
 */
function queryCemeterySubsysListBySysEnumIdNoLogin(data, callback) {
  baseRequest.sendPostHttp(baseUrl + "api/syssystem/getSubsystemListNoLogin", data, callback);
}

/**
 * 通过用户ID查询用户资料
 */
function queryUserInfoById(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/usersInfo/queryById", data, callback)
}

/**
 * 查询用户签到情况
 */
function queryCreditInfo(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/credit/getCredit", data, callback)
}

/**
 * 用户签到
 */
function userCreditSign(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/credit/checkin", data, callback)
}

/**
 * 查询用户级别
 */
function queryUserLevel(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/level/findbyuserids", data, callback)
}
/**
 * 根据级别类型查询级别
 */
function queryLevelByLevelType(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/level/findbytypes", data, callback)
}

/**
 * 获取钱包
 */
function getWalletInfo(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/wallet/getWallet", data, callback)
}
/**
 * 获取银行卡
 */
function getCashingInit(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/bankcard/cashingInit", data, callback, true)
}
/**
 * 提现银行卡提交
 */
function getApplyCash(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/bankcard/applyCash", data, callback, true)
}
/**
 * 查询银行卡列表
 */
function queryCardInfoForList(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/bankcard/queryCardInfoForList", data, callback, true)
}
/**
 * 设置默认银行卡
 */
function settingDefaultCard(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/bankcard/settingDefaultCard", data, callback, true)
}
/**
 * 获取银行卡名称
 */
function queryCardBins(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/bankcard/queryCardBins", data, callback, true)
}
/**
 * 添加银行卡
 */
function addingCard(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/bankcard/addingCard", data, callback, true)
}

/**
 * 获取提现记录
 */
function queryCashingLogs(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/wallet/queryCashingLogsForPage", data, callback, true)
}

/**
 * 获取短信验证码
 */
function getMsgCode(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/usersAccount/sendSmsCode", data, callback, true)
}

/**
 * 获取短信验证码
 */
function buildAccountForOrderCenterBuild(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/usersAccount/createOrderCenterBuild", data, callback, true)
}

/**
 * 获取提现记录
 */
function queryReturnCashLogsForPage(data, callback) {
  baseRequest.sendPostHttpForContent(baseUrl + "api/wallet/queryReturnCashLogsForPage", data, callback, true)
}

module.exports.addingCard = addingCard;
module.exports.queryCardBins = queryCardBins;
module.exports.settingDefaultCard = settingDefaultCard;
module.exports.queryCardInfoForList = queryCardInfoForList;
module.exports.getApplyCash = getApplyCash;
module.exports.getCashingInit = getCashingInit;
module.exports.loginPlatform = loginPlatform;
module.exports.changeForPassWord = changeForPassWord;
module.exports.submitComplaints = submitComplaints;
module.exports.submitEvaluation = submitEvaluation;
module.exports.findEvaluationListByUserId = findEvaluationListByUserId;
module.exports.sendVerificationCode = sendVerificationCode;
module.exports.queryTagsListByType = queryTagsListByType;
module.exports.findUserStarts = findUserStarts;
module.exports.findListByEvaluateTag = findListByEvaluateTag;
module.exports.queryCemeterySubsysListBySysEnumId = queryCemeterySubsysListBySysEnumId;
module.exports.queryCemeterySubsysListBySysEnumIdNoLogin = queryCemeterySubsysListBySysEnumIdNoLogin;
module.exports.queryUserInfoById = queryUserInfoById;
module.exports.loginByPhone = loginByPhone;
module.exports.queryCreditInfo = queryCreditInfo;
module.exports.userCreditSign = userCreditSign;
module.exports.getWalletInfo = getWalletInfo;
module.exports.queryUserLevel = queryUserLevel;
module.exports.queryCashingLogs = queryCashingLogs;
module.exports.getMsgCode = getMsgCode;
module.exports.buildAccountForOrderCenterBuild = buildAccountForOrderCenterBuild;
module.exports.queryReturnCashLogsForPage = queryReturnCashLogsForPage;
module.exports.queryLevelByLevelType = queryLevelByLevelType;