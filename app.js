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
    RouteUrl:"https://web.shianlife.cn/shianlife-adviser-1.0-SNAPSHOT/",
    //RouteUrl: "http://115.28.163.211:7088/shianlife-adviser-1.0-SNAPSHOT/",
    ByUrl: "https://t-cemetery-api.shianlife.cn/shianlife-adviser-1.0-SNAPSHOT/", 
    // ByUrl: "http://115.28.163.211:7088/shianlife-adviser-1.0-SNAPSHOT/",
    GmUrl: "https://t-cemetery-api.shianlife.cn/shianlife-advisor-cemetery-1.0-SNAPSHOT/",
    AppUrl:"https://app.e-funeral.cn/",
    // RouteUrl:"http://192.168.0.146:8088/adviser/"
  }
})