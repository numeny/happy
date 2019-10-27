import Taro from '@tarojs/taro'
import { Util } from '@util/util'

import { sCityClientBase } from '../city_client_base'

export function ChongqingCityClient(state) {

  ChongqingCityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax;
  }

  ChongqingCityClient.prototype.getValueAddedTax = function() {
    console.log('ChongqingCityClient.getValueAddedTax')
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

  ChongqingCityClient.prototype.__proto__ = sCityClientBase.__proto__
}


export let sChongqingCityClient = new ChongqingCityClient()
