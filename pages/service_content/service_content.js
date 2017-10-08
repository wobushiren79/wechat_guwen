var WxParse = require('../../wxParse/wxParse.js'); 
var app = getApp()
Page({
  data: {
    goods_number:1,
    // 是否出现焦点
    indicatorDots: true,
    // 是否自动播放
    autoplay: false,
    // 自动播放间隔时间
    interval: 5000,
    // 滑动动画时间
    duration: 500,
    userInfo: {}
  },
  onShareAppMessage: function () {
    var goods_id = this.data.goods_id
    return {
      title: '圆满人生公共殡葬服务平台',
      path: '/pages/service_forward/service_forward?goods_id='+goods_id,
      success: function (res) {
        wx.showToast({
          title: '转发成功',
          duration: 2000
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '转发失败',
          image: '../../images/icon_info.png',
          // mask:true,
          duration: 2000
        })
      }
    }
  },
  onLoad: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
      // mask: true,
    })
    //取出单项登录权限
    wx.getStorage({
      key: 'resourceCodes',
      success: function (res) {
        
    var goods_id=e.goods_id
    var LocalUrl = getApp().globalData.LocalUrl
    var javaApi = getApp().globalData.javaApi
    var JSESSIONID = ''
    wx.getStorage({
      key: 'JSESSIONID',
      success: function (res) {
        JSESSIONID = res.data
        // console.log(JSESSIONID)
        that.setData({
          JSESSIONID: JSESSIONID
        })
        },
        })
    // 取出渠道信息
    wx.getStorage({
      key: 'channel',
      success: function (res) {
        var channel = {}
        channel.channel_id = res.data.id
        channel.goods_id = goods_id
        var content={}
        content.content='钟明坏蛋'
        //查询分类接口
        wx.request({
          url: LocalUrl + 'Goods/details',
          method: "POST",
          data: channel,
          header: {
            "Content-Type": "application/x-www-form-urlencoded",
            // "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            if (res.data.code == 1000) {
              var list = res.data.list
              console.log(list)
              WxParse.wxParse('descrip_detail', 'html', list.descrip_detail, that, );
              if (res.data.list.specprice.length >0) {
                wx.request({
                  url: javaApi + 'api/goods/shopping/getShoppingNumber',
                  method: "POST",
                  data: '',
                  header: {
                    // "Content-Type": "application/x-www-form-urlencodeed",
                    'content-type': 'application/json',
                    "Cookie": JSESSIONID
                  },

                  success: function (dat) {
                    // console.log(dat)
                    if (dat.data.code == 1000) {
                      var shoppingTotalNumber = dat.data.content.shoppingTotalNumber
                      that.setData({
                        list: list,
                        channel: channel,
                        goods_spec: res.data.list.specprice,
                        xuanzhe: 0,
                        xuanzhedata: res.data.list.specprice[0],
                        spec_price: res.data.list.specprice[0].spec_price,
                        shoppingTotalNumber: shoppingTotalNumber,
                        goods_number: 1,
                        goods_cate_id: res.data.list.goods_cate_id,
                        spec_attr_id: res.data.list.spec_attr_id,
                        goods_id: goods_id,
                        chatxian: true
                      })
                      wx.hideLoading()
                    } else {
                      wx.showToast({
                        title: dat.data.message,
                        image: '../../images/icon_info.png',
                        duration: 2000,
                        // mask:true,
                      })
                    }
                  }
                })
            }else{
                wx.request({
                  url: javaApi + 'api/goods/shopping/getShoppingNumber',
                  method: "POST",
                  data: '',
                  header: {
                    // "Content-Type": "application/x-www-form-urlencodeed",
                    'content-type': 'application/json',
                    "Cookie": JSESSIONID
                  },

                  success: function (dat) {
                    if (dat.data.code == 1000) {
                      var shoppingTotalNumber = dat.data.content.shoppingTotalNumber
                      that.setData({
                        list: list,
                        channel: channel,
                        goods_spec: res.data.list.specprice,
                        xuanzhe: 0,
                        // xuanzhedata: res.data.list.specprice[0],
                        // spec_price: res.data.list.specprice[0].spec_price,
                        shoppingTotalNumber: shoppingTotalNumber,
                        // goods_number: 1,
                        goods_cate_id: res.data.list.goods_cate_id,
                        spec_attr_id: res.data.list.spec_attr_id,
                        goods_id: goods_id,
                        chatxian: true
                      })
                      wx.hideLoading()
                    }else{
                      wx.showToast({
                        title: dat.data.message,
                        duration: 2000,
                        image: '../../images/icon_info.png',
                        // mask:true,
                      })
                    }
                  }
                })
            }
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
      },
      fail: function () {
        wx.redirectTo({
          url: '../login/login',
        })
      }
    })
  },
  popup:function(){
    var that =this 
    that.setData({
      popup:true
    })
  },
  popup_close:function(){
    this.setData({
      popup:false
    })
  },
  //选择规格
  xuanzhe:function(e){
    var that=this
    var goods_spec = that.data.goods_spec
    var xuanzhedata = goods_spec[e.target.dataset.index]
    var spec_price = goods_spec[e.target.dataset.index].spec_price
    that.setData({
      xuanzhe: e.target.dataset.index,
      xuanzhedata: xuanzhedata,
      goods_number:1,
      spec_price: spec_price
    })
  },
  //点击数量添加
  add:function(e){
    var that=this
    that.setData({
      goods_number: e.target.dataset.goods_number+1,
    })
  },
  //点击数量减少
  reduce:function(e){
    var that = this
    var goods_number=e.target.dataset.goods_number
    if (goods_number==1){
      that.setData({
        goods_number: goods_number,
      })
    }else{
      that.setData({
        goods_number: goods_number- 1,
      })
    }

  },
  purchase:function(){
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
   var that=this
   var goods_number = that.data.goods_number
   var xuanzhedata = that.data.xuanzhedata
   xuanzhedata.number = goods_number
   var LocalUrl = getApp().globalData.LocalUrl
   var content = {}

   content.channelId = xuanzhedata.channel_id
   content.goodsId = xuanzhedata.goods_id
   content.goodsSpecId = xuanzhedata.goods_spec_id
   var getData={}
   wx.request({
     url: LocalUrl + 'Getgoods/getattrgoods',
     method: "POST",
     data: content,
     header: {
       "Content-Type": "application/x-www-form-urlencoded",
       // 'content-type': 'application/json',
       // "Cookie": "sid=" + res.data.content.sessionId
     },
     success: function (res) {
       console.log(res.data)
       var totla_price = 0;
       //分类名称
       wx.setStorageSync('class_name', res.data.class_name)
       if (res.data.code == 1000)
       {
         for(var i in res.data.list){
           res.data.list[i].specNum = goods_number
           totla_price += parseFloat(res.data.list[i].specNum) * parseFloat(res.data.list[i].spec_price)
         }
         //结算购物车数据
         wx.setStorageSync('formData', res.data.list)
         //总价格
         wx.setStorageSync('totla_price', totla_price)
         wx.reLaunch({
           url: '../service_money/service_money'
         })
       }
       }       })

  },
  cart:function(){
  var that=this
  wx.showLoading({
    title: '加载中',
    mask: true,
  })
  var goods_number = that.data.goods_number
  var Goodsdata = that.data.xuanzhedata
  var spec_attr_id = that.data.spec_attr_id
  var goods_cate_id = that.data.goods_cate_id
  var formdata = {}
  formdata.goodsId = Goodsdata.goods_id
  formdata.goodsSpecId = Goodsdata.goods_spec_id
  formdata.classifyAttrId = spec_attr_id
  formdata.classifyId = goods_cate_id
  formdata.specNum = goods_number
  formdata.channelId = Goodsdata.channel_id

  var list =[]
  list.push(formdata)
  var formDataa = { list: list}
  var aaaa = { content: formDataa}
  //转换字符串
  var ForData = JSON.stringify(aaaa)
  console.log(ForData)
  var javaApi = getApp().globalData.javaApi
  wx.getStorage({
    key: 'JSESSIONID',
    success: function(res) {
      var JSESSIONID=res.data
    wx.request({
      url: javaApi+'api/goods/shopping/save',
      method: "POST",
      data: ForData,
      header: {
        // "Content-Type": "application/x-www-form-urlencoded",
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },
      success: function (res) {
        //  console.log(res)
        if (res.data.code == 1000) {
          wx.request({
            url: javaApi + 'api/goods/shopping/getShoppingNumber',
            method: "POST",
            data: '',
            header: {
              // "Content-Type": "application/x-www-form-urlencodeed",
              'content-type': 'application/json',
              "Cookie": JSESSIONID
            },

            success: function (dat) {
              if (dat.data.code == 1000) {
                var shoppingTotalNumber = dat.data.content.shoppingTotalNumber
                that.setData({
                  shoppingTotalNumber: shoppingTotalNumber,
                })
                wx.showToast({
                  title: '加入成功',
                  duration: 2000
                })
              } else {
                wx.showToast({
                  title: dat.data.message,
                  image: '../../images/icon_info.png',
                  duration: 2000,
                  // mask: true,
                })
              }
            }
          })
        }
    }
    })
    },
  })
  },
  cartlist:function(){
    //頁面跳轉
    wx.reLaunch({
      url: '../service_buy/service_buy'
    })
  }
})  