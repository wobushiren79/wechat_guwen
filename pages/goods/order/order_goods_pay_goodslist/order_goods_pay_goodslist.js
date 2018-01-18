Page({
  data: {
    show: false,
    list_show: true,
    xuyao: '不需要发票'
  },
  bind_list: function () {
    var that = this;
    that.setData({
      list_show: (!that.data.list_show)
    })
  },
  onLoad:function(e){
  var that=this
  var goodslist=[]
  var specNum=0
    wx.getStorage({
      key: 'getdatalist',
      success: function (res) {
        if (e.id == ''){
          for (var i in res.data) {
            // if (res.data[i].id == e.id) {
              goodslist = res.data[i].goods,
                specNum = res.data[i].specNum
            // }

          }
        }else{
        for(var i in  res.data){
          if (res.data[i].id == e.id){
            goodslist = res.data[i].goods,
            specNum = res.data[i].specNum
            }
          
        }
        }
        that.setData({
          getdatalist: goodslist,
          specNum: specNum
        })
      },
      fail:function(){
        wx.showToast({
          title: '网络错误',
          image: '/images/icon_info.png',
          duration: 2000
        })
      }
    })
  }

});
