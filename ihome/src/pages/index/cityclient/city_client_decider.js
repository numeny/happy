import Taro from '@tarojs/taro'
import { Log } from '@util/log'
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
    Log.log('set CityClient : currCityClient: '
        + currCityClient
        + ', city: ' + state.mCurrCity)

    currCityClient.setClientState(state)
    return currCityClient
  },
}
