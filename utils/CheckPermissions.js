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
function hasGoodsAdvisorAmateur() {
  return baseCheckPermissions("goods.advisor.amateur");
}

/**
 * 检测是否有分单系统顾问权限
 */
function hasOrderCenterAdvisor() {
  return baseCheckPermissions("orderc.advisor");
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
module.exports.hasGoodsAdvisorAmateur = hasGoodsAdvisorAmateur;
module.exports.hasOrderCenterAdvisor = hasOrderCenterAdvisor;
