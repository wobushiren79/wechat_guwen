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
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
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
  globalData:{
    userInfo:null,
    // LocalUrl:"http://www.shiangoods.com/Api/",
    LocalUrl: "https://goodsmgr.e-funeral.cn/Api/",
    RouteUrl:"https://web.shianlife.cn/shianlife-adviser-1.0-SNAPSHOT/",
    //殡仪
    ByUrl: "https://t-cemetery-api.shianlife.cn/shianlife-adviser-1.0-SNAPSHOT/", 
    // ByUrl: "http://192.168.0.37:8088/app/", 
    //公墓
    GmUrl: "https://t-cemetery-api.shianlife.cn/shianlife-advisor-cemetery-1.0-SNAPSHOT/",
    // GmUrl: "http://192.168.0.43:8084/app/",
    // GmUrl: "http://192.168.0.71:8084/cemetery/",
    AppUrl:"https://app.e-funeral.cn/",
    // javaApi:"http://192.168.0.199:8299/goods/"   权哥
    //小慌
    // javaApi: "http://192.168.0.43:8080/goods/", 
    // javaApi: "http://prd-goods.xicp.cn/", 
    javaApi: "https://goods.shianlife.cn/",
    // platform:"http://prd-platform.xicp.cn/",
    // platform:"http://192.168.0.43:8099/ki4so-web/",
    // platform:"http://192.168.0.57:8080/ki4so-web/",
    platform:"https://platform.shianlife.cn/",
    // javaApi: "http://192.168.0.75:8299/goods/"
    // RouteUrl:"http://192.168.0.146:8088/adviser/"
    // orderCenterUrl:'http://192.168.0.43:8085/center/'
    orderCenterUrl:'https://order.shianlife.cn/'
    // orderCenterUrl:'http://192.168.0.57:8090/order/'
  }
})