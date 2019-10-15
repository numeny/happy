import Taro from '@tarojs/taro';

export const Util = {

  isInstanceOf: function(thisVar, varType) {
    return Object.prototype.toString.call(thisVar)
            === "[object " + varType + "]"
  },

  isString: function(thisVar) {
    return Util.isInstanceOf(thisVar, 'String')
  },

  isNumber: function(thisVar) {
    return typeof thisVar === 'number' && !isNaN(thisVar);
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
