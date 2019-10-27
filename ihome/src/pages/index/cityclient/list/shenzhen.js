import Taro from '@tarojs/taro'
import { Util } from '@util/util'

import { sCityClientBase } from './city_client_base'

function ShenzhenCityClient(state) {

  ShenzhenCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax_Shenzhen;
  }

  ShenzhenCityClient.prototype.getPersonalIncomeTax = function() {
    console.log('ShenzhenCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0;
    }
    let personalIncomeTax1 = (this.mState.mWebSignPrice - this.mState.mValueAddedTax - this.mState.mOriginPrice) * 0.2
    let personalIncomeTax2 = (this.mState.mWebSignPrice
          - this.mState.mValueAddedTax) *
          (this.mState.mOrdinaryHouseRadioValue ? 0.01 : 0.015)
    let personalIncomeTax =
        Math.min(personalIncomeTax1, personalIncomeTax2)
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  ShenzhenCityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax_Shenzhen;
  }

  ShenzhenCityClient.prototype.getValueAddedTax = function() {
    console.log('ShenzhenCityClient.getValueAddedTax')
    // tax rate do not equal base's
    const valueAddedTaxRate = 0.05 / 1.05
    let valueAddedTax = 0

    if (this.mState.mAboveTwoYearsRadioValue == 0) { // 所有的普通住宅和非普通住宅，只要不满两年
      valueAddedTax = this.mState.mWebSignPrice * valueAddedTaxRate
    } else if (!this.mState.mOrdinaryHouseRadioValue) {
      valueAddedTax = (this.mState.mWebSignPrice - this.mState.mOriginPrice) * valueAddedTaxRate
    }
    if (valueAddedTax <= 0) {
      valueAddedTax = 0
    }
    /*
    if (DEBUG)
      console.log('getValueAddedTax, valueAddedTaxRate: ' + valueAddedTaxRate
        + ', valueAddedTax: ' + valueAddedTax)
    */
    return valueAddedTax
  }
  ShenzhenCityClient.prototype.__proto__ = sCityClientBase.__proto__
}

export let sShenzhenCityClient = new ShenzhenCityClient()
