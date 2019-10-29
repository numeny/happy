import Taro from '@tarojs/taro';

export const Log = {

  log: function(msg) {
       if (DEBUG) console.log(msg)
  },

  error: function(msg) {
       if (DEBUG) console.error(msg)
  },

  warning: function(msg) {
       if (DEBUG) console.warning(msg)
  },

  info: function(msg) {
       if (DEBUG) console.info(msg)
  },
}
