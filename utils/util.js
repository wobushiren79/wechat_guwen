function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 图片路径前缀
 */
function imgUrlPrefixSpell(imgUrl) {
	var fileRemotePrefix = getApp().globalData.qiniuFilePathPrefix;
	if (imgUrl == null || imgUrl.length == 0) {
		return null;
	}
	if (imgUrl.indexOf(fileRemotePrefix.substr(0, 7)) == -1) {
		imgUrl = fileRemotePrefix.concat(imgUrl);
	}
	return imgUrl;
}
module.exports = {
  formatTime: formatTime,
  imgUrlPrefixSpell: imgUrlPrefixSpell
}
