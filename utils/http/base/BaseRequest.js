var baseHttp = require('BaseHttpDeal.js')
var storageKey = require('../../storage/StorageKey.js');
var checkPermissions = require("../../CheckPermissions.js");

//-------------------------------------------------------------------------------------------------------------------
/**
 * 登陆专用post请求
 */
function sendPostHttpForLogin(url, data, callback, isDialog) {
  var contentData = {};
  var header = {
    "client-Type": "wechatapp",
    'content-type': 'application/json'
  };
  if (data)
    contentData = { content: data };

  var inCallBack = {
    success: function (data, res) {
      if (url.indexOf(getApp().globalData.JavaPlatformUrl) >= 0) {
        var ec = getKi4soEc(res);
      }
      var baseUrl = getBaseUrl(url);
      var sessionId = getSessionId(res, baseUrl);
      if (callback && callback.success) {
        callback.success(data, res);
      }
    },
    fail: function (data, res) {
      if (callback && callback.fail) {
        callback.fail(data, res);
      }
    }
  }
  if (url.indexOf(getApp().globalData.JavaPlatformUrl) >= 0) {
    baseHttp.createPostHttpRequest(url, contentData, inCallBack, header, isDialog);
  } else {
    url += ("?" + wx.getStorageSync(storageKey.KI4SO_SERVER_EC));
    baseHttp.createGetHttpRequest(url, contentData, inCallBack, header, isDialog);
  }
}

/**
 * 发送post请求
 */
function sendPostHttp(url, data, callback, isDialog) {
  var baseUrl = getBaseUrl(url);
  var cookies = wx.getStorageSync(baseUrl);
  var header = {
    "Cookie": cookies,
    'content-type': 'application/json',
  };
  callback.loginAgain = function () {
    loginPlatForm();
  }
  baseHttp.createPostHttpRequest(url, data, callback, header, isDialog);
}
/**
 * 发送post请求form表单提交
 */
function sendPostHttpForForm(url, data, callback, isDialog) {
  var baseUrl = getBaseUrl(url);
  var cookies = wx.getStorageSync(baseUrl);
  var header = {
    "Cookie": cookies,
    "content-type": "application/x-www-form-urlencoded"
  };
  callback.loginAgain = function () {
    loginPlatForm();
  }
  baseHttp.createPostHttpRequestForFormData(url, data, callback, header, isDialog);
}

/**
 * 发送post请求并封装成content
 */
function sendPostHttpForContent(url, data, callback, isDialog) {
  var contentData = {};
  var baseUrl = getBaseUrl(url);
  var cookies = wx.getStorageSync(baseUrl);
  var header = {
    "Cookie": cookies,
    'content-type': 'application/json',
  };
  if (data)
    contentData = { content: data };
  callback.loginAgain = function () {
    loginPlatForm();
  }
  baseHttp.createPostHttpRequest(url, contentData, callback, header, isDialog);
}

/**
 * 发送get请求
 */
function sendGetHttp(url, data, callback, isDialog){
  var contentData = {};
  var baseUrl = getBaseUrl(url);
  baseHttp.createGetHttpRequest(url, contentData, callback, null, isDialog);
}
/**
 * 发送文件
 */
function sendFileHttpForContent(url, filePath, fileName, callback, isDialog) {
  callback.loginAgain = function () {
    loginPlatForm();
  }
  baseHttp.createFileHttpRequest(url, filePath, fileName, callback, null, isDialog);
}

//-------------------------------------------------------------------------------------------------------------------
/**
 * 获取头文件的KI4SO_SERVER_EC
 */
function getKi4soEc(res) {
  var cookis = res.header['Set-Cookie']
  if (cookis == null)
    return;
  var cookisarr = cookis.split(";");
  if (cookisarr != -1)
    for (var i = 0; i < cookisarr.length; i++) {
      if (cookisarr[i].indexOf(storageKey.KI4SO_SERVER_EC) >= 0) {
        var temp = cookisarr[i].replace(" HttpOnly,", "");
        var tempRemember = temp.replace("rememberMe=deleteMe", "");
        var returnTemp = tempRemember.replace(",", "").replace(" ", "");
        wx.setStorageSync(storageKey.KI4SO_SERVER_EC, returnTemp);
        return returnTemp;
      }
    }
}

/**
 * 获取sessionId
 */
