Page({
    data: {
        array: ['紧急', '不紧急'],
        index: 0
    },
    bindPickerChange: function(e) {
        this.setData({
            index: e.detail.value
        })
    }
});
