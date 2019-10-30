import Taro from '@tarojs/taro'
import { Util } from '@util/util'
import { Log } from '@util/log'

import { sNonFirstTierCityClient } from './non_first_tier_city_client'

// https://news.lianjia.com/wh/baike/08648.html
export function WuhanCityClient(state) {

  WuhanCityClient.prototype.getDeedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.DeedTax_Wuhan
  }

  WuhanCityClient.prototype.getDeedTax = function() {
    Log.log('WuhanCityClient.getDeedTax')
    let deedTaxRate = this.getDeedTaxRate()
    // (过户价(网签价) -增值税) / 税率
    let deedTax = (this.mState.mWebSignPrice - this.mState.mValueAddedTax) * deedTaxRate
    if (deedTax <= 0) {
      deedTax = 0
    }
    Log.log('getDeedTax, deedTaxRate: ' + deedTaxRate
        + ", deedTax: " + deedTax)
    return deedTax
  }

  WuhanCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax_Wuhan;
  }

  WuhanCityClient.prototype.getPersonalIncomeTax = function() {
    Log.log('WuhanCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0
    }
    let personalIncomeTax = (this.mState.mWebSignPrice - this.mState.mValueAddedTax) * 0.01
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  WuhanCityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax_Wuhan;
  }

  WuhanCityClient.prototype.getValueAddedTax = function() {
    Log.log('WuhanCityClient.getValueAddedTax')
    if (this.mState.mAboveTwoYearsRadioValue != 0) {
      // 所有的普通住宅和非普通住宅，只要满两年, 免征
      return 0
    }

    const valueAddedTaxRate = 0.056 / 1.05
    let valueAddedTax = this.mState.mWebSignPrice * valueAddedTaxRate
    if (valueAddedTax <= 0) {
      valueAddedTax = 0
    }
    Log.log('getValueAddedTax, valueAddedTaxRate: ' + valueAddedTaxRate
        + ', valueAddedTax: ' + valueAddedTax)
    return valueAddedTax
  }

  WuhanCityClient.prototype.__proto__ = sNonFirstTierCityClient.__proto__
}

export let sWuhanCityClient = new WuhanCityClient()
