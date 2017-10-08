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
    // LocalUrl:"http://192.168.0.78/shian_goods/Api/",
    LocalUrl: "https://goodsmgr.e-funeral.cn/Api/",
    RouteUrl:"https://web.shianlife.cn/shianlife-adviser-1.0-SNAPSHOT/",
    //殡仪
    ByUrl: "https://t-cemetery-api.shianlife.cn/shianlife-adviser-1.0-SNAPSHOT/", 
    // ByUrl: "http://192.168.0.37:8088/app/", 
    //公墓
    GmUrl: "https://t-cemetery-api.shianlife.cn/shianlife-advisor-cemetery-1.0-SNAPSHOT/",
    // GmUrl: "http://192.168.0.73:8088/app/",
    AppUrl:"https://app.e-funeral.cn/",
    // javaApi:"http://192.168.0.199:8299/goods/"   权哥
    //小慌
  //  javaApi:"http://192.168.0.77:8088/goods/"
    javaApi: "https://goods.shianlife.cn/",
    platform:"https://platform.shianlife.cn/"
    // javaApi: "http://192.168.0.75:8299/goods/"
    // RouteUrl:"http://192.168.0.146:8088/adviser/"
  }
})