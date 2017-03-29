//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    grade: '',
    service: "",
    grade_icon:"../../images/grade.png",
    service_icon:"../../images/service.png",
    role:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
        success: function(res) {
        //  console.log(res.data)
          wx.request({
                      url: 'http://115.28.163.211:7080/shianlife-backend-1.0-SNAPSHOT/user/info/get', 
                      method:"POST",
                      data: "{\"content\":{}}",
                      
                      header: {
                        "Content-Type":"application/x-www-form-urlencodeed",
                        "Cookie":"sid="+res.data.content.sessionId
                      },
                      success: function(res) {
                        if(res.data.code == 1000){
                          var role=res.data.content.roles
                         // console.log(role)
                          that.setData({
                            service:res.data.content.serviceSuccessSum,
                            grade:res.data.content.avgSatis,
                            role:role
                          })
                        }  
                      }
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
