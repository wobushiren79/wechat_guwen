// pages/find/find_.js
Page({
  data:{
    pageNum:2,
    pageSize:0,
    Length:0
  },
  onLoad: function () {
    var that = this
    var unm = this.data.pageNum
    var size = this.data.pageSize
    var AppUrl = getApp().globalData.AppUrl + 'Home/index/sift?pageNum=' + unm + '&pageSize=' + size + '&type=1'
        //查询精选接口
        wx.request({
          url: AppUrl ,
          method: "GET",
          data: '',
          header: {
            // "Content-Type": "application/x-www-form-urlencodeed",
            // "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            if (res.data.code == 1000) {
              var siftdata = res.data.content.items
              var Length = siftdata.length
              // console.log(res)
                that.setData({
                  siftdata: siftdata,
                  Length: Length
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  duration: 2000
                })
            }
          }
          })
      },
  //上拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.setNavigationBarTitle({
      title: '刷新中!请稍后'
    })
    this.setData({
      // pageSize:this.data.pageSize+2,
      hidden: true
    })
    var that = this
    var unm = this.data.pageNum
    var size = this.data.pageSize
    var AppUrl = getApp().globalData.AppUrl + 'Home/index/sift?pageNum=' + unm + '&pageSize=' + size + '&type=1'
    //查询精选接口
    wx.request({
      url: AppUrl,
      method: "GET",
      data: '',
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          var siftdata = res.data.content.items
          var Length = siftdata.length
          console.log(res)
          that.setData({
            siftdata: siftdata,
            Length: Length
          })
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 2000
          })
        }
      },
      complete: function () {
        that.setData({
          hidden: false
        })
        wx.setNavigationBarTitle({
          title: '发现列表'
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  //下拉添加记录条数
  onReachBottom() {
    //console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.setNavigationBarTitle({
      title: '加载中!请稍后'
    })

    this.setData({
      pageSize: this.data.pageSize + 2,
      hidden: true
    })
    var that = this
    var unm = this.data.pageNum
    var size = this.data.pageSize
    var AppUrl = getApp().globalData.AppUrl + 'Home/index/sift?pageNum=' + unm + '&pageSize=' + size + '&type=1'
    //查询精选接口
    wx.request({
      url: AppUrl,
      method: "GET",
      data: '',
      header: {
        // "Content-Type": "application/x-www-form-urlencodeed",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          var siftdata = res.data.content.items
          var Length = siftdata.length
          console.log(res)
          that.setData({
            siftdata: siftdata,
            Length: Length
          })
        } else {
          wx.showToast({
            title: res.data.message,
            duration: 2000
          })
        }
      },
      complete: function () {
        that.setData({
          hidden: false
        })
        wx.setNavigationBarTitle({
          title: '发现列表'
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
})