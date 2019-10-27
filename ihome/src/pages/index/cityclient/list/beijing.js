import Taro from '@tarojs/taro'
import { Util } from '@util/util'

import { sCityClientBase } from './city_client_base'

// https://m.lianjia.com/bj/wenda/xiangqing/297493.html?utm_source=office
export function BeijingCityClient(state) {
  BeijingCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    console.log('BeijingCityClient.getPersonalIncomeTaxHelpIndex: '
        + Util.mTipBoxMessages.PersonalIncomeTax_Beijing)
    return Util.mTipBoxMessages.PersonalIncomeTax_Beijing;
  }

  BeijingCityClient.prototype.getPersonalIncomeTax = function() {
    console.log('BeijingCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0;
    }
    let personalIncomeTax = 0;
    if (this.mState.mOriginPrice != 0) {
      personalIncomeTax = (this.mState.mWebSignPrice - this.mState.mWebSignPrice * 0.1- this.mState.mValueAddedTax - this.mState.mOriginPrice - this.mState.mOriginTaxSum) * 0.2
    } else {
      personalIncomeTax = (this.mState.mWebSignPrice - this.mState.mValueAddedTax) * 0.01
    }
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }


  BeijingCityClient.prototype.__proto__ = sCityClientBase.__proto__
}

export let sBeijingCityClient = new BeijingCityClient()
