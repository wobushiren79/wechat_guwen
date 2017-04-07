Page({
    data: {
        array_a: ['男', '女','未知'],
        businessType_a:0,
        array_b: ['健康', '健康1','健康2'],
        businessType_b:0,
        array_c: ['家属自己准备寿衣', '家属自己准备寿衣1','家属自己准备寿衣2'],
        businessType_c:0,
        array_d: ['健康', '健康1','健康2'],
        businessType_d:0,
    },
    bindPickerChange_a: function(e) {
        this.setData({
            businessType_a: e.detail.value
        })
    },
    bindPickerChange_b: function(e) {
        this.setData({
            businessType_b: e.detail.value
        })
    },
    bindPickerChange_c: function(e) {
        this.setData({
            businessType_c: e.detail.value
        })
    },
        bindPickerChange_d: function(e) {
        this.setData({
            businessType_d: e.detail.value
        })
    },
    bindDateChange: function(e) {
        this.setData({
            date: e.detail.value
        })
    },
     formSubmit:function(e){
         var ContentData=e.detail.value
         if(this.data.businessType == 0){
            ContentData.businessType = 1
         }else if(this.data.businessType == 1){
             ContentData.businessType = 2
         }     
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
        success: function(msg) {
        // console.log(ContentData)
         var forData={content:ContentData}
         //转换字符串
         var ForData=JSON.stringify(forData)
          wx.request({
            url: 'http://115.28.163.211:7080/shianlife-adviser-1.0-SNAPSHOT/consult/add', 
            method:"POST",
            data: ForData,
            header: {
               "Content-Type":"application/x-www-form-urlencodeed",
               "Cookie":"sid="+msg.data.content.sessionId
            },
            success: function(res) {
              //console.log(res.data)
              if(res.data.code == 1000 &&res.data.message == '操作成功'){
                  //console.log(res.data.content.consultId)
                //操作成功返回consultId進行緩存
                wx.setStorageSync('consultId',res.data.content.consultId)
                //頁面跳轉
                // wx.navigateTo({
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
     },
     formData:function(e){
         var ContentData=e.detail.value

         if(this.data.businessType == 0){
            ContentData.businessType = 1
         }else if(this.data.businessType == 1){
             ContentData.businessType = 2
         }     
    // 取出緩存登錄信息
    wx.getStorage({
      key: 'logindata',
        success: function(msg) {
        // console.log(ContentData)
         var forData={content:ContentData}
         //转换字符串
         var ForData=JSON.stringify(forData)
          wx.request({
            url: 'http://115.28.163.211:7080/shianlife-adviser-1.0-SNAPSHOT/consult/add', 
            method:"POST",
            data: ForData,
            header: {
               "Content-Type":"application/x-www-form-urlencodeed",
               "Cookie":"sid="+msg.data.content.sessionId
            },
            success: function(res) {
              //console.log(res.data)
              if(res.data.code == 1000 &&res.data.message == '操作成功'){
                  console.log('進入淺談')
                // that.globalData.indexdata=res.data
                //登錄信息緩存
                // wx.setStorageSync('logindata',res.data)
                //頁面跳轉
                wx.navigateTo({
                     url: '../list/list',
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
