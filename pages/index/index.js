//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    num: '20',
    service: "24",
    money: "240",
    service_num: "7.4",
    icon_service: "../../images/index_icon_service.png",
    icon_cem: "../../images/index_icon_cem.png",
    icon_plan: "../../images/index_icon_plan.png",
    icon_right: "../../images/icon_right.png",
    role: '',
    Gmlogin: 0
  },
  dele: function () {
    wx.clearStorageSync()
    //跳转登录页面
    wx.reLaunch({
      url: '../login/login',
    })

  },
  call_phone: function (e) {
    var phone = e.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone, //仅为示例，并非真实的电话号码
      fail: function (res) {
        wx.showToast({
          title: '拨打电话失败',
          image: '../../images/icon_info.png',
          duration: 3000
        })
      }
    })
  },
  sign: function () {
    wx.showLoading({
      title: '加载中',
      // mask:true,
    })
    var that = this
    var platform = getApp().globalData.platform
    wx.getStorage({
      key: 'ptjssessionid',
      success: function (res) {
        var ptjssessionid = res.data
        // that.setData({
        //   JSESSIONID: JSESSIONID
        // })
        // console.log(JSESSIONID)
        wx.request({
          url: platform + 'api/credit/checkin',
          // url: 'http://192.168.0.199:8080/api/credit/checkin',
          method: "POST",
          data: '',
          header: {
            // "Content-Type": "application/x-www-form-urlencodeed",
            'content-type': 'application/json',
            "Cookie": 'JSESSIONID=' + ptjssessionid
          },

          success: function (dat) {
            if (dat.data.code == 1000) {
              wx.showToast({
                title: '签到成功',
                duration: 2000,
                // mask: true,
              })
              that.setData({
                usableCredit: dat.data.content.usableCredit,
                keeps: dat.data.content.keeps,
                canCheckin: false,
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
    })
  },
  gongmu: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    //取出分单子系统token
    wx.getStorage({
      key: 'orderCenter',
      success: function (res) {
        //跳转页面
        wx.navigateTo({
          url: '../new_/new_',
        })
        wx.hideLoading()
      },
      fail: function (v) {
        //取出单项登录权限
        wx.getStorage({
          key: 'resourceCodes',
          success: function (res) {
            for (var i in res.data) {
              //如果有分单权限
              if (res.data[i] == "orderc.advisor") {
                wx.getStorage({
                  key: 'Individual',
                  success: function (opt) {
                    that.setData({
                      Individual: true
                    })
                    // var javaApi = getApp().globalData.javaApi
                    var orderCenterUrl = getApp().globalData.orderCenterUrl
                    var str = opt.data
                    wx.request({
                      url: orderCenterUrl + 'login_subsystem_api?KI4SO_SERVER_EC=' + str,
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
                            wx.setStorageSync('orderCenter', str)
                            //跳转页面
                            wx.navigateTo({
                              url: '../new_/new_',
                            })
                            wx.hideLoading()
                          }

                        }
                      },
                      fail: function () {
                        //如果获取缓存不成功就跳转登录页面
                        wx.navigateTo({
                          url: '../cem/cem',
                        })
                        wx.hideLoading()
                      }
                    })
                  },
                })
              }else{
                //如果获取缓存不成功就跳转登录页面
                wx.navigateTo({
                  url: '../cem/cem',
                })
              }
            }
          },
          fail:function(){
            //如果获取缓存不成功就跳转登录页面
            wx.navigateTo({
              url: '../cem/cem',
            })
          }
        })
      }
    })
  },
  order: function () {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    //取出分单子系统token
    wx.getStorage({
      key: 'orderCenter',
      success: function (res) {
        //跳转页面
        wx.navigateTo({
          url: '../allot/order_list_wait/order_list_wait',
        })
        wx.hideLoading()
      },
      fail: function (v) {

        //取出单项登录权限
        wx.getStorage({
          key: 'resourceCodes',
          success: function (res) {
            for (var i in res.data) {
              //如果有分单权限
              if (res.data[i] == "orderc.advisor") {
                wx.getStorage({
                  key: 'Individual',
                  success: function (opt) {
                    that.setData({
                      Individual: true
                    })
                    // var javaApi = getApp().globalData.javaApi
                    var orderCenterUrl = getApp().globalData.orderCenterUrl
                    var str = opt.data
                    wx.request({
                      url: orderCenterUrl + 'login_subsystem_api?KI4SO_SERVER_EC=' + str,
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
                            wx.setStorageSync('orderCenter', str)
                            //跳转页面
                            wx.navigateTo({
                              url: '../allot/order_list_wait/order_list_wait',
                            })
                            wx.hideLoading()
                          }

                        }
                      },
                      fail: function () {
                        //如果获取缓存不成功就跳转登录页面
                        wx.navigateTo({
                          url: '../funeral_img/funeral_img',
                        })
                        wx.hideLoading()
                      }
                    })
                  },
                })
              } else {
                //如果获取缓存不成功就跳转登录页面
                wx.navigateTo({
                  url: '../cem/cem',
                })
              }
            }
          },
          fail: function () {
            //如果获取缓存不成功就跳转登录页面
            wx.navigateTo({
              url: '../cem/cem',
            })
          }
        })
      }
    })
  },
  onLoad: function () {
    var that = this
    var GmUrl = getApp().globalData.GmUrl  //公墓接口地址前缀
    var RouteUrl = getApp().globalData.RouteUrl
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
          var channel = res.data.list
          for (var i in channel) {
            if (channel[i].name == '单项') {
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
    //取出子系统登录权限
    wx.getStorage({
      key: 'resourceCodes',
      success: function (res) {
        //取出用户信息
        wx.getStorage({
          key: 'userObj',
          success: function (res) {
            // console.log(res.data.name)
            that.setData({
              UserName: res.data.name
            })
          }
        })
        for (var i in res.data) {
          //如果有单项权限就登录单项子系统
          if (res.data[i] == "goods.advisor") {
            wx.getStorage({
              key: 'Individual',
              success: function (opt) {
                that.setData({
                  Individual: true
                })
                var javaApi = getApp().globalData.javaApi
                var LocalUrl = getApp().globalData.LocalUrl
                var str = opt.data
                wx.request({
                  url: javaApi + 'login_sys_api?KI4SO_SERVER_EC=' + str,
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
                        wx.setStorageSync('JSESSIONID', str)
                        that.setData({
                          JSESSIONID: str
                        })
                        //查询商品标签
                        wx.request({
                          url: LocalUrl + 'Label/label',
                          method: "POST",
                          data: '',
                          header: {
                            "Content-Type": "application/x-www-form-urlencodeed",
                          },
                          success: function (resss) {
                            // console.log(resss)
                            if (resss.data.code == 1000) {
                              that.setData({
                                labellist: resss.data.list,
                                label_id: resss.data.list[0].id
                              })
                              var channel_id = that.data.channel_id
                              var content = {}
                              content.channel_id = channel_id
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
        }

      },
      fail: function () {
        //如果获取缓存不成功就跳转登录页面
        wx.reLaunch({
          url: '../login/login',
        })
      }
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
    })
  },
  label: function (opt) {
    wx.showLoading({
      title: '加载中',
      // mask:true,
    })
    var that = this
    var LocalUrl = getApp().globalData.LocalUrl
    var content = {}
    content.channel_id = that.data.channel_id
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
  onShow: function () {
    var that = this
    var platform = getApp().globalData.platform
    wx.getStorage({
      key: 'ptjssessionid',
      success: function (res) {
        var ptjssessionid = res.data
        wx.request({
          url: platform + 'api/credit/getCredit',
          // url: 'http://192.168.0.199:8080/api/credit/getCredit',
          method: "POST",
          data: '',
          header: {
            'content-type': 'application/json',
            "Cookie": 'JSESSIONID=' + ptjssessionid
          },

          success: function (dat) {
            if (dat.data.code) {
              if (dat.data.code == 1000) {
                that.setData({
                  usableCredit: dat.data.content.usableCredit,
                  canCheckin: dat.data.content.canCheckin,
                })
              } else {
                wx.showToast({
                  title: dat.data.message,
                  duration: 2000,
                  image: '../../images/icon_info.png',
                  // mask: true,
                })
              }
            } else {
              //跳转登录页面
              wx.reLaunch({
                url: '../login/login',
              })
            }
          },
          fail: function () {
            //跳转登录页面
            wx.reLaunch({
              url: '../login/login',
            })
          }
        })
      }
    })
  }
})
