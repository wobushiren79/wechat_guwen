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
      //同步清空缓存
      // wx.clearStorageSync()
      wx.removeStorageSync('JSESSIONID')
      wx.removeStorageSync('orderCenter')
      wx.removeStorageSync('amateurLevel')
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
          method: "POST",
          data: forData,
          header: {
            // "Content-Type": "application/x-www-form-urlencodeed"
            'client-Type':'wechatapp',
            'content-type': 'application/json'
          },
          success: function (res) {
            if (res.data.code == 1000){
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
              for (var j in subSystems){
                hasDealSubSystem++
              for (var i in res.data.content.resourceCodes){
                //如果有公墓权限登录公墓
                if (res.data.content.resourceCodes[i] == "cemetery.advisor"){
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
                  //如果不是职业顾问查询非职业顾问等级
                } 
                 if (res.data.content.resourceCodes[i] == "goods.advisor.amateur"){
                  var level = {}
                  var level_content = {}
                  var userIds = []
                  var levelType=[]
                  levelType.push('goods.advisor.amateur')
                  userIds.push(res.data.content.userId)
                  level.userIds = userIds
                  level.levelType = levelType
                  level_content.content = level
                  wx.request({
                    //获取职业顾问级别
                    url: platform + 'api/level/findbyuserids',
                    method: "POST",
                    data: level_content,
                    header: {
                      'content-type': 'application/json',
                      "Cookie": 'JSESSIONID=' + res.data.content.sessionId
                    },
                    success: function (dat) {
                      console.log(dat)
                      if (dat.data.code == 1000){
                        //   //缓存用户顾问级别
                        wx.setStorageSync('amateurLevel', dat.data.content.resultList)
                        that.is_login(hasDealSubSystem, subSystems, that.data.is_loction)
                      }else{
                        wx.setStorageSync('amateurLevel', '非职业顾问')
                        wx.showToast({
                          title: dat.data.message,
                          image: '../../images/icon_info.png',
                          duration: 3000,
                          // mask: true
                        })
                      }
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
    //设置页面转发功能
    onShareAppMessage: function () {
      return {
        title: '圆满人生公共殡葬服务平台',
        path: '/pages/login/login',
        success: function (res) {
          wx.showToast({
            title: '转发成功',
            // image: '../../images/icon_info.png',
            duration: 3000,
          })
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
          wx.showToast({
            title: '转发失败',
            image: '../../images/icon_info.png',
            duration: 3000,
          })
        }
      }
    },
    //判断跳转首页条件是否满足
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

