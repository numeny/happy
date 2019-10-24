import Taro from '@tarojs/taro'

function CityCalcClient(state) {

  CityCalcClient.prototype.mState = state

  CityCalcClient.prototype.setClientState = function(state) {
    this.mState = state
  }

  CityCalcClient.prototype.getDeedTaxRate = function() {
    return 0;
  }

  CityCalcClient.prototype.getDeedTax = function() {
    return 0;
  }

  CityCalcClient.prototype.getPersonalIncomeTax = function() {
    return 0;
  }

  CityCalcClient.prototype.getValueAddedTax = function() {
    return 0;
  }

}

function FirstTierCityCalcClient(state) {
  /*
  this.mState = state
  this.setClientState = function(state) {
    this.mState = state
  }

  CityCalcClient.prototype.setClientState = function(state) {
    this.mState = state
  }
  */

  // 北上广深圳: 普通住宅并且家庭首套住房90平米以下1%, 90平米以上1.5%, 140平米以上3%,
  //             非普通住宅以及二套房不管大小一律3%
  // FIXME 其他城市，家庭首套住房90平米以下1%, 90平米以上2%, 二套房不管大小一律3%
  FirstTierCityCalcClient.prototype.getDeedTaxRate = function() {
    console.log('FirstTierCityCalcClient.getDeedTaxRate')
    let deedTaxRate = 0
    if (this.mState.mOrdinaryHouseRadioValue
        && this.mState.mFirstHouseRadioValue == 0) {
      deedTaxRate = (this.mState.mHouseArea <= 90) ? 0.01 : 0.015
    } else {
      deedTaxRate = 0.03
    }
    console.log('getDeedTaxRate, deedTaxRate: ' + deedTaxRate
      + ', mFirstHouseRadioValue: ' + this.mState.mFirstHouseRadioValue
      + ', this.mState: ' + this.mState)
    return deedTaxRate
  }

  FirstTierCityCalcClient.prototype.getDeedTax = function() {
    console.log('FirstTierCityCalcClient.getDeedTax')
    let deedTaxRate = this.getDeedTaxRate()
    // (过户价(网签价) - 增值税) / 税率
    let deedTax = (this.mState.mWebSignPrice - this.getValueAddedTax()) * deedTaxRate
    if (deedTax <= 0) {
      deedTax = 0
    }
      console.log('getDeedTax, deedTaxRate: ' + deedTaxRate
        + ", deedTax: " + deedTax)
    return deedTax
  }

  FirstTierCityCalcClient.prototype.getPersonalIncomeTax = function() {
    console.log('FirstTierCityCalcClient.getPersonalIncomeTax')
    let personalIncomeTax = 0
    if (this.mState.mAboveTwoYearsRadioValue != 2 || !this.mState.mOnlyHouseRadioValue) {
      personalIncomeTax = (this.mState.mWebSignPrice * 0.9 - this.mState.mOriginPrice - this.mState.mOriginTaxSum) * 0.2
    }
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  // 对于非一线城市，个人购买不足2年的住房对外销售，按照5%的征收率全额缴纳增值税;个人将购买2年以上(含2年)的住房对外销售的，免征增值税。
  // 北、上、广、深四个一线城市，个人购买不足2年的住房对外销售的，按照5%的征收率全额缴纳增值税;个人将购买2年以上(含2年)的非普通住房对外销售的，以销售收入减去购买住房价款后的差额按照5%的征收率缴纳增值税;个人将购买2年以上(含2年)的普通住房对外销售的，免征增值税。
  FirstTierCityCalcClient.prototype.getValueAddedTax = function() {
    console.log('FirstTierCityCalcClient.getValueAddedTax')
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
}

FirstTierCityCalcClient.prototype = new CityCalcClient()

function ShenzhenCalcClient(state) {

  ShenzhenCalcClient.prototype.getPersonalIncomeTax = function() {
    console.log('ShenzhenCalcClient.getPersonalIncomeTax')
    let personalIncomeTax = 0
    if (this.mState.mAboveTwoYearsRadioValue != 2 || !this.mState.mOnlyHouseRadioValue) {
      personalIncomeTax = (this.mState.mWebSignPrice * 0.9 - this.mState.mOriginPrice - this.mState.mOriginTaxSum) * 0.2
    }
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return 888
    // return personalIncomeTax
  }
}

ShenzhenCalcClient.prototype = new FirstTierCityCalcClient()

// let sCityClient = new ShenzhenCalcClient()

let sCityClient = null

export var sCalcClient =  {

  setCityClient : (currCity) => {
    if (currCity == 'shenzhen') {
      sCityClient = new ShenzhenCalcClient()
    } else if (currCity == 'beijing') {
      sCityClient = new FirstTierCityCalcClient()
    } else {
      sCityClient = new FirstTierCityCalcClient()
    }
    sCityClient.setClientState(sCityClient.mState)
  },

  setClientState : (state) => {
    sCalcClient.initCalcClientIfNeccesary()
    console.log('setClientState!')
    return sCityClient.setClientState(state)
  },

  getDeedTaxRate : () => {
    sCalcClient.initCalcClientIfNeccesary()
    return sCityClient.getDeedTaxRate()
  },

  getDeedTax : () => {
    sCalcClient.initCalcClientIfNeccesary()
    return sCityClient.getDeedTax()
  },

  getPersonalIncomeTax : () => {
    sCalcClient.initCalcClientIfNeccesary()
    return sCityClient.getPersonalIncomeTax()
  },

  getValueAddedTaxRate : () => {
    sCalcClient.initCalcClientIfNeccesary()
    return sCityClient.getValueAddedTaxRate()
  },

  getValueAddedTax : () => {
    sCalcClient.initCalcClientIfNeccesary()
    return sCityClient.getValueAddedTax()
  },

  initCalcClientIfNeccesary : () => {
    if (sCityClient != null) {
      return;
    }
    console.log('initCalcClientIfNeccesary, create new city client!')
    sCityClient = new FirstTierCityCalcClient()
  }
}
