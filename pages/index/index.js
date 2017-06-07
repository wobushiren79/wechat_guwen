//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    num: '20',
    service: "24",
    money: "240",
    service_num: "7.4",
    icon_service:"../../images/index_icon_service.png",
    icon_cem:"../../images/index_icon_cem.png",
    icon_plan:"../../images/index_icon_plan.png",
    icon_right:"../../images/icon_right.png",
    role:'',
    Gmdata:false
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    // 取出殡仪登录信息
    wx.getStorage({
      key: 'logindata',
        success: function(res) {
            wx.request({
              url: 'http://115.28.163.211:7080/shianlife-backend-1.0-SNAPSHOT/user/info/get',
              method: "POST",
              data: "{\"content\":{}}",

              header: {
                "Content-Type": "application/x-www-form-urlencodeed",
                "Cookie": "sid=" + res.data.content.sessionId
              },
              success: function (res) {
                if (res.data.code == 1000) {
                  var role = res.data.content.roles
                  that.setData({
                    service: res.data.content.serviceSuccessSum,
                    grade: res.data.content.avgSatis,
                    role: role
                  })
                }
              }
            })
          },
          fail:function(){
            //如果获取缓存不成功就跳转登录页面
            wx.redirectTo({
              url: '../login/login',
            })
          }
      })
      //取出公墓登录权限
    wx.getStorage({
      key: 'Gmlogin',
      success: function (res) {
        that.setData({
          Gmdata:true
        })
      }
    })


  	//调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
