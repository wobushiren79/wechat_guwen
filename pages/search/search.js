Page({
    data: {
      listshow: false,
      puxiao: ''
    },
    onLoad:function(){
    var that=this
    // 取出渠道信息
    wx.getStorage({
      key: 'channel',
      success: function (res) {
        // console.log(res.data.id)
        that.setData({
          channel_id:res.data.id
        })
      }
    })
    },
    quxiao:function(){
      this.setData({
        listshow: false,
        puxiao:''
      })
    },
    bindKeyInput:function(e){
      wx.showLoading({
        title: '加载中',
      })
      var that = this
      var LocalUrl = getApp().globalData.LocalUrl  
      var content = {}
      content.channel_id = that.data.channel_id
      content.search = e.detail.value
      wx.request({
        url: LocalUrl + 'Search/search',
        method: "POST",
        data: content,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 1000) {
            that.setData({
              search_data: res.data.list,
              listshow: true,
              puxiao: '取消'
            })
            wx.hideLoading()
          }
        }
      })
    },
    search_b:function(opt){
      // console.log(opt.currentTarget.dataset.search)
      wx.showLoading({
        title: '加载中',
        // mask:true,
      })
      var that = this
      var LocalUrl = getApp().globalData.LocalUrl
      var content = {}
      content.channel_id = that.data.channel_id
      content.search = opt.currentTarget.dataset.search
      wx.request({
        url: LocalUrl + 'Search/search',
        method: "POST",
        data: content,
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.code == 1000) {
            that.setData({
              search_data: res.data.list,
              listshow: true,
              puxiao:'取消'
            })
            wx.hideLoading()
          }
        }
      })
    }


});
