Page({
    data: {
      goods_name:'',
      pageNumber:0,
      pageSize:4,
      order:'sort desc'
    },
  jiage1:function(){
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    //获取php接口地址前缀
    var LocalUrl = getApp().globalData.LocalUrl
    //获取分页
    var pageNumber = that.data.pageNumber
    //获取查询条数
    var pageSize = 4
    //获取排序
    var order = 'sort asc'
    //获取分类属性ID
    var id = that.data.id
    //获取渠道ID
    var channel_id = that.data.channel_id
    //请求数据组装
    var getData = []
    getData.id = id
    getData.channel_id = channel_id
    getData.order = order
    getData.pageSize = pageSize
    getData.pageNumber = pageNumber
    //查询分类接口
    wx.request({
      url: LocalUrl + 'Goods/goods',
      method: "POST",
      data: getData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          // console.log(res.data.list)
          var list = res.data.list
          if (list.length == pageSize) {
            that.setData({
              list: list,
              pageSize: pageSize + 4,
              channel_id: channel_id,
              id: id,
              order: order,
              xiaoliang: false,
              jiage: 0
            })
          } else {
            that.setData({
              list: list,
              pageSize: pageSize,
              channel_id: channel_id,
              id: id,
              xiaoliang: false,
              order: order,
              xianshi: true,
              jiage: 0
            })
          }
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/icon_info.png',
            duration: 2000
          })
        }
      }
    })
  },
  jiage2: function () {
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    //获取php接口地址前缀
    var LocalUrl = getApp().globalData.LocalUrl
    //获取分页
    var pageNumber = that.data.pageNumber
    //获取查询条数
    var pageSize = 4
    //获取排序
    var order = 'sort desc'
    //获取分类属性ID
    var id = that.data.id
    //获取渠道ID
    var channel_id = that.data.channel_id
    //请求数据组装
    var getData = []
    getData.id = id
    getData.channel_id = channel_id
    getData.order = order
    getData.pageSize = pageSize
    getData.pageNumber = pageNumber
    //查询分类接口
    wx.request({
      url: LocalUrl + 'Goods/goods',
      method: "POST",
      data: getData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          // console.log(res.data.list)
          var list = res.data.list
          if (list.length == pageSize) {
            that.setData({
              list: list,
              pageSize: pageSize + 4,
              channel_id: channel_id,
              id: id,
              order: order,
              xiaoliang: false,
              jiage:1
            })
          } else {
            that.setData({
              list: list,
              pageSize: pageSize,
              channel_id: channel_id,
              id: id,
              xiaoliang: false,
              order: order,
              xianshi: true,
              jiage:1
            })
          }
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/icon_info.png',
            duration: 2000
          })
        }
      }
    })
  },
  xiaoliang: function () {
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    //获取php接口地址前缀
    var LocalUrl = getApp().globalData.LocalUrl
    //获取分页
    var pageNumber = that.data.pageNumber
    //获取查询条数
    var pageSize = 4
    //获取排序
    var order = 'sale_amount desc'
    //获取分类属性ID
    var id = that.data.id
    //获取渠道ID
    var channel_id = that.data.channel_id
    //请求数据组装
    var getData = []
    getData.id = id
    getData.channel_id = channel_id
    getData.order = order
    getData.pageSize = pageSize
    getData.pageNumber = pageNumber
    //查询分类接口
    wx.request({
      url: LocalUrl + 'Goods/goods',
      method: "POST",
      data: getData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          // console.log(res.data.list)
          var list = res.data.list
          if (list.length == pageSize) {
            that.setData({
              list: list,
              pageSize: pageSize + 4,
              channel_id: channel_id,
              id: id,
              order: order,
              xiaoliang: true,
              jiage:3
            })
          } else {
            that.setData({
              list: list,
              pageSize: pageSize,
              channel_id: channel_id,
              id: id,
              xiaoliang: true,
              order: order,
              xianshi: true,
              jiage:3
            })
          }
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/icon_info.png',
            duration: 2000
          })
        }
      }
    })
  },
  //搜索
  bindKeyInput:function(e){
    var goods_name=e.detail.value;
    var that=this
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    //获取php接口地址前缀
    var LocalUrl = getApp().globalData.LocalUrl
    //获取分页
    var pageNumber = that.data.pageNumber
    //获取查询条数
    var pageSize =4
    //获取排序
    var order = that.data.order
    //获取分类属性ID
    var id = that.data.id
    //获取渠道ID
    var channel_id = that.data.channel_id
    //请求数据组装
    var getData = []
    getData.id = id
    getData.channel_id = channel_id
    getData.order = order
    getData.pageSize = pageSize
    getData.pageNumber = pageNumber
    getData.goods_name = goods_name
    //查询分类接口
    wx.request({
      url: LocalUrl + 'Goods/goods',
      method: "POST",
      data: getData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          // console.log(res.data.list)
          var list = res.data.list
          if (list.length == pageSize) {
            that.setData({
              list: list,
              pageSize: pageSize + 4,
              channel_id: channel_id,
              id: id,
              goods_name: goods_name
            })
          } else {
            that.setData({
              list: list,
              pageSize: pageSize,
              channel_id: channel_id,
              id: id,
              xianshi: true,
              goods_name: goods_name
            })
          }
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/icon_info.png',
            duration: 2000
          })
        }
      }
    })
  },
  //下拉添加记录条数
  onReachBottom() {
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    //获取php接口地址前缀
    var LocalUrl = getApp().globalData.LocalUrl
    // var goods_name = that.data.goods_name
    //获取分页
    var pageNumber = that.data.pageNumber
    //获取查询条数
    var pageSize = that.data.pageSize
    //获取排序
    var order = that.data.order
    //获取分类属性ID
    var id=that.data.id
    //获取渠道ID
    var channel_id=that.data.channel_id
    //请求数据组装
    var getData=[]
    getData.id=id
    getData.channel_id=channel_id
    getData.order = order
    getData.pageSize = pageSize
    getData.pageNumber = pageNumber
    //查询分类接口
    wx.request({
      url: LocalUrl + 'Goods/goods',
      method: "POST",
      data: getData,
      header: {
        "Content-Type": "application/x-www-form-urlencoded",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          // console.log(res.data.list)
          var list = res.data.list
          if (list.length == pageSize){
            that.setData({
              list: list,
              pageSize: pageSize + 4,
              channel_id: channel_id,
              id: id
            })
          }else{
            that.setData({
              list: list,
              pageSize: pageSize,
              channel_id:channel_id,
              id:id,
              xianshi:true,
            })
          }
          wx.hideLoading()
        } else {
          wx.showToast({
            title: res.data.message,
            image: '../../images/icon_info.png',
            duration: 2000
          })
        }
      }
    })
    },
