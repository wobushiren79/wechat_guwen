
//手机号码验证
function checkMobile(sMobile) {
  if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))) {
    return false;
  } else {
    return true;
  }
}

//判断字符串是否为数字
function checkRate(input) {
  var re = /^[0-9]+.?[0-9]*$/;
  if (!re.test(input)) {
    return false;
  }
  return true;
}
module.exports.checkMobile = checkMobile;
module.exports.checkRate = checkRate;