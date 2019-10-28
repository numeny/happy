import Taro from '@tarojs/taro'
import { Util } from '@util/util'

import { sCityClientBase } from './list/city_client_base'
import { sBeijingCityClient } from './list/beijing'
import { sShanghaiCityClient } from './list/shanghai'
import { sShenzhenCityClient } from './list/shenzhen'
import { sGuangzhouCityClient } from './list/guangzhou'

import { sTianjinCityClient } from './list/tianjin'
import { sChengduCityClient } from './list/chengdu'
import { sNonFirstTierCityClient } from './list/non_first_tier_city_client'

export let sCalcClientDecider =  {

  changeCityClient : (state) => {
    let currCityClient = null
    const cityClientMap = {
      '北京市' : sBeijingCityClient,
      '上海市' : sShanghaiCityClient,
      '深圳市' : sShenzhenCityClient,
      '广州市' : sGuangzhouCityClient,
      '天津市' : sTianjinCityClient,
      '重庆市' : sNonFirstTierCityClient,
    }

    currCityClient = cityClientMap[state.mCurrCity]
    if (currCityClient == null
          || currCityClient == undefined) {
      currCityClient = sNonFirstTierCityClient
    }
    console.log('set CityClient : currCityClient: '
        + currCityClient
        + ', city: ' + state.mCurrCity)
    /*
    if (state.mCurrCity == 'shenzhen') {
      console.log('set ShenzhenCityClient in shenzhen!')
      currCityClient = sShenzhenCityClient
    } else if (state.mCurrCity == 'suzhou'
        || state.mCurrCity == 'nanjing'
        || state.mCurrCity == 'xian') {
      console.log('set NonFirstTierCityClient in suzhou!')
      currCityClient = sNonFirstTierCityClient
    } else if (state.mCurrCity == ) {
      console.log('set CityClientBase in beijing!')
      currCityClient = sBeijingCityClient
    } else if (state.mCurrCity == '上海市') {
      console.log('set CityClientBase in beijing!')
      currCityClient = sBeijingCityClient
    } else if (state.mCurrCity == 'tianjin') {
      console.log('set TianjinCityClient in tianjin!')
      currCityClient = sTianjinCityClient
    } else if (state.mCurrCity == 'chengdu') {
      console.log('set sChengduCityClient in chengdu!')
      currCityClient = sChengduCityClient
    } else {
      console.log('set CityClientBase in else!')
      currCityClient = sCityClientBase
    }
    */

    console.log('set CityClient : currCityClient.prototype: '
        + currCityClient.__proto__)
    currCityClient.setClientState(state)
    return currCityClient
  },
}
