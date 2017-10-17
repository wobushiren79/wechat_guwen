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
        value4:'',
        str:'',
        subSystems:[
          "funeral.advisor",
        ],
        is_loction:0,
        hasDealSubSystem:0
  },
    systemType:function(e){
    this.setData({systemType:e.detail.value})
  },
    formSubmit: function (e) {
      var that=this
      wx.showLoading({
        title: '登录中!请稍后',
        // mask:true
      })
      wx.clearStorageSync()
      var RouteUrl = getApp().globalData.RouteUrl
      // var Gmlogin=false
      var GmUrl = getApp().globalData.GmUrl  //公墓接口地址前缀
      var ByUrl = getApp().globalData.ByUrl  //殡仪接口地址前缀
      var platform = getApp().globalData.platform  //平台接口地址前缀
      var subSystems = that.data.subSystems
      var hasDealSubSystem = that.data.hasDealSubSystem
      var Contentdata = e.detail.value
      if (Contentdata.username == '' || Contentdata.password == '' || Contentdata.password == null || Contentdata.username == null) {
        wx.showToast({
          title: '账号或密码不能为空',
          image:'../../images/icon_info.png',
          duration: 3000
        })
      } else {
      var contenttt = {}
      contenttt.userName = Contentdata.username
      contenttt.userPwd = Contentdata.password
     // Contentdata.systemType = this.data.systemType
      Contentdata.systemType = '2'
      //  console.log(Contentdata)
      if (Contentdata) {
        var forData = {content: contenttt }
        var formdata = {content:Contentdata}
        var ForData = JSON.stringify(forData)
        var FormData = JSON.stringify(formdata)
        var that = this
        wx.request({
          //登录集成平台
          url: platform+'applogin',
          // url: 'http://192.168.0.199:8080/applogin',
          // url: 'http://192.168.0.75:8199/platform/applogin',
          
          method: "POST",
          data: forData,
          header: {
            // "Content-Type": "application/x-www-form-urlencodeed"
            'client-Type':'wechatapp',
            'content-type': 'application/json'
          },
          success: function (res) {
            // console.log(res)
            if (res.data.code == 1000){
              // console.log(res)
              var ress = res.header['Set-Cookie']
              var start = ress.indexOf('KI4SO_SERVER_EC') + 16
              var end = ress.indexOf('rememberMe') - 1
              var str = ress.substring(start, end)
              // var Gmlogin = false
              //   //系统登录信息
              wx.setStorageSync('Individual', str)
              //缓存用户信息
              wx.setStorageSync('userObj', res.data.content.userObj)
              //缓存平台登录jssessionID
              wx.setStorageSync('ptjssessionid', res.data.content.sessionId)
              //   //缓存平台登录用户ID
              wx.setStorageSync('DataUserId', res.data.content.userId)
              //   //缓存用户权限
              wx.setStorageSync('resourceCodes', res.data.content.resourceCodes)
              // console.log(res.data.content.resourceCodes)
              for (var j in subSystems){
                hasDealSubSystem++
              for (var i in res.data.content.resourceCodes){
                if (res.data.content.resourceCodes[i] == "cemetery.advisor"){
                  // console.log(asd.FormData)
                  wx.request({
                    url: GmUrl + 'doLogin/marketing',
                    method: "POST",
                    data: FormData,
                    header: {
                      "Content-Type": "application/x-www-form-urlencodeed"
                      // 'content-type': 'application/json'
                    },
                    success: function (res) {
                      if (res.data.code == 1000) {
                        //公墓登录信息缓存
                        wx.setStorageSync('Gmlogin', res.data)
                        wx.hideLoading()
                      } else {
                        wx.showToast({
                          title: '公墓登录失败',
                          image: '../../images/icon_info.png',
                          duration: 3000,
                        })
                      }
                      that.is_login(hasDealSubSystem, subSystems, that.data.is_loction)
                    }
                  })
              }
              }
              }
              that.is_login(hasDealSubSystem, subSystems, that.data.is_loction)
            }else{
              wx.showToast({
                title: res.data.message,
                image: '../../images/icon_info.png',
                duration: 3000,
                // mask: true
              })
            }
          },
          fail:function(){
            wx.showToast({
              title: '网络错误!稍后再试',
              image: '../../images/icon_info.png',
              duration: 3000,
            })
          }
        })
      }
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
    is_login: function(hasDealSubSystem, subSystems, is_loction) {
    if(subSystems.length == hasDealSubSystem) {
      if (is_loction == 0) {
        this.setData({
          is_loction:1
        })
        // 頁面跳轉
        wx.reLaunch({
          url: '../index/index',
        })
        // console.log(00000)
      }
    }else{
    }
  }
})

