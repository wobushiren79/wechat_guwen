Page({
  data: {
    popup_img:false

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
  bind_popup_img:function(e){
    var imgurl = e.currentTarget.dataset.imgurl
    this.setData({
      popup_img: true,
      imgurl: imgurl
    })
  },
  bind_popup_close: function () {
    this.setData({
      popup_img: false
    })
  },
  onLoad:function(e){
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    var get_content = {}
    var content = {}
    content.orderId = e.orderId
    get_content.content = content
    //取出单项登录权限
    wx.getStorage({
      key: 'orderCenter',
      success: function (res) {
        var orderCenter = res.data
        wx.request({
          url: orderCenterUrl + 'api/workorder/details',
          data: get_content,
          header: {
            'content-type': 'application/json',
            "Cookie": orderCenter
          },
          method: 'POST',
          dataType: 'json',
          success: function (opt) {
            // console.log(opt.data.content.listPerformRecord)
            // 组装处理图片地址
            var get_data=[]
            for (var i in opt.data.content.listPerformRecord){
              get_data.push(opt.data.content.listPerformRecord[i].performPic.split(","))
            }
            //组装审核图片地址
            // var bet_data=[]
            // for (var i in opt.data.content.listPerformRecord) {
            //   get_data.push(opt.data.content.listPerformRecord[i].performPic.split(","))
            // }
            if (opt.data.code == 1000) {
                that.setData({
                  content: opt.data.content,
                  get_data: get_data
                })
              wx.hideLoading()
            } else {
              wx.hideLoading()
              wx.showModal({
                title: opt.data.message,
                content: '是否返回重新登录',
                success: function (res) {
                  if (res.confirm) {
                    wx.reLaunch({
                      url: '../../login/login',
                    })
                  } else if (res.cancel) {

                  }
                }
              })
            }
          },
          fail: function (res) {
            wx.reLaunch({
              url: '../../login/login',
            })
          },
        })
      }
    })
  }
});
