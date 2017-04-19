//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    value1: '殡仪服務',
    value2: "公墓服務",
    systemType:2,
        value3:'test11',
        value4:'123456'
  },
    systemType:function(e){
    this.setData({systemType:e.detail.value})
  },
  formSubmit:function(e){
    var RouteUrl=getApp().globalData.RouteUrl
      var Contentdata = e.detail.value
      Contentdata.systemType=this.data.systemType
     // console.log(Contentdata)
      if(Contentdata){
          var forData={content:Contentdata}
          //console.log(forData)
          var that=this
          wx.request({
           url: RouteUrl+'doLogin', 
           // url: 'http://192.168.0.146:8088/adviser/doLogin', 
            method:"POST",
            data: forData,
            header: {
               "Content-Type":"application/x-www-form-urlencodeed"
            },
            success: function(res) {
              
              if(res.data.code == 1000 &&res.data.message == '操作成功'){
                // that.globalData.indexdata=res.data
                //登錄信息緩存
                wx.setStorageSync('logindata',res.data)
                //頁面跳轉
                wx.redirectTo({
                     url: '../index/index',
                 })
                  // console.log(res.data)
              }else{
                console.log(res.data.message)
              }
            }
          })
      }    
    },
})

