// pages/bank/history/history.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageSize:8,
    pageNumber:1
  },
  //上拉刷新
  onReachBottom:function() {
    // console.log(111111)
    this.onLoad()
  },
  //下拉添加记录条数
  onPullDownRefresh:function() {
    // console.log(2222222)
    this.onLoad()
    wx.stopPullDownRefresh()  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that=this
    wx.showLoading({
      title: '请稍后',
    })
    var platform = getApp().globalData.platform
    // console.log((10.00))
    var pageSize = that.data.pageSize
    var pageNumber = that.data.pageNumber
    var content={}
    var get_data={}
    content.pageNumber = pageNumber
    content.pageSize = pageSize
    get_data.content = content
    wx.getStorage({
      key: 'ptjssessionid',
      success: function (res) {
        wx.request({
          url: platform + 'api/wallet/queryCashingLogsForPage',
          // url: 'http://192.168.0.199:8080/api/credit/checkin',
          method: "POST",
          data: get_data,
          header: {
            'content-type': 'application/json',
            "Cookie": 'JSESSIONID=' + res.data
          },
          success: function (opt) {
            if (opt.data.code == 1000) {
              // console.log(opt.data.content.content)
              // var usableMoney = opt.data.content.usableMoney
              var list_data = opt.data.content.content
              for (var i in list_data){
                var price = parseInt(list_data[i].amount) / 100
                list_data[i].amount = getApp().ProcessingPrice(price)
                list_data[i].bank_card = list_data[i].bank_card.substring(list_data[i].bank_card.length - 4)
              }
              if (list_data.length == pageSize){
                that.setData({
                  list_data: opt.data.content.content,
                  xianshi: false,
                  pageSize: pageSize+8
                })
              }else{
                that.setData({
                  list_data: opt.data.content.content,
                  xianshi: true
                })
              }
              wx.hideLoading()
            } else {
              wx.hideLoading()
              wx.showToast({
                title: opt.data.message,
                image: '../../../images/icon_info.png',
                duration: 3000,
              })
            }
          },
          fail: function () {
            wx.hideLoading()
            wx.showToast({
              title: '网络错误',
              image: '../../../images/icon_info.png',
              duration: 3000,
            })
          }
        })
      }
    })
  },
})