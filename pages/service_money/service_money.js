Page({
    data: {
      show:false,
      list_show:false,
      xuyao:'不需要发票'
    },
    bind_list:function(){
      var that = this;
      that.setData({
        list_show: (!that.data.list_show)
      })
    },
    onLoad:function(){
      var that=this
      //取出JSESSIONID
      wx.getStorage({
        key: 'JSESSIONID',
        success: function(res) {
          that.setData({
            JSESSIONID: res.data
          })
        },
      })
      //取出渠道
      wx.getStorage({
        key: 'channel',
        success: function (r) {
          var channel_id=r.data.id
          that.setData({
            channel_id: r.data.id,
          })
        }
      })
      // 取出购物车数据
      wx.getStorage({
        key: 'formData',
        success: function (res) {
          var formData=res.data
          var goodsnumber=formData.length
          // var OrderData={}
          // OrderData.orderChannel = channel_id
          // OrderData.orderChannel = channel_id
          that.setData({
            formData: formData,
            goodsnumber: goodsnumber
          })
          //取出分类
          wx.getStorage({
            key:'class_name',
            success:function(ress){
              that.setData({
                class_name: ress.data
              })
            }
          })
          //取出总价格
          wx.getStorage({
            key: 'totla_price',
            success: function (r) {
              that.setData({
                totla_price: r.data
              })
            }
          })
        }
      })
    },
    onShow:function(){
      var that=this
      //取出客户信息
      wx.getStorage({
        key: 'kehu',
        success: function (r) {
          that.setData({
            kehu: r.data,
            show:true
          })
        }
      })
      //取出发票信息
      wx.getStorage({
        key: 'fapiao',
        success: function (r) {
          if (r.data.needInvoice  == 0){
            that.setData({
              fapiao: r.data,
              xuyao: '不需要发票'
            })
          }else{
            that.setData({
              fapiao: r.data,
              xuyao:'需要发票'
            })
          }
        }
      })
    },
    bindFormSubmit:function(e){
      var that=this
      var JSESSIONID = that.data.JSESSIONID
      var orderdata={}
      var getdata={}
      var goodsOrder={}
      var goodsOrderItems=[]
      var goodsInvoice={}
      var goodsServiceInfo={}
      //渠道
      var channel_id=that.data.channel_id
      //购物车数据
      var formData = that.data.formData
      //分类数据
      var class_name=that.data.class_name
      //总单价
      var totla_price = that.data.totla_price
      //客户信息
      var kehu = that.data.kehu
      //发票信息
      var fapiao = that.data.fapiao
      //渠道ID
      goodsOrder.orderChannel = channel_id
      //关联人id
      goodsOrder.connectId=''
      //下单备注
      goodsOrder.orderComment = e.detail.value.orderComment
      goodsOrder.customerName = kehu.contact
      goodsOrder.customerPhone = kehu.contactPhone
      //是否需要发票
      if (fapiao){
        goodsOrder.needInvoice = fapiao.needInvoice
      }else{
        goodsOrder.needInvoice = 0
      }
      //订单总金额
      goodsOrder.showTotalPrice = totla_price*100
      //顾问总金额
      var totalPrice = 0
      for (var i in formData){
        totalPrice += formData[i].adviser_price * formData[i].specNum*100
      }
      goodsOrder.totalPrice = totalPrice
      getdata.goodsOrder = goodsOrder
      // console.log(formData)
      //商品ID
      for (var i in formData){
        var goodslist = {}
        goodslist.goodsId = parseInt(formData[i].goods_id)
        goodslist.goodsSpecId = parseInt(formData[i].spec_id)
        goodslist.specOrderedPrice = parseFloat(formData[i].spec_price)*100
        goodslist.specOrderedNum = parseInt(formData[i].specNum)
        goodslist.specOrderedVolume = formData[i].goods_name
        goodslist.specAlias = formData[i].spec_alias
        goodslist.currentDiscount = 1
        goodslist.specOrderedAttr = formData[i].class_name
        goodslist.titleImg = formData[i].title_img
        goodslist.unit = formData[i].unit
        goodslist.specName = formData[i].spec_name
        goodslist.ementPrice = parseFloat(formData[i].ement_price)*100
        goodslist.adviserPrice = parseFloat(formData[i].adviser_price)*100
        goodslist.specNumber = formData[i].goods_number
        goodslist.classifyId = parseInt(formData[i].goods_class_id)
        goodslist.classifyAttrId = parseInt(formData[i].class_attr_id)
        goodsOrderItems.push(goodslist)
        // console.log(goodslist)
      }
      console.log(goodsOrderItems)
      getdata.goodsOrderItems = goodsOrderItems
      //发票信息组装
      if (fapiao){
        goodsInvoice.titleType = fapiao.titleType
        goodsInvoice.title = fapiao.title
        goodsInvoice.companyTaxId = fapiao.companyTaxId
        goodsInvoice.invoiceRemark = fapiao.invoiceRemark
        goodsInvoice.receiptName = fapiao.receiptName
        goodsInvoice.receiptPhone = fapiao.receiptPhone
        goodsInvoice.receiptLocation = fapiao.receiptLocation
      }
      getdata.goodsInvoice = goodsInvoice
      if (kehu){
        goodsServiceInfo.serviceWay = kehu.serviceWay
        goodsServiceInfo.selfDelivery = kehu.selfDelivery
        goodsServiceInfo.selfDeliveryTime = kehu.selfDeliveryTime
        goodsServiceInfo.bookTime = kehu.bookTime
        goodsServiceInfo.contact = kehu.contact
        goodsServiceInfo.contactPhone = kehu.contactPhone
        goodsServiceInfo.serviceLocation = kehu.serviceLocation

      }
      getdata.goodsServiceInfo = goodsServiceInfo
      orderdata = { content: getdata}
      var OrderData = JSON.stringify(orderdata)
      console.log(orderdata)
      var javaApi = getApp().globalData.javaApi
      wx.request({
        url: javaApi + 'api/goods/order/save',
        method: "POST",
        data: orderdata,
        header: {
          // "Content-Type": "application/x-www-form-urlencodeed",
          'content-type': 'application/json',
          "Cookie": JSESSIONID
        },
        success: function (res) {
         console.log(res)
         if (res.data.code == 1000){
           wx.navigateTo({
             url: '../service_goods_order/service_goods_order?orderId=' + res.data.content.orderId
           })
         }else{
           wx.showToast({
             title: res.data.message,
             duration: 2000
           })
         }
        }
      })
      // console.log(orderdata)
    }

});
