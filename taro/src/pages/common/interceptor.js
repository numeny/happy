import Taro from '@tarojs/taro';

let Ajax = (url, method, data, header) => {
  // 请求拦截处理写在这里
  Taro.showLoading({
    title: '加载中',
    icon: 'loading',
    mask: true
  });
  return new Promise((resolve, reject) => {
    Taro.request({
      url: url,
      data: data,
      method: method,
      header: header,
      success: (res) => {
        // 响应拦截处理写在这里
        if (res.statusCode == 200) {// 确认用户登录，而不仅仅是有sessionId，还需要有登录的信息用户openId
            let loginData = Taro.getStorageSync('loginData');
            if(loginData) {
              loginData = JSON.parse(loginData)
            }
            /*
            if(!loginData.openId) {
              Taro.showModal({
                title:'提示',
                content:'请进行登录。',
                success:(res)=>{
                  if(res.confirm){
                    Taro.clearStorageSync();
                    Taro.reLaunch({
                      url:'/subPages1/pages/login/login'
                    });
                    return;
                  }
                }
              })
          }
          */
          return resolve(res);
        } else if (res.statusCode == 404) {
          Toast('404 请求页面不存在');
        } else if (res.statusCode == 408) {
          Toast('请求超时');
        } else if (res.statusCode == 500) {
          Toast('服务器错误')
        } else if (res.statusCode == 0) {
          Toast('网络连接超时')
        } else if (res.statusCode == 501) {
          Taro.showModal({
            title:'提示',
            content:'请进行登录。',
            success:(res)=>{
              if(res.confirm){
                Taro.clearStorageSync();
                Taro.reLaunch({
                  url:'/subPages1/pages/login/login'
                });
                return;
              }
            }
          })
        }
        reject(res);
      },
      fail: (error) => {
        Model('服务器错误，请稍候再试 ！');
        reject(error);
        return;
      },
      complete: () => {
        Taro.hideLoading();
      }
    })
  })
}

//将sessionId通过请求头传递给后台，用于判断是否登录以及登录是否过期超时
let get = (url, data, header) => {
  header = header ? header : {"Cookie": "JSESSIONID=" + Taro.getStorageSync("sessionId")};
  return Ajax(url, 'GET', data, header);
}

let post = (url, data, header) => {
  header = header ? header : {"Cookie": "JSESSIONID=" + Taro.getStorageSync("sessionId")};
  header['Content-Type'] = 'application/json';
  return Ajax(url, 'POST', data, header);
}

let Toast = (msg) => {
  Taro.showToast({
    title: msg,
    duration: 3000,
    icon: 'none',
    mask: true
  })
}

let Model = (msg) => {
  Taro.showModal({
    title: '提示',
    content: msg,
    showCancel: false
  })
}

export default {get, post}
