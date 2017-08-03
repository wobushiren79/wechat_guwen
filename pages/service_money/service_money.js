Page({
    data: {
      show:false,
      list_show:false
    },
    bind_list:function(){
      var that = this;
      that.setData({
        list_show: (!that.data.list_show)
      })
    },
    onLoad:function(){
      var that=this
      //取出渠道
      wx.getStorage({
        key: 'channel',
        success: function (r) {
          var channel_id=r.data.id
          that.setData({
            channel_id: r.data.id
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
      wx.getStorage({
        key: 'kehu',
        success: function (r) {
          that.setData({
            kehu: r.data,
            show:true
          })
        }
      })
    }

});
