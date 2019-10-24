import Taro from '@tarojs/taro'
import { Util } from '@util/util'

import { sCityClientBase } from './list/city_client_base'
import { sShenzhenCityClient } from './list/shenzhen'
import { sTianjinCityClient } from './list/tianjin'
import { sChengduCityClient } from './list/chengdu'
import { sNonFirstTierCityClient } from './list/non_first_tier_city_client'


// let sCurrCityClient = null

export let sCalcClientDecider =  {

  changeCityClient : (state) => {
    let currCityClient = null
    if (state.mCurrCity == 'shenzhen') {
      console.log('set ShenzhenCityClient in shenzhen!')
      currCityClient = sShenzhenCityClient
    } else if (state.mCurrCity == 'suzhou'
        || state.mCurrCity == 'nanjing'
        || state.mCurrCity == 'xian') {
      console.log('set NonFirstTierCityClient in suzhou!')
      currCityClient = sNonFirstTierCityClient
    } else if (state.mCurrCity == 'beijing') {
      console.log('set CityClientBase in beijing!')
      currCityClient = sCityClientBase
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

    console.log('set CityClient : currCityClient.prototype: '
        + currCityClient.__proto__)
    currCityClient.setClientState(state)
    return currCityClient
  },
}
