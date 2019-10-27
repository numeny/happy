import Taro from '@tarojs/taro'
import { Util } from '@util/util'

import { sCityClientBase } from './city_client_base'

// https://tj.lianjia.com/wenda/xiangqing/247994.html
export function TianjinCityClient(state) {
  TianjinCityClient.prototype.getDeedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.DeedTax_ForTianjin;
  }

  TianjinCityClient.prototype.getDeedTaxRate = function() {
    // http://www.64365.com/special/tjstfqsxzc2017b/
    let deedTaxRate = 0
    if (this.mState.mFirstHouseRadioValue == 2) {
      deedTaxRate = 0.03
    } else {
      if (this.mState.mHouseArea <= 90) {
        // 一二套
        deedTaxRate = 0.01
      } else {
        // > 90
        if (this.mState.mFirstHouseRadioValue == 0) {
          deedTaxRate = 0.015
        } else {
          deedTaxRate = 0.02
        }
      }
    }
    console.log('TianjinCityClient.getDeedTaxRate, deedTaxRate: ' + deedTaxRate)
    return deedTaxRate
  }

  this.getWebSignPriceNoTaxRate = function() {
    return (this.mState.mAboveTwoYearsRadioValue == 0) ? 1.05 : 1
  }

  TianjinCityClient.prototype.getDeedTax = function() {
    console.log('TianjinCityClient.getDeedTax')
    const deedTaxRate = this.getDeedTaxRate()
    const webSignPriceNoTaxRate = this.getWebSignPriceNoTaxRate()
    let deedTax = this.mState.mWebSignPrice * deedTaxRate / webSignPriceNoTaxRate
    if (deedTax <= 0) {
      deedTax = 0
    }
    console.log('getDeedTax, deedTaxRate: ' + deedTaxRate
        + ", deedTax: " + deedTax)
    return deedTax
  }

  TianjinCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax_Tianjin;
  }

  TianjinCityClient.prototype.getPersonalIncomeTax = function() {
    console.log('TianjinCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0;
    }
    const webSignPriceNoTaxRate = this.getWebSignPriceNoTaxRate()
    let personalIncomeTax = this.mState.mWebSignPrice * 0.01 / webSignPriceNoTaxRate
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  TianjinCityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax_Tianjin;
  }

  TianjinCityClient.prototype.getValueAddedTax = function() {
    console.log('TianjinCityClient.getValueAddedTax')
    const webSignPriceNoTaxRate = this.getWebSignPriceNoTaxRate()
    const valueAddedTaxRate = 0.05 / webSignPriceNoTaxRate
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

  TianjinCityClient.prototype.__proto__ = sCityClientBase.__proto__
}


export let sTianjinCityClient = new TianjinCityClient()
