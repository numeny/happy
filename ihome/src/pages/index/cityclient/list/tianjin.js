import Taro from '@tarojs/taro'
import { Util } from '@util/util'

import { sCityClientBase } from './city_client_base'

export function TianjinCityClient(state) {
  TianjinCityClient.prototype.getDeedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.DeedTax_ForTianjin;
  }

  TianjinCityClient.prototype.getDeedTaxRate = function() {
    let deedTaxRate = 0
    if (this.mState.mHouseArea <= 90) {
      deedTaxRate = 0.01
    } else { // >= 90
      if (this.mState.mFirstHouseRadioValue == 0) {
        deedTaxRate = 0.015
      } else {
        deedTaxRate = 0.02
      }
    }
    console.log('TianjinCityClient.getDeedTaxRate, deedTaxRate: ' + deedTaxRate
      + ', mFirstHouseRadioValue: ' + this.mState.mFirstHouseRadioValue
      + ', this.mState: ' + this.mState)
    return deedTaxRate
  }

  TianjinCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax;
  }

  TianjinCityClient.prototype.getPersonalIncomeTax = function() {
    console.log('TianjinCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0;
    }
    let personalIncomeTax = 0;
    if (this.mState.mOriginPrice != 0) {
      personalIncomeTax = (this.mState.mWebSignPrice * 0.9 - this.mState.mOriginPrice - this.mState.mOriginTaxSum) * 0.2
    } else {
      personalIncomeTax = this.mState.mWebSignPrice * 0.01
    }
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  // 对于非一线城市，个人购买不足2年的住房对外销售，按照5%的征收率全额缴纳增值税;个人将购买2年以上(含2年)的住房对外销售的，免征增值税。
  // 北、上、广、深四个一线城市，个人购买不足2年的住房对外销售的，按照5%的征收率全额缴纳增值税;个人将购买2年以上(含2年)的非普通住房对外销售的，以销售收入减去购买住房价款后的差额按照5%的征收率缴纳增值税;个人将购买2年以上(含2年)的普通住房对外销售的，免征增值税。
  TianjinCityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax;
  }

  TianjinCityClient.prototype.getValueAddedTax = function() {
    console.log('TianjinCityClient.getValueAddedTax')
    const valueAddedTaxRate = 0.05 * 1.13 / 1.05
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