function getSessionId(res, baseUrl) {
  var cookis = res.header['Set-Cookie']
  if (cookis == null)
    return;
  var cookisarr = cookis.split(";");
  if (cookisarr != -1)
    for (var i = 0; i < cookisarr.length; i++) {
      if (cookisarr[i].indexOf("JSESSIONID") >= 0) {
        wx.setStorageSync(baseUrl, cookisarr[i]);
        return cookisarr[i];
      }
    }
}
/**
 * 获取基础url
 */
function getBaseUrl(url) {
  var hostLocation = url.indexOf("/", 8);
  return url.substring(0, hostLocation);
}

//-------------------------------------------------------------------------------------------------------------------


/**
 * 登陆平台
 */
function loginPlatForm() {
  if (wx.getStorageSync(storageKey.LOGIN_USER_NAME) == null || wx.getStorageSync(storageKey.LOGIN_USER_NAME).length == 0) {
    wx.navigateTo({
      url: '/pages/login/login',
    });
    return
  }
  var loginPlatData = {
    userName: wx.getStorageSync(storageKey.LOGIN_USER_NAME),
    userPwd: wx.getStorageSync(storageKey.LOGIN_USER_PASS)
  }
  var loginPlatCallBack = {
    success: function (data, res) {
      if (data) {
        //缓存用户名和密码
        wx.setStorageSync(storageKey.LOGIN_USER_NAME, loginPlatData.userName)
        wx.setStorageSync(storageKey.LOGIN_USER_PASS, loginPlatData.userPwd)
        //缓存平台登录用户ID
        if (data.userId)
          wx.setStorageSync(storageKey.PLATFORM_USER_ID, data.userId)
        //缓存用户信息
        if (data.userObj)
          wx.setStorageSync(storageKey.PLATFORM_USER_OBJ, data.userObj)
        //缓存用户权限
        if (data.resourceCodes)
          wx.setStorageSync(storageKey.PLATFORM_RESOURCE_CODES, data.resourceCodes)
        getUserLevel();
      }
    },
    fail: function (data, res) {
      wx.navigateTo({
        url: '/pages/login/login',
      });
    }
  }
  sendPostHttpForLogin(getApp().globalData.JavaPlatformUrl + "applogin", loginPlatData, loginPlatCallBack, true)
}

/**
 * 登陆单项
 */
function loginGoods() {
  var loginGoodsCallBack = {
    success: function (data, res) {
      loginOrderCenter();
    },
    fail: function (data, res) {
      loginOrderCenter();
    }
  }
  sendPostHttpForLogin
  (getApp().globalData.JavaGoodsUrl + "login_sys_api", null, loginGoodsCallBack, true)
}
/**
 * 登陆工单系统
 */
function loginOrderCenter() {
  var loginOrderCenterCallBack = {
    success: function (data, res) {
      loginCemetery();
    },
    fail: function (data, res) {
      loginCemetery();
    }
  }
  sendPostHttpForLogin
    (getApp().globalData.javaOrderCenterUrl + "login_subsystem_api", null, loginOrderCenterCallBack, true)
}
/**
 * 登陆公墓
 */
function loginCemetery() {
  var loginCemeteryCallBack = {
    success: function (data, res) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    fail: function (data, res) {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    }
  }
  sendPostHttpForLogin
  (getApp().globalData.JavaCemeteryUrl + "login_subsystem_api", null, loginCemeteryCallBack, true)
}

/**
 * 查询用户级别
 */
function getUserLevel() {
  var resourceCodes = wx.getStorageSync(storageKey.PLATFORM_RESOURCE_CODES)
  var userId = wx.getStorageSync(storageKey.PLATFORM_USER_ID)
  // var hasGoodsAdvisorAmateur = checkPermissions.hasGoodsAdvisorAmateur();
  // if (hasGoodsAdvisorAmateur) {
    var queryLevelRequest = {
      userIds: [userId]
    }
    var queryLevelCallBack = {
      success: function (data, res) {
        wx.setStorageSync(storageKey.AMATEUR_LEVEL, data.resultList)
        loginGoods();
      },
      fail: function (data, res) {
        loginGoods();
      }
    }
    sendPostHttpForContent
    (getApp().globalData.JavaPlatformUrl + "api/level/findbyuserids", queryLevelRequest, queryLevelCallBack, true)
    return;
  // }
  // loginGoods();
}
module.exports.sendPostHttpForLogin = sendPostHttpForLogin;
module.exports.sendPostHttp = sendPostHttp;
module.exports.sendPostHttpForForm = sendPostHttpForForm;
module.exports.sendPostHttpForContent = sendPostHttpForContent;
module.exports.sendFileHttpForContent = sendFileHttpForContent;
module.exports.sendGetHttp = sendGetHttp;