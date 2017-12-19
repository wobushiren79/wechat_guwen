Page({
    data: {
    },
onLoad: function (e) {
    var that = this
    //获取php接口地址前缀
    var LocalUrl = getApp().globalData.LocalUrl
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    // 取出登录用户ID
    wx.getStorage({
      key: 'DataUserId',
      success: function (ress) {
        var content = {}
        content.userid = ress.data
        // content.userid = 687
        //根据顾问ID查询所属门店接口
        wx.request({
          url: LocalUrl + 'Stores/StoresShop',
          method: "POST",
          data: content,
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          success: function (res) {
            if (res.data.code == 1000) {
              var list = res.data.content
              // console.log(list)
              if (list.length>0){
                that.setData({
                  list: list,
                  xianshi:false
                })
              }else{
                that.setData({
                  list: list,
                  xianshi: true
                })
              }
              wx.hideLoading()
            } else {
              wx.showToast({
                title: res.data.message,
                image: '../../../images/icon_info.png',
                duration: 2000
              })
            }
          }
        })
      },
      fail: function () {
        //如果获取缓存不成功就跳转登录页面
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }
    })
  }
});
