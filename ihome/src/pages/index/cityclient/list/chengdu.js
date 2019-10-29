import Taro from '@tarojs/taro'
import { Util } from '@util/util'
import { Log } from '@util/log'

import { sNonFirstTierCityClient } from './non_first_tier_city_client'

export function ChengduCityClient(state) {

  ChengduCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax_Chengdu;
  }

  ChengduCityClient.prototype.getPersonalIncomeTax = function() {
    Log.log('ChengduCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0;
    }
    let personalIncomeTax = this.mState.mWebSignPrice * 0.01
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }


  ChengduCityClient.prototype.__proto__ = sNonFirstTierCityClient.__proto__
}


export let sChengduCityClient = new ChengduCityClient()
