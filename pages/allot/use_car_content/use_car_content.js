Page({
  data: {
    

  },
  tel: function (e) {
    var tel = e.currentTarget.dataset.tel
    wx.makePhoneCall({
      phoneNumber: tel, //仅为示例，并非真实的电话号码
      complete: function (res) {
        console.log(res)
      },
    })
  },
  onLoad:function(e){
   var id=e.id
   var that=this
    // wx.showLoading({
    //   title: '请稍后',
    //   mask: true,
    // })
   var orderCenterUrl = getApp().globalData.orderCenterUrl
    var content={}
    var get_content={}
    content.carApplyLogId = id
    get_content.content=content
   wx.getStorage({
     key: 'orderCenter',
     success: function (res) {
       wx.request({
         url: orderCenterUrl + 'api/car/details',
         method: "POST",
         data: get_content,
         header: {
           'content-type': 'application/json',
           "Cookie": res.data
         },
         success: function (opt) {
           if (opt.data.code == 1000){
              that.setData({
                content:opt.data.content
              })
            }else{
              wx.hideLoading()
              wx.showToast({
                title: opt.data.message,
                image: '../../../images/icon_info.png',
                duration: 3000
              })
            }
         },
         fail:function(){
           wx.hideLoading()
           wx.showToast({
             title: '网络错误',
             image: '../../../images/icon_info.png',
             duration: 3000
           })
         }
       })
     },
     fail:function(){
       wx.hideLoading()
       wx.showToast({
         title: '网络错误',
         image: '../../../images/icon_info.png',
         duration: 3000
       })
     }
     })
  }

});
