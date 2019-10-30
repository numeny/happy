import Taro from '@tarojs/taro'
import { Util } from '@util/util'
import { Log } from '@util/log'

import { sCityClientBase } from './city_client_base'

export function NonFirstTierCityClient(state) {
  NonFirstTierCityClient.prototype.getDeedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.DeedTax_NonFirstTierCityClient
  }

  NonFirstTierCityClient.prototype.getDeedTaxRate = function() {
    let deedTaxRate = 0
    if (this.mState.mFirstHouseRadioValue == 2) {
      deedTaxRate = 0.03
    } else if (this.mState.mHouseArea <= 90) {
      deedTaxRate = 0.01
    } else { // >= 90m2
      if (this.mState.mFirstHouseRadioValue == 0) {
        // first house
        deedTaxRate = 0.015
      } else if (this.mState.mFirstHouseRadioValue == 1) {
        // second house
        deedTaxRate = 0.02
      }
    }
    // FIXME
    // chengdu/nanjing / 1.05
    // https://news.lianjia.com/cd/baike/012148.html
    // https://nj.lianjia.com/wenda/xiangqing/264651.html
    // deedTaxRate = deedTaxRate / 1.05
    Log.log('NonFirstTierCityClient.getDeedTaxRate, deedTaxRate: ' + deedTaxRate)
    return deedTaxRate
  }

  NonFirstTierCityClient.prototype.getDeedTax = function() {
    Log.log('NonFirstTierCityClient.getDeedTax')
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

  // 对于非一线城市，个人购买不足2年的住房对外销售，按照5%的征收率全额缴纳增值税;个人将购买2年以上(含2年)的住房对外销售的，免征增值税。
  NonFirstTierCityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax_NonFirstTierCityClient;
  }

  NonFirstTierCityClient.prototype.getValueAddedTax = function() {
    Log.log('NonFirstTierCityClient.getValueAddedTax')
    if (this.mState.mAboveTwoYearsRadioValue != 0) {
      // 所有的普通住宅和非普通住宅，只要满两年
      return 0
    }

    const valueAddedTaxRate = 0.056
    let valueAddedTax = this.mState.mWebSignPrice * valueAddedTaxRate
    if (valueAddedTax <= 0) {
      valueAddedTax = 0
    }
    Log.log('getValueAddedTax, valueAddedTaxRate: ' + valueAddedTaxRate
        + ', valueAddedTax: ' + valueAddedTax)
    return valueAddedTax
  }

  NonFirstTierCityClient.prototype.__proto__ = sCityClientBase.__proto__
}


export let sNonFirstTierCityClient = new NonFirstTierCityClient()
