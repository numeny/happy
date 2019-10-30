import Taro from '@tarojs/taro'
import { Util } from '@util/util'
import { Log } from '@util/log'

import { sNonFirstTierCityClient } from './non_first_tier_city_client'

// https://cd.lianjia.com/wenda/xiangqing/53189.html
// https://news.lianjia.com/cd/baike/0260523.html
export function ChengduCityClient(state) {

  ChengduCityClient.prototype.getDeedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.DeedTax_Chengdu
  }

  ChengduCityClient.prototype.getDeedTax = function() {
    Log.log('ChengduCityClient.getDeedTax')
    let deedTaxRate = this.getDeedTaxRate() / 1.05
    // 过户价(网签价) / 税率
    let deedTax = this.mState.mWebSignPrice * deedTaxRate
    if (deedTax <= 0) {
      deedTax = 0
    }
    Log.log('getDeedTax, deedTaxRate: ' + deedTaxRate
        + ", deedTax: " + deedTax)
    return deedTax
  }

  ChengduCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax_Chengdu;
  }

  ChengduCityClient.prototype.getPersonalIncomeTax = function() {
    Log.log('ChengduCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0;
    }
    let personalIncomeTax = this.mState.mWebSignPrice * 0.01 / 1.05
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  ChengduCityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax_Chengdu;
  }

  ChengduCityClient.prototype.getValueAddedTax = function() {
    Log.log('ChengduCityClient.getValueAddedTax')
    if (this.mState.mAboveTwoYearsRadioValue != 0) {
      // 所有的普通住宅和非普通住宅，只要满两年
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

  ChengduCityClient.prototype.__proto__ = sNonFirstTierCityClient.__proto__
}

export let sChengduCityClient = new ChengduCityClient()
