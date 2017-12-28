var storageKey = require("../utils/storage/StorageKey.js");

/**
 * 检测是否有相应权限
 */
function hasPermission(roleCode) {
  return baseCheckPermissions(roleCode);
}
/**
 * 检测是否有非职业顾问权限
 */
function hasGoodsAdvisor() {
  return baseCheckPermissions("goods.advisor");
}

/**
 * 检测是否有非职业顾问权限
 */
function hasGoodsAdvisorAmateur() {
  return baseCheckPermissions("goods.advisor.amateur");
}

/**
 * 检测是否有接单权限
 */
function hasOrderCenterAdvisor() {
  return baseCheckPermissions("orderc.executor");
}

/**
 * 检测是否有简单权限
 */
function hasOrderCenterBuilder() {
  return baseCheckPermissions("orderc.advisor");
}

/**
 * 检测是否有公墓系统顾问权限
 */
function hasCemeteryAdvisor() {
  return baseCheckPermissions("cemetery.advisor");
}

/**
 * 检测是否有公墓系统洽谈权限
 */
function hasCemeteryTalker() {
  return baseCheckPermissions("cemetery.talker");
}


function baseCheckPermissions(roleCode) {
  var resourceCodes = wx.getStorageSync(storageKey.PLATFORM_RESOURCE_CODES)
  if (!resourceCodes) {
    wx.navigateTo({
      url: '/pages/login/login',
    })
  } else {
    for (var i in resourceCodes) {
      if (resourceCodes[i] == roleCode) {
        return true;
      }
    }
  }
  return false;
}

module.exports.hasPermission = hasPermission;
module.exports.hasGoodsAdvisor = hasGoodsAdvisor;
module.exports.hasGoodsAdvisorAmateur = hasGoodsAdvisorAmateur;
module.exports.hasOrderCenterAdvisor = hasOrderCenterAdvisor;
module.exports.hasCemeteryAdvisor = hasCemeteryAdvisor;
module.exports.hasCemeteryTalker = hasCemeteryTalker;
module.exports.hasOrderCenterBuilder = hasOrderCenterBuilder;