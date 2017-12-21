
//手机号码验证
function checkMobile(sMobile) {
  if (!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(sMobile))) {
    return false;
  } else {
    return true;
  }
}

module.exports.checkMobile = checkMobile;