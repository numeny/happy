import Taro from '@tarojs/taro'
import { Util } from '@util/util'
import { Log } from '@util/log'

import { sNonFirstTierCityClient } from './non_first_tier_city_client'

// http://suzhou.bendibao.com/live/201774/64211.shtm
export function SuzhouCityClient(state) {

  SuzhouCityClient.prototype.getDeedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.DeedTax_Suzhou;
  }

  SuzhouCityClient.prototype.getDeedTaxRate = function() {
    Log.log('SuzhouCityClient.getDeedTaxRate')
    let deedTaxRate = 0
    if (this.mState.mFirstHouseRadioValue == 0) {
      deedTaxRate = (this.mState.mHouseArea <= 90) ? 0.01 : 0.015
    } else {
      deedTaxRate = 0.03
    }
    Log.log('getDeedTaxRate, deedTaxRate: ' + deedTaxRate
      + ', mFirstHouseRadioValue: ' + this.mState.mFirstHouseRadioValue
      + ', this.mState: ' + this.mState)
    return deedTaxRate
  }

  SuzhouCityClient.prototype.getDeedTax = function() {
    Log.log('SuzhouCityClient.getDeedTax')
    let deedTaxRate = this.getDeedTaxRate()
    // 过户价(网签价) / 税率
    let deedTax = this.mState.mWebSignPrice * deedTaxRate
    if (deedTax <= 0) {
      deedTax = 0
    }
    Log.log('getDeedTax, deedTaxRate: ' + deedTaxRate
        + ", deedTax: " + deedTax)
    return deedTax
  }

  SuzhouCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax_Suzhou;
  }

  SuzhouCityClient.prototype.getPersonalIncomeTax = function() {
    Log.log('SuzhouCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0;
    }
    let personalIncomeTax = 0;
    if (this.mState.mOriginPrice != 0) {
      personalIncomeTax = (this.mState.mWebSignPrice - this.mState.mValueAddedTax - this.mState.mOriginPrice - this.mState.mOriginTaxSum) * 0.2
    } else {
      let rate = 0
      if (this.mState.mOrdinaryHouseRadioValue) {
        rate = 0.01
      } else {
        rate = 0.02
      }
      let taxBase = this.mState.mAboveTwoYearsRadioValue == 0 ? (this.mState.mWebSignPrice - this.mState.mValueAddedTax) : this.mState.mWebSignPrice
      personalIncomeTax = taxBase * rate
    }
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  SuzhouCityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax_Suzhou;
  }

  SuzhouCityClient.prototype.getValueAddedTax = function() {
    Log.log('SuzhouCityClient.getValueAddedTax')
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
    Log.log('getValueAddedTax, valueAddedTaxRate: ' + valueAddedTaxRate
        + ', valueAddedTax: ' + valueAddedTax)
    return valueAddedTax
  }


  SuzhouCityClient.prototype.__proto__ = sNonFirstTierCityClient.__proto__
}

export let sSuzhouCityClient = new SuzhouCityClient()
