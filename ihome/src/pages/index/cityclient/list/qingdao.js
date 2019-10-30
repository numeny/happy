import Taro from '@tarojs/taro'
import { Util } from '@util/util'
import { Log } from '@util/log'

import { sNonFirstTierCityClient } from './non_first_tier_city_client'

// https://qd.lianjia.com/wenda/xiangqing/241770.html
export function QingdaoCityClient(state) {

  QingdaoCityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax_Qingdao;
  }

  QingdaoCityClient.prototype.getPersonalIncomeTax = function() {
    Log.log('QingdaoCityClient.getPersonalIncomeTax')
    if (this.mState.mAboveTwoYearsRadioValue == 2 && this.mState.mOnlyHouseRadioValue) {
      return 0
    }
    let personalIncomeTax = this.mState.mWebSignPrice * 0.02
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  QingdaoCityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax_Qingdao;
  }

  QingdaoCityClient.prototype.getValueAddedTax = function() {
    Log.log('QingdaoCityClient.getValueAddedTax')
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

  QingdaoCityClient.prototype.__proto__ = sNonFirstTierCityClient.__proto__
}


export let sQingdaoCityClient = new QingdaoCityClient()
