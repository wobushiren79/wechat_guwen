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
  // //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  dele:function(){
    wx.removeStorageSync('logindata');
    wx.removeStorageSync('Gmlogin');
    wx.removeStorageSync('Individual');
    //如果获取缓存不成功就跳转登录页面
    wx.redirectTo({
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
            //如果获取缓存不成功就跳转登录页面
            // wx.redirectTo({
            //   url: '../login/login',
            // })
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
              //缓存渠道信息
              wx.setStorageSync('channel', channel[i])
               }
          }
          // console.log(res)
          // that.setData({
          //   siftdata: siftdata,
          //   Length: Length
          // })
        } else {
          // wx.showToast({
          //   title: res.data.message,
          //   duration: 2000
          // })
        }
      }
    })

      //取出公墓登录权限
    wx.getStorage({
      key: 'Gmlogin',
      success: function (res) {
        that.setData({
          Gmdata:true
        })
      }
    })
    //取出单项登录权限
    wx.getStorage({
      key: 'resourceCodes',
      success: function (res) {
      for(var i in res.data){
        if (res.data[i] == "goods.executor"){
              wx.getStorage({
                key: 'Individual',
                success: function(opt) {
                  that.setData({
                    Individual: true
                  })
                  var str = opt.data
                  wx.request({
                    // url: ByUrl + 'doLogin',
                    url: 'http://192.168.0.49:8088/login_sys_api?KI4SO_SERVER_EC=' + str,
                    method: "POST",
                    data: '',
                    crossDomain: true,
                    header: {
                      // 'Cookie': ,
                      'client-Type': 'wechatapp',
                      // "Content-Type": "application/x-www-form-urlencodeed"
                      'content-type': 'application/json'
                    },
                    success: function (res) {
                      console.log(res)
                      var cookies = res.header['Set-Cookie']
                      if (cookies) {
                        var end = cookies.indexOf('Path') - 2
                        var start = cookies.indexOf('JSESSIONID')
                        if (start => 0) {
                          var str = cookies.substring(0, end)
                          //缓存单项登录essionid
                          wx.setStorageSync('JSESSIONID', str)
                          wx.request({
                            // url: ByUrl + 'doLogin',
                            url: 'http://192.168.0.49:8088/demo/A',
                            method: "POST",
                            data: '',
                            crossDomain: true,
                            header: {
                              'Cookie': str,
                              'client-Type': 'wechatapp',
                              // "Content-Type": "application/x-www-form-urlencodeed"
                              'content-type': 'application/json'
                            },
                            success: function (res) {
                              var cookies = res.header['Set-Cookie']
                              // if (cookies) {
                              //   var end = cookies.indexOf('Path') - 2
                              //   var start = cookies.indexOf('JSESSIONID')
                              //   if (start > 0) {
                              //     var str = cookies.substring(11, end)
                              //     console.log(end)
                              //     console.log(cookies)
                              //     console.log(str)

                              //     that.setData({
                              //       str: str
                              //     })
                              //   }

                              // }
                              console.log(res)
                            }
                          })
                        }

                      }
                    }
                  })
                },
              })
        }
      }
      },
      fail:function(){
        //取出殡仪登录权限
        wx.getStorage({
          key: 'Gmlogin',
          success: function (res) {
          },
          fail(){
            //如果获取缓存不成功就跳转登录页面
            wx.redirectTo({
              url: '../login/login',
            })
          }
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
