var WxParse = require('../../wxParse/wxParse.js'); 
var app = getApp()
Page({
  data: {

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
          duration: 2000
        })
      }
    }
  },
  onLoad: function (e) {
    var that = this
    var goods_id=e.goods_id
    var LocalUrl = getApp().globalData.LocalUrl
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    // 取出渠道信息
    wx.getStorage({
      key: 'channel',
      success: function (res) {
        var channel = {}
        channel.channel_id = res.data.id
        channel.goods_id = goods_id
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
              that.setData({
                list: list,
                channel: channel,
                goods_spec: res.data.list.specprice,
                xuanzhe: 0,
                xuanzhedata: res.data.list.specprice[0],
                spec_price: res.data.list.specprice[0].spec_price,
                
                goods_number: 1,
                goods_cate_id: res.data.list.goods_cate_id,
                spec_attr_id: res.data.list.spec_attr_id,
                goods_id: goods_id,
                chatxian:true
              })
            }else{
                that.setData({
                  list: list,
                  channel: channel,
                  goods_spec: res.data.list.specprice,
                  xuanzhe: 0,
                  // xuanzhedata: res.data.list.specprice[0],
                  // spec_price: res.data.list.specprice[0].spec_price,

                  // goods_number: 1,
                  goods_cate_id: res.data.list.goods_cate_id,
                  spec_attr_id: res.data.list.spec_attr_id
                })
            }
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
      fail: function () {
        //如果获取缓存不成功就跳转登录页面
        wx.redirectTo({
          url: '../index/index',
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
  //  var price = goods_number * xuanzhedata.adviser_price*100
  //  var formdata={}
   var LocalUrl = getApp().globalData.LocalUrl
  //  formdata.total_fee = price
  //  console.log(formdata)
  //  console.log(xuanzhedata)
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
       }
       })
  //  wx.login({
  //    success: function (e) {
  //      formdata.code = e.code
  //     //  console.log(e.code)
  //      wx.request({
  //        url: LocalUrl + 'Weixing/token',
  //        method: "POST",
  //        data: formdata,
  //        header: {
  //          "Content-Type": "application/x-www-form-urlencoded",
  //          // "Cookie": "sid=" + res.data.content.sessionId
  //        },
  //        success: function (res) {
  //         //  console.log(res)
  //          if (res.data.code == 1000) {
  //           //  var openid = res.data.list.openid
  //           //  var timestamp = Date.parse(new Date());
  //           //  timestamp = timestamp / 1000;
             
  //       wx.requestPayment({
  //         'timeStamp': '' + res.data.list.timeStamp+'',
  //         'nonceStr': res.data.list.nonceStr,
  //         'package': res.data.list.package,
  //         'signType': res.data.list.signType,
  //         'paySign': res.data.list.paySign,
  //         'success': function (res) {
  //            wx.showToast({
  //              title: '支付成功',
  //              duration: 2000
  //            })
  //         },
  //         'fail': function (res) {
  //           // console.log(res.errMsg)
  //           if (res.errMsg){
  //             if (res.errMsg == 'requestPayment:fail'){
  //               wx.showToast({
  //                 title: '已取消支付',
  //                 duration: 2000
  //               })
  //              }else{
  //                 wx.showToast({
  //                   title: res.detail.message,
  //                   duration: 2000
  //                 })
  //              }
  //           }
  //         }
  //       })
  //            wx.hideLoading()
  //          }
  //         //   else {
  //         //    wx.showToast({
  //         //      title: res.data.message,
  //         //      duration: 2000
  //         //    })
  //         //  }
  //        }
  //      })
  //    }
  //  })

  },
  // //客服会话
  // contact:function(e){
  //  console.log(e)
  // },
  cart:function(){
  var that=this
  var goods_number = that.data.goods_number
  var Goodsdata = that.data.xuanzhedata
  var spec_attr_id = that.data.spec_attr_id
  var goods_cate_id = that.data.goods_cate_id
  // console.log(Goodsdata)
  // var xuanzhedata = that.data.xuanzhedata
  // xuanzhedata.number = goods_number
  // var price = goods_number * xuanzhedata.adviser_price * 100
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
  // FormDataa.content=formdata
  // console.log(formDataa)
  // formdata.total_fee = price
  var javaApi = getApp().globalData.javaApi
  wx.getStorage({
    key: 'JSESSIONID',
    success: function(res) {
      var JSESSIONID=res.data
    wx.request({
      url: javaApi+'api/goods/shopping/save',
      method: "POST",
      data: ForData,
      // dataType: json,
      header: {
        // "Content-Type": "application/x-www-form-urlencoded",
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },
      success: function (res) {
        //  console.log(res)
        if (res.data.code == 1000) {
          wx.showToast({
            title: '加入成功',
            duration: 2000
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