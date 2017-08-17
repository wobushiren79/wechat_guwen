//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    value1: '殡仪服務',
    value2: "公墓服務",
    logo_src : "../../images/logo.png",
    systemType:2,
        value3:'xinxin',
        value4:1,
        str:''
  },
    systemType:function(e){
    this.setData({systemType:e.detail.value})
  },
    formSubmit: function (e) {
      // wx.showLoading({
      //   title: '登录中!请稍后',
      // })
      var RouteUrl = getApp().globalData.RouteUrl
      var GmUrl = getApp().globalData.GmUrl  //公墓接口地址前缀
      var ByUrl = getApp().globalData.ByUrl  //殡仪接口地址前缀
      var Contentdata = e.detail.value
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
        console.log(FormData)
        console.log(ForData)
        // var test={"username":"admin","password":"1"}
        // console.log(ForData)
        var that = this
        wx.request({
          // url: ByUrl + 'doLogin',
          url:'http://192.168.0.49:8099/ki4so-web/applogin',
          method: "POST",
          data: forData,
          header: {
            // "Content-Type": "application/x-www-form-urlencodeed"
            'client-Type':'wechatapp',
            'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == 1000){
              var ress = res.header['Set-Cookie']
              var start = ress.indexOf('KI4SO_SERVER_EC') + 16
              var end = ress.indexOf('rememberMe') - 1
              var str = ress.substring(start, end)
              // if (ress) {
              //   var ends = ress.indexOf('Path') - 2
              //   var strx = ress.substring(11, ends)
              //   var applogin=true
              // }
            //   //系统登录信息
              wx.setStorageSync('Individual', str)
              //   //缓存用户权限
              wx.setStorageSync('resourceCodes', res.data.content.resourceCodes)
            }
          }
        })
        wx.request({
          url: ByUrl + 'doLogin',
          // url: 'http://192.168.0.199:8080/ki4so-web/applogin',
          method: "POST",
          data: FormData,
          header: {
            "Content-Type": "application/x-www-form-urlencodeed"
            // 'client-Type': 'wechatapp',
            // 'content-type': 'application/json'
          },
          success: function (res) {
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
                    // 'content-type': 'application/json'
                  },
                  success: function (res) {
                    if (res.data.code == 1000) {
                      //  console.log(res)
                      //公墓登录信息缓存
                      wx.setStorageSync('Gmlogin', res.data)
                      //  console.log(111111)
                        wx.hideLoading()
                    } else {
                      wx.showToast({
                        title: res.data.message,
                        duration: 3000
                      })
                    }
                  }
                })
              }
            }
          }
        })
      }
      //取出殡仪登录权限
      wx.getStorage({
        key: 'logindata',
        success: function (res) {
          // 頁面跳轉
          wx.switchTab({
            url: '../index/index',
          })
        }
      })
      //取出单项登录权限
      wx.getStorage({
        key: 'Individual',
        success: function (res) {
          // 頁面跳轉
          wx.switchTab({
            url: '../index/index',
          })
        }
      })
    },
    urlA:function(){
      var testA=[]
      testA.specNum = 3
      testA.goodsId = 1
      testA.channelId = 1
      testA.goodsSpecId = 1
      var LocalUrl = getApp().globalData.LocalUrl
      wx.request({
        url: 'http://192.168.0.46/shian_goods/Api/JavaGoods/goods_salesVolume_inventory1',
        method: "POST",
        data: testA,
        // dataType: json,
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          // 'content-type': 'application/json',
          // "Cookie": JSESSIONID
        },
        success: function (res) {
          console.log(res)
        }
      })
    },
    urlC: function () {
      var cookie = this.data.cookie
      // if (cookie) {
      //   var end = cookie.indexOf('Path') - 2
      //   var str = cookie.substring(11, end)
      // }
      var that = this
      // console.log(str)
      var str = that.data.str
      if (str) {
        var hea = 'JSESSIONID=' + str
      } else {
        var hea = ''
      }
      wx.request({
        // url: ByUrl + 'doLogin',
        url: 'http://192.168.0.199:8299/goods/demo/B',
        method: "POST",
        data: '',
        crossDomain: true,
        header: {
          'Cookie': hea,
          'client-Type': 'wechatapp',
          // "Content-Type": "application/x-www-form-urlencodeed"
          'content-type': 'application/json'
        },
        success: function (res) {
          var cookies = res.header['Set-Cookie']
          if (cookies) {
            var end = cookies.indexOf('Path') - 2
            var start = cookies.indexOf('JSESSIONID')
            if (start > 0) {
              var str = cookies.substring(11, end)
              console.log(end)
              console.log(cookies)
              console.log(str)

              that.setData({
                str: str
              })
            }

          }
          console.log(res)
        }
      })
    },
    urlB:function(){
      var cookie = this.data.cookie
      var that = this
      console.log(cookie)
      var content={}
      content.content = { "KI4SO_SERVER_EC": cookie}
      wx.request({
        // url: ByUrl + 'doLogin',
        url: 'http://192.168.0.199:8299/goods/login_sys_api?KI4SO_SERVER_EC=' + cookie,
        method: "GET",
        data: content,
        crossDomain: true,
        header: {
          // "Cookie":cookie,
          'client-Type': 'wechatapp',
          // "Content-Type": "application/x-www-form-urlencodeed"
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          var cookies = res.header['Set-Cookie']
          console.log(cookies)
          if (cookies) {
            var end = cookies.indexOf('Path') - 2
            var start = cookies.indexOf('JSESSIONID')
            // if (start > 0) {
              var str = cookies.substring(11, end)
              console.log(end)
              console.log(cookies)
              console.log(str)

              that.setData({
                str: str
              })
            // }

          }
        }
      })
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

