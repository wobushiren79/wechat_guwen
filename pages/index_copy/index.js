//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    num: '20',
    service: "24",
    money: "240",
    service_num: "7.4",
    icon_service:"../../images/index_icon_service.png",
    icon_cem:"../../images/index_icon_cem.png",
    icon_plan:"../../images/index_icon_plan.png",
    icon_right:"../../images/icon_right.png",
    role:'',
    Gmdata:false
  },
  dele:function(){
    wx.removeStorageSync('logindata');
    wx.removeStorageSync('Gmlogin');
    wx.removeStorageSync('Individual');
    wx.removeStorageSync('resourceCodes');
    wx.removeStorageSync('JSESSIONID');
    wx.removeStorageSync('DataUserId');
    //跳转登录页面
    wx.reLaunch({
      url: '../login/login',
    })

  },
  call_phone:function(e){
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, //仅为示例，并非真实的电话号码
      fail:function(res){
        wx.showToast({
          title: '拨打电话失败',
          duration: 3000
        })
      }
    })
  },
  onLoad: function () {
    var that = this
    var RouteUrl = getApp().globalData.RouteUrl
    // 取出殡仪登录信息
    wx.getStorage({
      key: 'logindata',
        success: function(res) {
            wx.request({
              url: RouteUrl + 'user/info/get',
              method: "POST",
              data: "{\"content\":{}}",

              header: {
                "Content-Type": "application/x-www-form-urlencodeed",
                "Cookie": "sid=" + res.data.content.sessionId
              },
              success: function (res) {
                if (res.data.code == 1000) {
                  var role = res.data.content.roles
                  that.setData({
                    service: res.data.content.serviceSuccessSum,
                    grade: res.data.content.avgSatis,
                    role: role,
                    Bylogin:true
                  })
                }
              }
            })
          },
          fail:function(){

          }
      })
    var LocalUrl = getApp().globalData.LocalUrl + 'Channel/channel'
    //查询渠道接口
    wx.request({
      url: LocalUrl,
      method: "POST",
      data: '',
      header: {
        "Content-Type": "application/x-www-form-urlencodeed",
        // "Cookie": "sid=" + res.data.content.sessionId
      },
      success: function (res) {
        if (res.data.code == 1000) {
          var channel=res.data.list
          for(var i in channel){
            if (channel[i].name == '单项'){
              that.setData({
                channel_id: channel[i].id
              })
              //缓存渠道信息
              wx.setStorageSync('channel', channel[i])
               }
          }
        }
      }
    })

      //取出公墓登录权限
    // wx.getStorage({
    //   key: 'Gmlogin',
    //   success: function (res) {
    //     that.setData({
    //       Gmdata:true
    //     })
    //   }
    // })
    //取出单项登录权限
    wx.getStorage({
      key: 'resourceCodes',
      success: function (res) {
      for(var i in res.data){
        if (res.data[i] == "goods.advisor"){
              wx.getStorage({
                key: 'Individual',
                success: function(opt) {
                  that.setData({
                    Individual: true
                  })
                  var javaApi = getApp().globalData.javaApi
                  var LocalUrl = getApp().globalData.LocalUrl
                  var str = opt.data
                  wx.request({
                    url: javaApi+'login_sys_api?KI4SO_SERVER_EC=' + str,
                    method: "GET",
                    data: '',
                    crossDomain: true,
                    header: {
                      'client-Type': 'wechatapp',
                      // "Content-Type": "application/x-www-form-urlencodeed"
                      'content-type': 'application/json'
                    },
                    success: function (ress) {
                      var cookies = ress.header['Set-Cookie']
                      if (cookies) {
                        var end = cookies.indexOf('Path') - 2
                        var start = cookies.indexOf('JSESSIONID')
                        if (start => 0) {
                          var str = cookies.substring(0, end)
                          //缓存单项登录essionid
                          // wx.setStorageSync('JSESSIONID', str)
                          try {
                            wx.setStorageSync('JSESSIONID', str)
                          } catch (e) {
                            console.log(e)
                          }
                         //查询商品标签
                            wx.request({
                              url: LocalUrl+'Label/label',
                              method: "POST",
                              data: '',
                              header: {
                                "Content-Type": "application/x-www-form-urlencodeed",
                              },
                              success: function (resss) {
                                if (resss.data.code == 1000) {
                                  that.setData({
                                    labellist: resss.data.list,
                                    label_id: resss.data.list[0].id
                                  })
                                  var channel_id = that.data.channel_id
                                  var content={}
                                  content.channel_id=channel_id
                                  content.lobel_id = resss.data.list[0].id
                                  wx.request({
                                    url: LocalUrl + 'Label/lobelgoods',
                                    method: "POST",
                                    data: content,
                                    header: {
                                      "Content-Type": "application/x-www-form-urlencoded"
                                    },
                                    success: function (opts) {
                                      if (opts.data.code == 1000) {
                                        that.setData({
                                          label_data: opts.data.list,
                                        })
                                      }
                                    }
                                  })
                                }
                              }
                            })
                        }

                      }
                    },
                    fail: function () {
                      //如果获取缓存不成功就跳转登录页面
                     wx.reLaunch({
                        url: '../login/login',
                      })
                    }
                  })
                },
              })
        }
        //读取公墓权限
        if (res.data[i] == "cemetery.advisor"){
          that.setData({
            Gmdata: true
          })
        }
      }
      },
      fail:function(){
            //如果获取缓存不成功就跳转登录页面
        wx.reLaunch({
              url: '../login/login',
            })
      }
    })
  	//调用应用实例的方法获取全局数据
    app.getUserInfo(function(userInfo){
      //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
    // if (!that.data.Individual && !that.data.Gmdata && !that.data.Bylogin){
    //         //如果获取缓存不成功就跳转登录页面
    //         wx.redirectTo({
    //           url: '../login/login',
    //         })
    // }
  },
  label:function(opt){
    wx.showLoading({
      title: '加载中',
      // mask:true,
    })
    var that=this
    var LocalUrl = getApp().globalData.LocalUrl
    var content={}
    content.channel_id=that.data.channel_id
    content.lobel_id = opt.currentTarget.dataset.label_id
    wx.request({
      url: LocalUrl + 'Label/lobelgoods',
      method: "POST",
      data: content,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        // console.log(content)
        if (res.data.code == 1000) {
          // var label_data=opts.data.list
          that.setData({
            label_data: res.data.list,
            label_id: opt.currentTarget.dataset.label_id
          })
          wx.hideLoading()
          // var channel = res.data.list
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '圆满人生公共殡葬服务平台',
      path: '/pages/login/login',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
})
