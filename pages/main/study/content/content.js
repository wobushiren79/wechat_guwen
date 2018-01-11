var content;
Page({
    data: {


    },
   onLoad:function(e){
     content=this;
     var id=e.id;
     content.setData({
       url: getApp().globalData.appPHPUrl +"home/index/helps?id="+id
     })
   }

});
