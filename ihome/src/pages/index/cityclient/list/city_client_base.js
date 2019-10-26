import Taro from '@tarojs/taro'
import { Util } from '@util/util'

import { sCityClient } from '../city_client'

export function CityClientBase(state) {
  CityClientBase.prototype.getDeedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.DeedTax;
  }

  CityClientBase.prototype.getDeedTaxRate = function() {
    console.log('CityClientBase.getDeedTaxRate')
    let deedTaxRate = 0
    if (this.mState.mFirstHouseRadioValue == 0) {
      deedTaxRate = (this.mState.mHouseArea <= 90) ? 0.01 : 0.015
    } else {
      deedTaxRate = 0.03
    }
    console.log('getDeedTaxRate, deedTaxRate: ' + deedTaxRate
      + ', mFirstHouseRadioValue: ' + this.mState.mFirstHouseRadioValue
      + ', this.mState: ' + this.mState)
    return deedTaxRate
  }

  CityClientBase.prototype.getDeedTax = function() {
    console.log('CityClientBase.getDeedTax')
    let deedTaxRate = this.getDeedTaxRate()
    let deedTax = (this.mState.mWebSignPrice - this.getValueAddedTax()) * deedTaxRate
    if (deedTax <= 0) {
      deedTax = 0
    }
    console.log('getDeedTax, deedTaxRate: ' + deedTaxRate
        + ", deedTax: " + deedTax)
    return deedTax
  }

  CityClientBase.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax;
  }

  CityClientBase.prototype.getPersonalIncomeTax = function() {
    console.log('CityClientBase.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0;
    }
    let personalIncomeTax = 0;
    if (this.mState.mOriginPrice != 0) {
      personalIncomeTax = (this.mState.mWebSignPrice - this.getValueAddedTax() - this.mState.mOriginPrice - this.mState.mOriginTaxSum) * 0.2
    } else {
      personalIncomeTax = (this.mState.mWebSignPrice - this.getValueAddedTax()) * 0.01
    }
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  CityClientBase.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax;
  }

  CityClientBase.prototype.getValueAddedTax = function() {
    console.log('CityClientBase.getValueAddedTax')
    const valueAddedTaxRate = 0.056 / 1.05
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

  CityClientBase.prototype.__proto__ = sCityClient.__proto__
}


export let sCityClientBase = new CityClientBase()