onLoad: function (e) {
    var that = this
    //获取php接口地址前缀
    var LocalUrl = getApp().globalData.LocalUrl
    //获取分页
    var pageNumber = that.data.pageNumber
    //获取查询条数
    var pageSize = that.data.pageSize
    //获取排序
    var order = that.data.order
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    // 取出渠道信息
    wx.getStorage({
      key: 'channel',
      success: function (ress) {
        var channel = {}
        channel.channel_id = ress.data.id
        channel.id = e.id
        channel.pageNumber = pageNumber
        channel.pageSize = pageSize
        channel.order = order
        //查询分类接口
        wx.request({
          url: LocalUrl + 'Goods/goods',
          method: "POST",
          data: channel,
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            // "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            if (res.data.code == 1000) {
              // console.log(res.data.list)
              var list = res.data.list
              if (list.length == pageSize){
                that.setData({
                  list: list,
                  // xiaoliang: true,
                  pageSize: pageSize + 4,
                  channel_id: ress.data.id,
                  id: e.id,
                  xianshi:false
                })
              }else{
                that.setData({
                  list: list,
                  // xiaoliang: true,
                  pageSize: pageSize,
                  channel_id: ress.data.id,
                  id: e.id,
                  xianshi: true
                })
              }

              wx.hideLoading()
            } else {
              wx.showToast({
                title: res.data.message,
                image: '../../images/icon_info.png',
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
