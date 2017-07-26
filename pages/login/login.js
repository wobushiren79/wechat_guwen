//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    value1: '殡仪服務',
    value2: "公墓服務",
    logo_src : "../../images/logo.png",
    systemType:2,
        value3:'',
        value4:''
  },
    systemType:function(e){
    this.setData({systemType:e.detail.value})
  },
    formSubmit: function (e) {
      wx.showLoading({
        title: '登录中!请稍后',
      })
      var RouteUrl = getApp().globalData.RouteUrl
      var GmUrl = getApp().globalData.GmUrl  //公墓接口地址前缀
      var ByUrl = getApp().globalData.ByUrl  //殡仪接口地址前缀
      var Contentdata = e.detail.value
      Contentdata.systemType = this.data.systemType
      //  console.log(Contentdata)
      if (Contentdata) {
        var forData = { content: Contentdata }
        var ForData = JSON.stringify(forData)
        // console.log(ForData)
        var that = this
        wx.request({
          url: ByUrl + 'doLogin',
          method: "POST",
          data: ForData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed"
          },
          fail:function(){
          //  console.log(1111111111111)
           setTimeout(function () {
             wx.hideLoading()
           }, 1000)
          },
          success: function (res) {
            // console.log(res)
            if (res.data.code == 1000 && res.data.message == '操作成功') {
              // console.log(res.data.content.token)
              // that.globalData.indexdata=res.data
              //殡仪登錄信息緩存
              wx.setStorageSync('logindata', res.data)
              if (res.data.content.token) {
                var tokendata = { content: { token: res.data.content.token } }
                //转换字符串
                var tokenData = JSON.stringify(tokendata)
                // console.log(tokenData)
                wx.request({
                  url: GmUrl + 'doLogin/marketing',
                  method: "POST",
                  data: tokenData,
                  header: {
                    "Content-Type": "application/x-www-form-urlencodeed"
                  },
                  success: function (res) {
                    if (res.data.code == 1000){
                    //  console.log(res)
                    //公墓登录信息缓存
                    wx.setStorageSync('Gmlogin', res.data)
                    //  console.log(111111)
                    setTimeout(function () {
                      wx.hideLoading()
                    }, 2000)
                    // 頁面跳轉
                    wx.switchTab({
                      url: '../index/index',
                    })
                  }else{
                      wx.showToast({
                        title: res.data.message,
                        duration: 3000
                      })
                  }
                  }
                })
              } else {
                setTimeout(function () {
                  wx.hideLoading()
                }, 2000)
                //頁面跳轉
                wx.switchTab({
                  url: '../index/index',
                })
                // console.log(res.data)
              }
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 3000
              })
            }
          }
        })
      }
    },
    onShareAppMessage: function () {
      return {
        title: '圆满人生公共殡葬服务平台',
        path: '/pages/login/login',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    },
})

