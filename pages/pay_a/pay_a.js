Page({
    data: {
        showTopTips: false,

        radioItems: [
            // {name: 'Pos机支付', value: '0'},
            // {name: '现金支付', value: '1'},
            {name: '微信支付', value: '2', checked: true},
            // {name: '支付宝支付', value: '3'}

        ],
       
        money: 1200,
        isAgree: false
    },
   
    radioChange: function (e) {
        console.log('radio发生change事件，携带value值为：', e.detail.value);

        var radioItems = this.data.radioItems;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            radioItems: radioItems
        });
    }
  
});