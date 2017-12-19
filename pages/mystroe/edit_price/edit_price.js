// pages/mystroe/edit_price/edit_price.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    var price = options.price
    var orderId = options.orderId
    var path = options.path
    var storeId = options.storeId
    that.setData({
      price:price,
      orderId: orderId,
      path: path,
      storeId: storeId
    })
  },
  formSubmit:function(options){
    var that=this
    wx.showLoading({
      title: '处理中!',
      mask:true,
    })
    var storeId = that.data.storeId
    var orderId = that.data.orderId
    var path = that.data.path
    var price=that.data.price
    var JSESSIONID = ''
    var nowPrice = options.detail.value.now_price
    wx.getStorage({
      key: 'JSESSIONID',
      success: function (res) {
        JSESSIONID = res.data
        that.setData({
          JSESSIONID: JSESSIONID
        })
        var content = {}
        var javaApi = getApp().globalData.javaApi
        if (!getApp().AmountVerification(nowPrice)) {
          wx.hideLoading();
          wx.showToast({
            title: '价格错误',
            image: '../../../images/icon_info.png'
          })
        }else{
          //组装请求修改价格接口参数
          var content={}
          var get_data={}
          var star=nowPrice.indexOf('.')
          if (star == -1){
            content.priceNew = nowPrice*100
          }else{
          var a = parseInt(nowPrice.substring(0, star))*100
          var b = nowPrice.substring(star+1)
          if (b.length==1){
            var c =parseInt(b)*10
          }else{
            var c = parseInt(b)
          }
          
          content.priceNew = a + c
          }
          content.orderId = orderId
          content.priceOriginal = price
          get_data.content = content
          // console.log(get_data)
          // console.log(b)
          wx.request({
            url: javaApi + 'api/goods/order/updateOrderPrice',
            method: "POST",
            data: get_data,
            header: {
              // "Content-Type": "application/x-www-form-urlencodeed",
              'content-type': 'application/json',
              "Cookie": JSESSIONID
            },

            success: function (res) {
              // console.log(res)
              if (res.data.code == 1000) {
                wx.hideLoading()
                wx.showModal({
                  title: '圆满人生提示您',
                  content: '修改成功',
                  showCancel:false,
                  success: function (res) {
                    if (res.confirm) {
                      wx.reLaunch({
                        url: '/' + path + '?storeId=' + storeId,
                      })
                    }
                  }
                })
              } else {
                wx.showToast({
                  title: res.data.message,
                  image: '../../../images/icon_info.png',
                  duration: 2000
                })
              }
            }
          })
        }

        },
        fail:function(){
            wx.reLaunch({
                url:'/pages/login/login',
            })
          }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})