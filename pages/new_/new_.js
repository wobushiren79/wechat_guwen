Page({
  data: {
    GmList: [
      ' ',
    ],
    businessType_a: 0,
    businessType_chat: 0,
    ChatList:[
      '看墓',
      '回送客户',
      '门店',
      '接灰',
      '其他'
    ],
    businessType_type: 0,
    types:[
      '殡仪',
      '公墓',
      '其他'
    ],
    zhidianData:[
      '自行',
      '需要派车'
    ],
    businessType_b: 0,
    customerAddressNew:'',
    yuansan:true,
    paiche:false
  },
  //验证空选项
  notNull:function(e){
    if (e.detail.value == ''){
      wx.showToast({
        title: '不能为空',
        image: '../../images/icon_info.png',
        duration: 2000
      })
    }
  },
  
  // 预约日期
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value,
      dates: this.data.dates ? this.data.dates : e.detail.value
    })
  },
  // 预约时间
  bindTimeChange: function (e) {
    this.setData({
      time: e.detail.value,
      datess: this.data.datess ? this.data.datess:e.detail.value
    })
  },
  // 预约用车日期
  bindTimeChangess: function (e) {
    this.setData({
      datess: e.detail.value
    })
  },
  //预约用车时间
  bindDateChanges:function(e){
    this.setData({
      dates: e.detail.value
    })
  },
  // 参观公墓
  bindPickerChange_a: function (e) {
    // if (e.target.dataset.name == '院山'){
    var GmName = this.data.GmList
    // console.log(GmName)
      this.setData({
        businessType_a: e.detail.value,
        GmName: GmName[e.detail.value],
      })
  },
  //预约类型
  bindPickerChange_type: function (e) {
    var that=this
    if (e.detail.value == 1){
      that.setData({
        businessType_type: e.detail.value,
        typeName: that.data.types[e.detail.value],
        yuy_type: true
      })
    }else{
      that.setData({
        businessType_type: e.detail.value,
        typeName: that.data.types[e.detail.value],
        yuy_type: false
      })
    }
  },
  //用车理由
  bindPickerChange_chat:function(e){
    this.setData({
      businessType_chat: e.detail.value,
      // ChatName: e.target.dataset.name,
      // yuansan: true
    })
  },
  // 交通方式
  bindPickerChange_b: function (e) {
    for(var i in e.target.dataset.name){
      if (i == e.detail.value){
        var jiaotong = e.target.dataset.name[i]
      }
    }
    if (e.detail.value  == 1){
      this.setData({
        businessType_b: e.detail.value,
        jiaotong: jiaotong,
        paiche:true
      })
    }else{
        this.setData({
          businessType_b: e.detail.value,
          jiaotong:jiaotong,
          paiche: false
        })
    }
  },
  //上车地点
  top_chat:function(){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var Address = res.address
        that.setData({
          top_chat: Address
        })
      }
    })
  },
  //目标地址
  spot:function(){
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var Address = res.address
        that.setData({
          spot: Address
        })
      }
    })
  },
  //客户地址
  Location: function () {
    var that = this
    wx.chooseLocation({
      success: function (res) {
        var Address = res.address
        that.setData({
          customerAddressNew: Address
        })
      }
    })
  },
  formSubmit: function (e) {
    var that=this
    wx.showLoading({
      title: '请稍后',
      mask:true
    })
    // var GmUrl = getApp().globalData.GmUrl
    var orderCenterUrl = getApp().globalData.orderCenterUrl
    //console.log(e.detail.value)
    var ContentData = {}
    // ContentData.personNum = e.detail.value.personNum ? e.detail.value.personNum:0
    ContentData.contactName = e.detail.value.contactName
    ContentData.contactPhone = e.detail.value.contactPhone
    ContentData.orderDescribe = e.detail.value.orderDescribe
    ContentData.address = e.detail.value.address
    var businessType_b = that.data.businessType_b
    ContentData.appointmentTime = that.data.date +' '+ that.data.time+':00'
      var businessType_a = that.data.businessType_a
      var gmList = that.data.gmList
        ContentData.planCemeteryId = gmList[businessType_a].id
        ContentData.planCemeteryLocation = gmList[businessType_a].name
        var gongmId = gmList[businessType_a].id
        var zhidianData = that.data.zhidianData
    // for(var i in zhidian){
    ContentData.trafficWay = zhidianData[businessType_b]
      
    // }
    ContentData.orderType = that.data.businessType_type
    var get_data={}
    // get_data.reason = e.detail.value.reason
    get_data.seats = e.detail.value.seats
    // get_data.proposerName = e.detail.value.proposerName
    // get_data.proposerMobile = e.detail.value.proposerMobile
    get_data.connecterName = e.detail.value.connecterName
    get_data.connecterMobile = e.detail.value.connecterMobile
    get_data.remark = e.detail.value.remark
    get_data.preDate = that.data.dates +' '+ that.data.datess+':00'
    get_data.location = e.detail.value.location
    get_data.reason = that.data.ChatList[that.data.businessType_chat]
    get_data.targetLocation = e.detail.value.targetLocation
    ContentData.carApplyLog = get_data
    if (ContentData.contactName.length == 0 || ContentData.address == 0){
      wx.hideLoading()
      wx.showToast({
        title: '文本框必填',
        image: '../../images/icon_info.png',
        duration: 2000
      })
    } else if (ContentData.orderType == 1 && ContentData.personNum == 0){
      wx.hideLoading()
      wx.showToast({
        title: '参观人数<1',
        image: '../../images/icon_info.png',
        duration: 2000
      })
    } else if (ContentData.trafficWay == '需要派车'){
      if (get_data.seats.length == 0){
        wx.showToast({
          title: '文本框必填',
          image: '../../images/icon_info.png',
          duration: 2000
        })
      } else if (get_data.connecterName.length == 0) {
        wx.showToast({
          title: '文本框必填',
          image: '../../images/icon_info.png',
          duration: 2000
        })
      } else if (get_data.connecterMobile.length == 0) {
        wx.showToast({
          title: '文本框必填',
          image: '../../images/icon_info.png',
          duration: 2000
        })
      } else if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(get_data.connecterMobile))) {
        wx.showToast({
          title: '号码不正确',
          image: '../../images/icon_info.png',
          duration: 2000
        })
      } else if (get_data.preDate.length == 0) {
        wx.showToast({
          title: '文本框必填',
          image: '../../images/icon_info.png',
          duration: 2000
        })
      } else if (get_data.location.length == 0) {
        wx.showToast({
          title: '文本框必填',
          image: '../../images/icon_info.png',
          duration: 2000
        })
      } else if (get_data.reason.length == 0) {
        wx.showToast({
          title: '文本框必填',
          image: '../../images/icon_info.png',
          duration: 2000
        })
      } else if (get_data.targetLocation.length == 0) {
        wx.showToast({
          title: '文本框必填',
          image: '../../images/icon_info.png',
          duration: 2000
        })
      }else{
        wx.getStorage({
          key: 'orderCenter',
          success: function (msg) {
            var forData = { content: ContentData }
            //转换字符串
            var ForData = JSON.stringify(forData)
            wx.request({
              url: orderCenterUrl + 'api/workorder/create',
              method: "POST",
              data: ForData,
              header: {
                'content-type': 'application/json',
                "Cookie": msg.data
              },
              success: function (res) {
                if (res.data.code == 1000) {
                  wx.hideLoading()
                  //頁面跳轉
                  wx.redirectTo({
                    url: '../allot/order_list_wait/order_list_wait',
                  })
                } else {
                  wx.hideLoading()
                  wx.showToast({
                    title: res.data.message,
                    image: '../../images/icon_info.png',
                    duration: 2000
                  })
                }
              },
              fail:function(){
                wx.hideLoading()
                wx.showToast({
                  title: '网络错误',
                  image: '../../images/icon_info.png',
                  duration: 3000
                })
              }
            })
          }
        })
      }

    }else{
    wx.getStorage({
      key: 'orderCenter',
      success: function (msg) {
        var forData = { content: ContentData }
        //转换字符串
        var ForData = JSON.stringify(forData)
        wx.request({
          url: orderCenterUrl +'api/workorder/create',
          method: "POST",
          data: ForData,
          header: {
            'content-type': 'application/json',
            "Cookie": msg.data
          },
          success: function (res) {
            if (res.data.code == 1000 ) {
                 wx.hideLoading()
              //頁面跳轉
              wx.redirectTo({
                url: '../allot/order_list_wait/order_list_wait',
               })
            } else {
                  wx.hideLoading()
              wx.showToast({
                title: res.data.message,
                image: '../../images/icon_info.png',
                duration: 2000
              })
            }
          },
          fail: function () {
            wx.hideLoading()
            wx.showToast({
              title: '网络错误',
              image: '../../images/icon_info.png',
              duration: 3000
            })
          }
        })
      }
    })
    }
    // console.log(ContentData)
    // if (ContentData.contactName != '' && ContentData.appointmentTime != '' && ContentData.trafficWay != '' && ContentData.orderType != '' && ContentData.address !='' ) {
    // 取出緩存登錄信息
      // console.log(ContentData)
    // wx.getStorage({
    //   key: 'orderCenter',
    //   success: function (msg) {
    //     var forData = { content: ContentData }
    //     //转换字符串
    //     var ForData = JSON.stringify(forData)
    //     wx.request({
    //       url: orderCenterUrl +'api/workorder/create',
    //       method: "POST",
    //       data: ForData,
    //       header: {
    //         'content-type': 'application/json',
    //         "Cookie": msg.data
    //       },
    //       success: function (res) {
    //        console.log(res)
    //         if (res.data.code == 1000 ) {
    //              wx.hideLoading()
    //           //頁面跳轉
    //           wx.redirectTo({
    //             url: '../allot/order_list_wait/order_list_wait',
    //            })
    //         } else {
    //               wx.hideLoading()
    //           wx.showToast({
    //             title: res.data.message,
    //             image: '../../images/icon_info.png',
    //             duration: 2000
    //           })
    //         }
    //       }
    //     })
    //   }
    // })
    // } else if (ContentData.customerName != '' ){
    //   wx.showToast({
    //     title: '客户姓名不能为空',
    //     duration: 2000
    //   })
    // } else{
    //   wx.hideLoading()
    //   wx.showToast({
    //     title: '文本框必填',
    //     image: '../../images/icon_info.png',
    //     duration: 2000
    //   })
    // }
  },
  Cname:function(e){
    this.setData({
      Cname: e.detail.value
    })
  },
  Clocation:function(e){
   this.setData({
     top_chat: e.detail.value
   })
  },
  //调用手机号码方法验证手机号码
  checktels:function(e){
    this.checkMobile(e.detail.value)
  },
  //调用手机号码方法验证手机号码
  checktel:function(e){
    this.checkMobile(e.detail.value)
    this.setData({
      checkMobile: e.detail.value
    })
  },
  //手机号码验证
  checkMobile: function (sMobile){
    if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))) {
      wx.showToast({
        title: '号码不正确',
        image: '../../images/icon_info.png',
        duration: 2000
      })
    }else{

    } 
  },
  onLoad: function () {
    var that = this
    var that = this
    var GmUrl = getApp().globalData.GmUrl
    var Contentdata = { content: { dictCode: 'consultTrafficWay'}}
    var ContentData = JSON.stringify(Contentdata)
    //请求字典接口和公墓接口
    // wx.getStorage({
    //   key: 'Gmlogin',
    //   success: function (res) {
        //字典接口
        // wx.request({
        //   url: GmUrl+'marketing/dict/items/list',
        //   method: "POST",
        //   data: ContentData,

        //   header: {
        //     "Content-Type": "application/x-www-form-urlencodeed",
        //     "Cookie": "sid=" + res.data.content.sessionId
        //   },
        //   success: function (res) {
        //     if (res.data.code == 1000) {
        //       var zhidianData=[]
        //       var zhidian=res.data.content.items
        //       for(var i in zhidian){
        //        zhidianData.push(zhidian[i].text)
        //       }
        //       that.setData({
        //         zhidian: zhidian,
        //         zhidianData:zhidianData
        //       })
        //     }
        //   },
        //   fail:function(v){
        //     wx.showToast({
        //       title: '网络错误',
        //       image: '../../images/icon_info.png',
        //       duration: 3000
        //     })
        //   }
        // })
        //查询公墓接口
        wx.request({
          // url: GmUrl + 'marketing/cemetery/structure/list',
          url: GmUrl + 'marketing/cemetery/structure/listNoLogin',
          method: "POST",
          data: "{\"content\":{\"itemType\":0}}",

          header: {
            // "Content-Type": "application/x-www-form-urlencodeed",
            'content-type': 'application/json',
            // "Cookie": "sid=" + res.data.content.sessionId
          },
          success: function (res) {
            // console.log(res)
            if (res.data.code == 1000) {
              var gmList=res.data.content.items
              var GmList=[]
              for(var i in gmList){
                GmList.push(gmList[i].name)
                GmName: gmList[0]
              }
              that.setData({
                GmList:GmList,
                gmList: gmList,
                GmName: GmList[0]
              })
            }
          },
          fail: function (v) {
            wx.showToast({
              title: '网络错误',
              image: '../../images/icon_info.png',
              duration: 3000
            })
          }
        })
  }
});
