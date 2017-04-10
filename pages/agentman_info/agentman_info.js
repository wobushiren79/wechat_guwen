Page({
    data: {
        array: ['亲属','儿子', '兄弟','其他','母亲','父亲','哥哥','姐姐','弟弟','妹妹','女儿','孙子','孙女'],
        businessType:0,
        consultId:'',
    },
    bindPickerChange: function(e) {
        this.setData({
            businessType: e.detail.value
        })
    },
    onLoad: function (options) {
        var RouteUrl = getApp().globalData.RouteUrl
        var that = this
        var consultId = options.consultId
        var name=''
        var 
        var ContentData={}
        ContentData.consultId=consultId
        //获取已经有的经办人信息
      wx.getStorage({
            key: 'logindata',
              success: function(msg) {
              // console.log(ContentData)
              var forData={content:ContentData}
              //转换字符串
              var ForData=JSON.stringify(forData)
                wx.request({
                  url: RouteUrl+'customer/agentman/get', 
                  method:"POST",
                  data: ForData,
                  header: {
                    "Content-Type":"application/x-www-form-urlencodeed",
                    "Cookie":"sid="+msg.data.content.sessionId
                  },
                  success: function(res) {
                    var AgentmanData=res.data.content.consultAgentman
                    if(res.data.code == 1000 &&res.data.message == '操作成功'){
                         console.log(AgentmanData)
                        //console.log(res.data.content.consultId)
                      //頁面跳轉
                      // wx.redirectTo({
                      //      url: '',
                      //  })
                        // console.log(res.data)
                    }else{
                      console.log(res.data.message)
                    }
                  }
                })
              }
          })
        that.setData({
            consultId: consultId
        })
    },
formSubmit:function(e){
    var ContentData=e.detail.value   
    var consultId=this.data.consultId
    var RouteUrl = getApp().globalData.RouteUrl
    var relation=this.data.businessType
    if(relation == 0){
       relation='亲属'
    }else if(relation == 1){
       relation='儿子'
    }else if(relation == 2){
       relation='兄弟'
    }else if(relation == 3){
       relation='其他'
    }else if(relation == 4){
       relation='母亲'
    }else if(relation == 5){
       relation='父亲'
    }else if(relation == 6){
       relation='哥哥'
    }else if(relation == 7){
       relation='姐姐'
    }else if(relation == 8){
       relation='弟弟'
    }else if(relation == 8){
       relation='妹妹'
    }else if(relation == 8){
       relation='女儿'
    }else if(relation == 8){
       relation='孙子'
    }else if(relation == 8){
       relation='孙女'
    }
    ContentData.relation=relation
    ContentData.consultId=consultId
    //console.log(ContentData)
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
        success: function(msg) {
        // console.log(ContentData)
         var forData={content:ContentData}
         console.log(forData)
         //转换字符串
         var ForData=JSON.stringify(forData)
          wx.request({
            url: RouteUrl+'customer/agentman/save', 
            method:"POST",
            data: ForData,
            header: {
               "Content-Type":"application/x-www-form-urlencodeed",
               "Cookie":"sid="+msg.data.content.sessionId
            },
            success: function(res) {
              //console.log(res.data)
              if(res.data.code == 1000 && res.data.message == '操作成功'){
                // console.log(11111)
                //頁面跳轉
                wx.redirectTo({
                     url: '../compact/compact?consultId='+consultId
                 })
                  // console.log(res.data)
              }else{
                console.log(res.data.message)
              }
            }
          })
        }
    })
     },
formData:function(e){
    var ContentData=e.detail.value   
    var consultId=this.data.consultId
    var RouteUrl = getApp().globalData.RouteUrl
    var relation=this.data.businessType
    if(relation == 0){
       relation='亲属'
    }else if(relation == 1){
       relation='儿子'
    }else if(relation == 2){
       relation='兄弟'
    }else if(relation == 3){
       relation='其他'
    }else if(relation == 4){
       relation='母亲'
    }else if(relation == 5){
       relation='父亲'
    }else if(relation == 6){
       relation='哥哥'
    }else if(relation == 7){
       relation='姐姐'
    }else if(relation == 8){
       relation='弟弟'
    }else if(relation == 8){
       relation='妹妹'
    }else if(relation == 8){
       relation='女儿'
    }else if(relation == 8){
       relation='孙子'
    }else if(relation == 8){
       relation='孙女'
    }
    ContentData.relation=relation
    ContentData.consultId=consultId
    //console.log(ContentData)
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
        success: function(msg) {
        // console.log(ContentData)
         var forData={content:ContentData}
         //console.log(forData)
         //转换字符串
         var ForData=JSON.stringify(forData)
          wx.request({
            url: RouteUrl+'customer/agentman/save', 
            method:"POST",
            data: ForData,
            header: {
               "Content-Type":"application/x-www-form-urlencodeed",
               "Cookie":"sid="+msg.data.content.sessionId
            },
            success: function(res) {
              //console.log(res.data)
              if(res.data.code == 1000 && res.data.message == '操作成功'){
                // console.log(11111)
                //頁面跳轉
                wx.redirectTo({
                     url: '../deadman_info/deadman_info?consultId='+consultId
                 })
                  // console.log(res.data)
              }else{
                console.log(res.data.message)
              }
            }
          })
        }
    })
}
});
