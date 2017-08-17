
Page({
  
  data:{
    edit: true,
    // pageSize:5,
    totla_price:0,
  },
  bind_edit: function () {
    this.setData({
      edit: false,
      over: true
    })
  },
  bind_over: function () {
    this.setData({
      edit: true,
      over: false
    })
  },
  onLoad:function(){
    var that=this
    var JSESSIONID=''
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    // 取出殡仪登录信息
    wx.getStorage({
      key: 'JSESSIONID',
      success: function (res) {
        JSESSIONID=res.data
      }
      })
    var LocalUrl = getApp().globalData.LocalUrl
    var javaApi = getApp().globalData.javaApi
    // 取出渠道信息
    wx.getStorage({
      key: 'channel',
      success: function (res) {
        var channel_id=res.data.id
        var content={}
        // content.channelId=channel_id
        content.pageSize = 1000
        content.pageNumber=0
        var contents={}
        contents.channelId = channel_id
        content.content = contents
        var ForData = { content: content}
        console.log(ForData)
        wx.request({
          url: javaApi + 'api/goods/shopping/list',
          method: "POST",
          data: ForData,
          // dataType: json,
          header: {
            // "Content-Type": "application/x-www-form-urlencoded",
            'content-type': 'application/json',
            "Cookie": JSESSIONID
          },
          success: function (res) {
            // console.log(res)
            if (res.data.code == 1000) {
              var list=res.data.content.content
              console.log(list)
              var goodsId=''
              var channelId=''
              var goodsSpecId = ''
              for (var i in list){
                if(i==0){
                  goodsId += list[i]['goodsId']
                  channelId += list[i]['channelId']
                  goodsSpecId += list[i]['goodsSpecId']
                }else{
                  goodsId += ','+list[i]['goodsId'] 
                  channelId += ','+list[i]['channelId']
                  goodsSpecId += ','+list[i]['goodsSpecId']
                }
                var str={}
                str.goodsId = goodsId
                str.channelId = channelId
                str.goodsSpecId = goodsSpecId
              }
              // console.log(str)
              wx.request({
                url: LocalUrl + 'Getgoods/getattrgoods',
                method: "POST",
                data: str,
                header: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  // 'content-type': 'application/json',
                  // "Cookie": "sid=" + res.data.content.sessionId
                },
                success: function (res) {
                  console.log(res)
                  if (res.data.code == 1000){
                       var listt=res.data.list
                       var class_name = res.data.class_name
                       var totla_price = that.data.totla_price
                         var getdata=[]
                         for(var i in list){
                            for(var j in listt){
                              if (list[i].goodsId == listt[j].goods_id && list[i].goodsSpecId == listt[j].spec_id && list[i].channelId == listt[j].channel_id ){
                                // var totla_price = 0;
                                listt[i].id = list[i].id
                                listt[i].specNum = list[i].specNum
                                totla_price += parseInt(list[i].specNum) * parseFloat(listt[j].spec_price)
                                // console.log(totla_price)
                                // console.log(parseInt(list[i].specNum))
                                // console.log(parseFloat(list[i].spec_price))
                                getdata.push(listt[i])
                                 }
                            }
                         }
                        //  console.log(totla_price)
                        //  console.log(getdata)
                         var formData = getdata
                         //分类名称
                         wx.setStorageSync('class_name', class_name)
                         console.log(totla_price)
                       that.setData({
                         getdata: getdata,
                         class_name: class_name,
                         totla_price: totla_price,
                         formData: formData,
                         pageSize: that.data.pageSize+2,
                         JSESSIONID: JSESSIONID
                       })

                       wx.hideLoading()
                  }else{
                    wx.showToast({
                      title: res.data.message,
                      duration: 2000
                    })
                  }
                }

                })
              // //頁面跳轉
              // wx.redirectTo({
              //   url: '../service_buy/service_buy'
              // })
            }else{
              wx.showToast({
                title: res.data.message,
                duration: 2000
              })
            }
          }
        })
      }
    })
  },
  //点击减少数量
  reduce:function(e){
    var that=this
    var JSESSIONID = that.data.JSESSIONID
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var javaApi = getApp().globalData.javaApi
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var totla_price = that.data.totla_price
    var getdata = that.data.getdata
    var formData = that.data.formData
    var content = {}
    var getcontent = {}
    if (formData[index].id == id) {
      if (parseFloat(formData[index].specNum) != 1){
        content.specNum = parseFloat(formData[index].specNum) - 1
        formData[index].specNum = parseFloat(formData[index].specNum) - 1
        getdata[index].specNum = parseFloat(getdata[index].specNum) - 1
        totla_price -= parseFloat(formData[index].spec_price)
        content.id = id
        getcontent.content = content
        console.log(getcontent)
        wx.request({
          url: javaApi + 'api/goods/shopping/updateShopingNum',
          method: "POST",
          data: getcontent,
          // dataType: json,
          header: {
            // "Content-Type": "application/x-www-form-urlencoded",
            'content-type': 'application/json',
            "Cookie": JSESSIONID
          },
          success: function (res) {
            if (res.data.code == 1000) {
              that.setData({
                totla_price: totla_price,
                getdata: getdata,
                formData: formData
              })
              wx.hideLoading()
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 2000
              })
            }
          }
        })
      }

    }

  },
  //点击数量添加
  add:function(e){
    var that=this
    var JSESSIONID = that.data.JSESSIONID
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var javaApi = getApp().globalData.javaApi
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var totla_price = that.data.totla_price
    var getdata = that.data.getdata
    var formData = that.data.formData
    var content={}
    var getcontent={}
    if (formData[index].id == id) {
      content.specNum = parseFloat(formData[index].specNum) + 1
        formData[index].specNum = parseFloat(formData[index].specNum) + 1
        getdata[index].specNum = parseFloat(getdata[index].specNum) + 1
        totla_price +=parseFloat(formData[index].spec_price)
        content.id = id
        getcontent.content = content
        console.log(getcontent)
        wx.request({
          url: javaApi + 'api/goods/shopping/updateShopingNum',
          method: "POST",
          data: getcontent,
          // dataType: json,
          header: {
            // "Content-Type": "application/x-www-form-urlencoded",
            'content-type': 'application/json',
            "Cookie": JSESSIONID
          },
          success: function (res) {
            if (res.data.code == 1000) {
              that.setData({
                totla_price: totla_price,
                getdata: getdata,
                formData: formData
              })
              wx.hideLoading()
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 2000
              })
            }
          }
        })
    }
  },
  EventHandle:function(e){
    var that = this
    var JSESSIONID = that.data.JSESSIONID
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var javaApi = getApp().globalData.javaApi
    var index=e.target.dataset.index
    var id=e.target.dataset.id
    var specNum=e.detail.value
    var totla_price = that.data.totla_price
    var getdata = that.data.getdata
    var formData = that.data.formData
    var content = {}
    var getcontent = {}
    if (formData[index].id == id) {
      if (specNum != '' && specNum != 0){
        totla_price -= parseFloat(formData[index].specNum) * parseFloat(formData[index].spec_price)
        formData[index].specNum = parseFloat(specNum)
        getdata[index].specNum = parseFloat(specNum)
        totla_price += parseFloat(formData[index].specNum) * parseFloat(formData[index].spec_price)
        content.id = id
        content.specNum = specNum
        getcontent.content = content
        console.log(getcontent)
        wx.request({
          url: javaApi + 'api/goods/shopping/updateShopingNum',
          method: "POST",
          data: getcontent,
          // dataType: json,
          header: {
            // "Content-Type": "application/x-www-form-urlencoded",
            'content-type': 'application/json',
            "Cookie": JSESSIONID
          },
          success: function (res) {
            console.log(res)
            if (res.data.code == 1000) {
              that.setData({
                totla_price: totla_price,
                getdata: getdata,
                formData: formData
              })
              wx.hideLoading()
            } else {
              wx.showToast({
                title: res.data.message,
                duration: 2000
              })
            }
          }
        })
      }
    }
    that.setData({
      totla_price: totla_price,
      getdata: getdata,
      formData: formData
    })
  },
  formSubmit:function(){
    var that=this
    var JSESSIONID = that.data.JSESSIONID
   var  formData =[]
   
   var dataa= that.data.formData
   var totla_price = that.data.totla_price
   for (var i in dataa){
     var datab = {}
      datab=dataa[i]
      formData.push(datab)
   }
   console.log(formData)
   //结算购物车数据
   wx.setStorageSync('formData', formData)
   //总价格
   wx.setStorageSync('totla_price', totla_price)
   if (formData.length <= 0){
     wx.showToast({
       title: '你未选择结算商品',
       duration: 2000
     })
   }else{
     wx.navigateTo({
       url: '../service_money/service_money'
     })
   }

    // console.log(formData)
  },
  check:function(e){
    // console.log(e)
    var that=this
    var id = e.target.dataset.id
    var index = e.target.dataset.index
    var totla_price = that.data.totla_price
    var getdata = that.data.getdata
    var formData = that.data.formData
    // console.log(formData)
    var isCon=''
    for (var i in formData){
      if (formData[index] ||formData[i].id == id) {
        isCon = true
      } else {
        isCon = false
      }
      continue;
    }
      if (isCon == true){
        totla_price -= parseFloat(formData[index].specNum) * parseFloat(formData[index].spec_price)
        delete formData[index]
        
    }else{
          if (getdata[index].id == id){
            formData[index]=getdata[index]
                totla_price += parseFloat(getdata[index].specNum) * parseFloat(getdata[index].spec_price)
      }
    }
    // console.log(isCon)
    that.setData({
      formData: formData,
      totla_price: totla_price
    })
    // console.log(formData)
    // console.log(totla_price)
  },
  del:function(e){
    var that = this
    var JSESSIONID = that.data.JSESSIONID
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })
    var javaApi = getApp().globalData.javaApi
    var id = e.target.dataset.id
    console.log(id)
    var index = e.target.dataset.index
    var totla_price = that.data.totla_price
    var getdata = that.data.getdata
    var formData = that.data.formData
    if (formData[index].id == id){
        totla_price -= parseFloat(formData[index].specNum) * parseFloat(formData[index].spec_price)
        delete formData[index]
        delete getdata[index]
      }
    var ForData={}
    ForData.content = { 'shoppingCartIds':[id]}
    console.log(ForData)
    wx.request({
      url: javaApi + 'api/goods/shopping/remove',
      method: "POST",
      data: ForData,
      // dataType: json,
      header: {
        // "Content-Type": "application/x-www-form-urlencoded",
        'content-type': 'application/json',
        "Cookie": JSESSIONID
      },
      success: function (res) {
           console.log(res)
           if (res.data.code == 1000){
             that.setData({
               formData: formData,
               getdata: getdata,
               totla_price: totla_price
             })
             wx.hideLoading()
           }
      }
      })
  }
  
})  