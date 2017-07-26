Page({
    data: {

    },
  goodsclass:function(e){
    // console.log(e)
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    var LocalUrl = getApp().globalData.LocalUrl
    var id =e.target.dataset.id
    var index = e.target.dataset.index
    var name = e.target.dataset.name
    var that=this
    // var channel = that.data.channeldata
    var formdata={}
    formdata.id = id
    wx.request({
      url: LocalUrl + 'Goods/classattr',
      method: "POST",
      data: formdata,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          var attrlist = res.data.list
          // console.log(attrlist)
          that.setData({
            attrlist: attrlist,
            active: index,
            name: name,
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 2000
          })
        }
      }
    })
  },
onLoad:function(){
  var that = this
  var LocalUrl = getApp().globalData.LocalUrl
  wx.showLoading({
    title: '加载中',
    mask:true,
  })
  // 取出渠道信息
  wx.getStorage({
    key: 'channel',
    success: function (res) {
      var channel= {}
      channel.channel_id=res.data.id
      //查询分类接口
      wx.request({
        url: LocalUrl + 'Goods/goodsclass',
        method: "POST",
        data: channel,
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          // "Cookie": "sid=" + res.data.content.sessionId
        },
        success: function (res) {
          if (res.data.code == 1000) {
            var list =res.data.list
                var formdata = {}
                formdata.id = list[0].id
                wx.request({
                  url: LocalUrl + 'Goods/classattr',
                  method: "POST",
                  data: formdata,
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    // "Cookie": "sid=" + res.data.content.sessionId
                  },
                  success: function (res) {
                    if (res.data.code == 1000) {
                      var attrlist = res.data.list
                      // console.log(attrlist)
                      that.setData({
                        attrlist: attrlist,
                      })
                      wx.hideLoading()
                    } else {
                      wx.showToast({
                        title: res.data.message,
                        duration: 2000
                      })
                    }
                  }
                })
            that.setData({
              list: list,
              active:0,
              name: list[0].name,
              channeldata: channel,
            })
            // wx.hideLoading()
          } else {
            wx.showToast({
              title: res.data.message,
              duration: 2000
            })
          }
        }
      })
    },
    fail: function () {
      //如果获取缓存不成功就跳转登录页面
      wx.redirectTo({
        url: '../index/index',
      })
    }
  })
}

});
