Page({
    data: {
      show:true,
      hide: false,
      list_show:false
    },
    bind_list:function(){
      var that = this;
      that.setData({
        list_show: (!that.data.list_show)
      })
    }

});
