import Taro from '@tarojs/taro'
import { Util } from '@util/util'

import { sCityClientBase } from './city_client_base'

// https://sh.lianjia.com/wenda/xiangqing/295932.html
// https://sh.lianjia.com/wenda/xiangqing/302486.html
export function ShanghaiCityClient(state) {
  ShanghaiCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    console.log('ShanghaiCityClient.getPersonalIncomeTaxHelpIndex: '
        + Util.mTipBoxMessages.PersonalIncomeTax_Shanghai)
    return Util.mTipBoxMessages.PersonalIncomeTax_Shanghai;
  }

  ShanghaiCityClient.prototype.getPersonalIncomeTax = function() {
    console.log('ShanghaiCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0;
    }
    let personalIncomeTax = 0;
    if (this.mState.mOriginPrice != 0) {
      personalIncomeTax = (this.mState.mWebSignPrice - this.mState.mValueAddedTax - this.mState.mOriginPrice - this.mState.mOriginTaxSum) * 0.2
    } else {
      personalIncomeTax = (this.mState.mWebSignPrice
          - this.mState.mValueAddedTax) *
          (this.mState.mOrdinaryHouseRadioValue ? 0.01 : 0.02)
    }
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }


  ShanghaiCityClient.prototype.__proto__ = sCityClientBase.__proto__
}

export let sShanghaiCityClient = new ShanghaiCityClient()
