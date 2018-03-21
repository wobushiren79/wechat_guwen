// var urlType = "local"
// var urlType = "remote"
var urlType = 'xiaofang'
var urlData = (urlType == "local") ?
  {
    goodsPHPUrl: "https://goodsmgr.e-funeral.cn/",
    appPHPUrl: "https://app.e-funeral.cn/",
    JavaPlatformUrl: "http://192.168.0.66:8080/ki4so-web/",
    JavaGoodsUrl: "http://192.168.0.66:8089/goods/",
    JavaCemeteryUrl: "http://192.168.0.66:8088/cemetery/",
    javaOrderCenterUrl: "http://192.168.0.66:8090/order/"
  }
  : (urlType == 'xiaofang')?
  {
      goodsPHPUrl: "https://goodsmgr.e-funeral.cn/",
      appPHPUrl: "https://app.e-funeral.cn/",
      JavaPlatformUrl: "http://192.168.0.57:8099/ki4so-web/",
      JavaGoodsUrl: "http://192.168.0.57:8299/goods/",
      JavaCemeteryUrl: "http://192.168.0.66:8088/cemetery/",
      javaOrderCenterUrl: "http://192.168.0.57:8399/center/"
    } :
    {
      goodsPHPUrl: "https://goodsmgr.e-funeral.cn/",
      appPHPUrl: "https://app.e-funeral.cn/",
      JavaPlatformUrl: "https://platform.shianlife.cn/",
      JavaGoodsUrl: "https://goods.shianlife.cn/",
      JavaCemeteryUrl: "https://t-cemetery-api.shianlife.cn/",
      javaOrderCenterUrl: 'https://order.shianlife.cn/'
    };
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
  globalData: urlData,
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
  },
  /**
   * 处理小程序计算数字精度问题
   */
  accuracyCalculation: function (method,length,data_a,data_b){
    if (method == '+'){
      return parseFloat((data_a + data_b).toFixed(length))
    }
    if (method == '-') {
      return parseFloat((data_a - data_b).toFixed(length))
    }
    if (method == '*') {
      return parseFloat((data_a * data_b).toFixed(length))
    }
    if (method == '/') {
      return  parseFloat((data_a /data_b).toFixed(length))
    }
    if (method == '' && data_b=='') {
      return parseFloat(data_a.toFixed(length))
    }
  }
})