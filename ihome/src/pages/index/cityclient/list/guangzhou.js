import Taro from '@tarojs/taro'
import { Util } from '@util/util'
import { Log } from '@util/log'

import { sCityClientBase } from './city_client_base'

// https://news.lianjia.com/gz/baike/0632201.html
export function GuangzhouCityClient(state) {
  GuangzhouCityClient.prototype.getDeedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.DeedTax_Guangzhou;
  }

  GuangzhouCityClient.prototype.getDeedTaxRate = function() {
    Log.log('GuangzhouCityClient.getDeedTaxRate')
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

  GuangzhouCityClient.prototype.getDeedTax = function() {
    Log.log('GuangzhouCityClient.getDeedTax')
    let deedTaxRate = this.getDeedTaxRate()
    let deedTax = 0
    if (this.mState.mOrdinaryHouseRadioValue) {
      deedTax = this.mState.mWebSignPrice * deedTaxRate
    } else {
      let rateNoTax = (this.mState.mAboveTwoYearsRadioValue == 0) ? 1.05 : 1
      deedTax = (this.mState.mWebSignPrice / rateNoTax - this.mState.mValueAddedTax) * deedTaxRate
    }
    (this.mState.mWebSignPrice - this.mState.mValueAddedTax) * deedTaxRate
    if (deedTax <= 0) {
      deedTax = 0
    }
    Log.log('getDeedTax, deedTaxRate: ' + deedTaxRate
        + ", deedTax: " + deedTax)
    return deedTax
  }

  GuangzhouCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax_Guangzhou;
  }

  GuangzhouCityClient.prototype.getPersonalIncomeTax = function() {
    Log.log('GuangzhouCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0;
    }
    let personalIncomeTax = 0;
    if (this.mState.mAboveTwoYearsRadioValue == 2
        /* && !this.mState.mOnlyHouseRadioValue*/) {
      // 满五不唯一
      personalIncomeTax = this.mState.mWebSignPrice * 0.01
    } else {
      let webSignPriceHandled = 0
      if (this.mState.mAboveTwoYearsRadioValue == 1
          && this.mState.mOrdinaryHouseRadioValue) {
        // 普通住宅 并且 满两年
        webSignPriceHandled = this.mState.mWebSignPrice / 1.05
      } else {
        webSignPriceHandled = this.mState.mWebSignPrice
      }
      if (this.mState.mOriginPrice != 0) {
        personalIncomeTax = (webSignPriceHandled - this.mState.mOriginPrice - this.mState.mOriginTaxSum) * 0.2
      } else {
        personalIncomeTax = webSignPriceHandled * 0.01
      }
    }

    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  GuangzhouCityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax_Guangzhou;
  }

  GuangzhouCityClient.prototype.getValueAddedTax = function() {
    Log.log('GuangzhouCityClient.getValueAddedTax')
    // http://www.sohu.com/a/300409590_804952
    // rate : 5.6% -> 5.3%
    const valueAddedTaxRate = 0.053 / 1.05
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

  GuangzhouCityClient.prototype.__proto__ = sCityClientBase.__proto__
}

export let sGuangzhouCityClient = new GuangzhouCityClient()
