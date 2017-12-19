Page({
    data: {


      pageNum: 1,
      pageSize: 2,
      Length: 0,
      gmList: [{


            "personNum": '人数',
            "cem": "公墓",
            "time": "2017-05-02",
            "traffic": "交通方式",
            "person": "公墓接待",
            "timeCem": "2017-02-02",
            "timeMoney": "2017-01-01",
            "cemName": "公墓名称",

            "consultId": '咨询ID',
            "consultStatus": '咨询状态',//1：未接单，2：已接单，3：已下单，4：洽谈失败，5：洽谈成功
            "customerAddress": "客户联系地址",
            "customerMobile": "客户联系电话",
            "customerName": "客户姓名",
            "description": "备注",
            "consultAssignId": '咨询指派ID',
            "orderId": '订单ID',//当未下过订单时, 该值为null
            "orderNum": "订单编号",
            "orderStatus": '订单状态',//1：未处理，2：待服务，3：已接受，4：服务派单中，5：结束派单，6：已确认，7：服务完成
            "agentmanName": "经办人姓名",
            "agentmanMobile": "经办人电话",
            "usageCurAddress": "使用者当前所在地",
            "performerName": "执行顾问",
            "performerMobile": "执行顾问电话",
            "hasPrepay": false,//定金是否已支付
            "showEditOrder": false,//是否显示[编辑订单]
            "showOrderDetail": false,//是否显示[订单详情]
            "promiseTime": 1461252140309,
            // "showAcceptOrReject":false,//是否显示[接单
            "showFinishTalk": false,//是否显示[结束洽谈]
            "showSwitch2waitService": false //是否显示[及時服务]
        }],
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
    //上拉刷新
    onPullDownRefresh() {
      var that = this
      var GmUrl = getApp().globalData.GmUrl
      var unm = that.data.pageNum
      var size = that.data.pageSize
      var PageNums = { content: { "pageNum": unm, "pageSize": size } }
      var PageNum = JSON.stringify(PageNums)
      wx.showLoading({
        title: '加载中',
      })
      this.setData({
        // pageSize:this.data.pageSize+2,
        hidden: true
      })

      // 取出緩存登錄信息
      wx.getStorage({
        key: 'Gmlogin',
        success: function (res) {
          //  console.log(res.data)
          //console.log(PageNum)
          wx.request({
            // url: GmUrl + 'marketing/bespeak/build/list',
            url: GmUrl + "marketing/bespeak/build/list/wait",
            
            method: "POST",
            data: PageNum,
            header: {
              'content-type': 'application/json',
              "Cookie": "JSESSIONID=" + res.data.content.sessionId
            },
            success: function (res) {
              if (res.data.code == 1000) {
                var TalkData = res.data.content.list
                // console.log(TalkData)
                var Length = TalkData.length
                if (TalkData.length == size) {
                  that.setData({
                    gmList: TalkData,
                    Length: Length,
                  })
                  wx.hideLoading()
                } else {
                  that.setData({
                    gmList: TalkData,
                    Length: Length,
                    xianshi: true
                  })
                  wx.hideLoading()
                }
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.message,
                  image: '../../images/icon_info.png',
                  duration: 3000
                })
              }
            },
          })
        }
      })
    },
    //下拉添加记录条数
    onReachBottom() {
    wx.showLoading({
      title: '加载中',
    })
      this.setData({
        pageSize: this.data.pageSize + 2,
        hidden: true
      })
      var unm = this.data.pageNum
      var size = this.data.pageSize
      var GmUrl = getApp().globalData.GmUrl
      var PageNums = { content: { "pageNum": unm, "pageSize": size } }
      var PageNum = JSON.stringify(PageNums)
      var that = this
      // 取出緩存登錄信息
      wx.getStorage({
        key: 'Gmlogin',
        success: function (res) {
          //  console.log(res.data)
          //console.log(PageNum)
          wx.request({
            // url: GmUrl + 'marketing/bespeak/build/list',
            url: GmUrl + "marketing/bespeak/build/list/wait",
            method: "POST",
            data: PageNum,
            header: {
              'content-type': 'application/json',
              "Cookie": "JSESSIONID=" + res.data.content.sessionId
            },
            success: function (res) {

              if (res.data.code == 1000) {
                var TalkData = res.data.content.list
                //console.log(TalkData)
                var Length = TalkData.length
                if (TalkData.length == size){
                  that.setData({
                    gmList: TalkData,
                    Length: Length,
                  })
                  wx.hideLoading()
                }else{
                  that.setData({
                    gmList: TalkData,
                    Length: Length,
                    xianshi:true
                  })
                  wx.hideLoading()
                }
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: res.data.message,
                  image: '../../images/icon_info.png',
                  duration: 3000
                })
              }
            },
          })
        }
      })
    },
    onLoad: function () {
      var that = this
      wx.showLoading({
        title: '加载中',
      })
      var unm = that.data.pageNum
      var size = that.data.pageSize
      var PageNums = { content: { "pageNum": unm, "pageSize": size } }
      var PageNum = JSON.stringify(PageNums)
      var GmUrl = getApp().globalData.GmUrl
      //var Contentdata = { content: { dictCode: 'consultTrafficWay' } }
     // var ContentData = JSON.stringify(Contentdata)
      //请求字典接口和公墓接口
      wx.getStorage({
        key: 'Gmlogin',
        success: function (res) {
          //查询公墓接口
          wx.request({
            // url: GmUrl + 'marketing/bespeak/build/list',
            url: GmUrl + "marketing/bespeak/build/list/wait",
            method: "POST",
            data: PageNum,

            header: {
              'content-type': 'application/json',
              "Cookie": "JSESSIONID=" + res.data.content.sessionId
            },
            success: function (res) {
              console.log(res)
              if (res.data.code == 1000) {
                var gmList = res.data.content.list
                // console.log(res.data.content.list.length)
                  var Length = gmList.length
                  if (gmList.length == size) {
                    that.setData({
                      gmList: gmList,
                      Length: Length
                    })
                    wx.hideLoading()
                  } else {
                    that.setData({
                      gmList: gmList,
                      Length: Length,
                      xianshi: true
                    })
                    wx.hideLoading()
                  }

              }
              wx.hideLoading()
            }
          })
        },
        fail:function(res){
          wx.showModal({
            title: '友情提示',
            content: '您还没有公墓洽谈权限',
            success: function (res) {
              if (res.confirm) {
                // //頁面跳轉
                wx.switchTab({
                  url: '../index/index',
                })
              } else if (res.cancel) {
                // //頁面跳轉
                wx.switchTab({
                  url: '../index/index',
                })
              }
            }
          })
        },





      })
    }
});
