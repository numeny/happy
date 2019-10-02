import Taro from '@tarojs/taro';

export const Util = {

  isInstanceOf: function(thisVar, varType) {
    return Object.prototype.toString.call(thisVar)
            === "[object " + varType + "]"
  },

  isString: function(thisVar) {
    return Util.isInstanceOf(thisVar, 'String')
  },

  isArray: function(thisVar) {
    return Util.isInstanceOf(thisVar, 'Array')
  },

  setInterval: function(callback) {
    const timeId = setInterval(() => {
        callback()
        clearInterval(timeId)
    }, 1000);
  },

  checkUsername: function(username) {
    if (username.length === 0) {
      Taro.showToast({title: '请输入用户名！'})
      return false
    }
    return true
  },

  checkPassword: function(password) {
    if (password.length === 0) {
      Taro.showToast({title: '请输入密码！'})
      return false
    }

    if (!Util.checkPasswd(password)) {
      Taro.showToast({title: '密码复杂度不够，请重新设置！'})
      return false
    }
    return true
  },

  checkPassword2: function(password, password2) {
    if (password.length === 0) {
      Taro.showToast({title: '请输入密码！'})
      return false
    }
    if (password2.length === 0) {
      Taro.showToast({title: '请再次输入密码！'})
      return false
    }
    if (password != password2) {
      Taro.showToast({title: '两次输入密码不一致！'})
      return false;
    }
    if (!Util.checkPasswd(password)) {
      Taro.showToast({title: '密码复杂度不够，请重新设置！'})
      return false
    }
    return true;
  },

  checkPasswd: function(passwd) {
    /* FIXME
    if(passwd.length < 6) {
      return false
    }
    var ls = 0;
    if (passwd.match(/([a-z])+/)) {
      ls++;
    }
    if (passwd.match(/([0-9])+/)) {
      ls++;  
    }
    if (passwd.match(/([A-Z])+/)) {
      ls++;
    }
    if (passwd.match(/[^a-zA-Z0-9]+/)) {
       ls++;
    }
    */
    return true
  },

  isH5: function() {
    return process.env.TARO_ENV == 'h5'
    // return true
  },
  isWeapp: function() {
    // return true
    return process.env.TARO_ENV == 'weapp'
  },
  isAlipay: function() {
    // return true
    return process.env.TARO_ENV == 'alipay'
  },
  getTaroEnv: function() {
    return process.env.TARO_ENV
    // return 'weapp'
  },
}
