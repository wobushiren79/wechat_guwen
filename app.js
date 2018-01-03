App({
  onLaunch: function () {
    console.log('App Launch')
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  globalData: {
    hasLogin: false
  }
});
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    //图片地址前缀
    // ImgUrl: 'https://goodsmgr.e-funeral.cn/Public/Uploads/',
    // LocalUrl:"http://192.168.0.54/shian_goods/Api/",
    LocalUrl: "https://goodsmgr.e-funeral.cn/Api/",
    RouteUrl: "https://web.shianlife.cn/shianlife-adviser-1.0-SNAPSHOT/",
    //殡仪
    ByUrl: "https://t-cemetery-api.shianlife.cn/shianlife-adviser-1.0-SNAPSHOT/",
    // ByUrl: "http://192.168.0.37:8088/app/", 
    //公墓
    GmUrl: "https://t-cemetery-api.shianlife.cn/",
    // GmUrl: "http://192.168.0.43:8084/app/",
    // GmUrl: "http://192.168.0.59:8081/app/",
    AppUrl: "https://app.e-funeral.cn/",
    // javaApi:"http://192.168.0.199:8299/goods/"   权哥
    //小慌
    // javaApi: "http://192.168.0.43:8080/goods/", 
    // javaApi: "http://prd-goods.xicp.cn/", 
    javaApi: "https://goods.shianlife.cn/",
    //钟明
    //  javaApi:"http://192.168.0.59:8080/goods/",
    platform:"http://prd-platform.xicp.cn/",
    // platform:"http://192.168.0.50:8100/platform/",
    // platform:"http://192.168.0.59:8099/ki4so-web/",
    //钟明
    // platform:"http://192.168.0.59:8099/ki4so-web/",
    platform: "https://platform.shianlife.cn/",
    // javaApi: "http://192.168.0.75:8299/goods/"
    // RouteUrl:"http://192.168.0.146:8088/adviser/"
    // orderCenterUrl:'http://192.168.0.43:8085/center/'
    orderCenterUrl: 'https://order.shianlife.cn/',
    // orderCenterUrl:'http://192.168.0.59:8085/center/',

    goodsPHPUrl: "https://goodsmgr.e-funeral.cn/",
    JavaPlatformUrl: "https://platform.shianlife.cn/",
    // JavaPlatformUrl: "http://192.168.0.57:8080/ki4so-web/",
    JavaGoodsUrl: "https://goods.shianlife.cn/",
    // JavaGoodsUrl: "http://192.168.0.59:8080/goods/",
    JavaCemeteryUrl: "https://t-cemetery-api.shianlife.cn/",
    // JavaCemeteryUrl: "http://192.168.0.59:8081/app/",
    javaOrderCenterUrl: 'https://order.shianlife.cn/',
    // javaOrderCenterUrl: "http://192.168.0.59:8085/center/",
  },
  //网络请求超时时间1000毫秒=1秒
  "networkTimeout": {
    "request": 30000,
    "connectSocket": 10000,
    "uploadFile": 50000,
    "downloadFile": 10000
  },
  //根据价格(price)追加后两位小数
  ProcessingPrice: function (price) {
    var price = price.toString()
    var index = price.indexOf('.')
    var indexlength = price.length
    var returnData = ''
    if (index == -1) {
      return returnData = price + '.00'
    } else if (index > -1) {
      if (indexlength - index == 2) {
        return returnData = price + '0'
      } else if (indexlength - index == 3) {
        return returnData = price
      }
    }
  },
  //金额正则验证
  AmountVerification: function (price) {
    var t = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    if (t.test(price)) {
      return true
    } else {
      return false
    }
  },
  /** 
 * 
 * 获取当前年月日
*/

  formatData: function () {
    var numbers = Date.parse(new Date());
    var date = new Date(numbers);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var dateTime = Y + M + D;
    return dateTime
  },
  /** 
 * 
 * 获取当前时分秒
*/
  formatTime: function () {
    var numbers = Date.parse(new Date());
    var date = new Date(numbers);
    var hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var minutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    // var sec = date.getSeconds();
    return hour + ":" + minutes
  }
})