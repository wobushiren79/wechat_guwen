//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    grade: '7',
    service: "5",
    grade_icon:"../../images/grade.png",
    service_icon:"../../images/service.png"
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
        success: function(res) {
            console.log(res.data)
        }
      })
    var that = this
  	//调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
})
