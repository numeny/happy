import Taro from '@tarojs/taro';

export const LoanType = {
  CommercialLoan: 0,
  ProvidentFundLoan: 1,
  OtherLoan: 2,
}

export const Util = {

  appTitle: '茜茜猫首付计算神器',

  mTipBoxMessages : {
    DeedTax: 1,
    PersonalIncomeTax: 2,
    ValueAddedTax: 3,
    FirstPayment: 4,
    TotalPayment: 5,
    TotalFee: 6,
    TotalTax: 7,
    TotalLoan: 8,
    TotalTaxAndFee: 9,
    AverageUnitPrice: 10,
    OriginTaxSum: 11,
    ValueAddedTax_Shenzhen: 12,
    DeedTax_NonFirstTierCityClient: 13,
    ValueAddedTax_NonFirstTierCityClient: 14,
    DeedTax_ForTianjin: 15,
    PersonalIncomeTax_Chengdu: 16,
    PersonalIncomeTax_Beijing: 17,
    PersonalIncomeTax_Shanghai: 18,
    PersonalIncomeTax_Shenzhen: 19,
    DeedTax_Guangzhou: 20,
    PersonalIncomeTax_Guangzhou: 21,
    ValueAddedTax_Guangzhou: 22,
    ValueAddedTax_Tianjin: 23,
    PersonalIncomeTax_Tianjin: 24,
    DeedTax_Wuhan: 25,
    PersonalIncomeTax_Wuhan: 26,
    ValueAddedTax_Wuhan: 27,
    PersonalIncomeTax_Qingdao: 28,
    ValueAddedTax_Qingdao: 29,
    DeedTax_Suzhou: 30,
    PersonalIncomeTax_Suzhou: 31,
    ValueAddedTax_Suzhou: 32,
    DeedTax_Chengdu: 33,
    ValueAddedTax_Chengdu: 34,
  },

  isInstanceOf: function(thisVar, varType) {
    return Object.prototype.toString.call(thisVar)
            === "[object " + varType + "]"
  },

  isString: function(thisVar) {
    return Util.isInstanceOf(thisVar, 'String')
  },

  isNumber: function(thisVar) {
    return typeof thisVar === 'number' && !isNaN(thisVar);
  },

  isArray: function(thisVar) {
    return Util.isInstanceOf(thisVar, 'Array')
  },

  setInterval: function(callback) {
    const timeId = setInterval(() => {
        callback()
        clearInterval(timeId)
    }, 0);
  },

  setInterval2: function(callback, time) {
    const timeId = setInterval(() => {
        callback()
        clearInterval(timeId)
    }, time);
  },

  isH5: function() {
    return process.env.TARO_ENV == 'h5'
    // return true
  },
  isWeapp: function() {
    // return true
    return process.env.TARO_ENV == 'weapp'
  },
  isAlipay: function() {
    // return true
    return process.env.TARO_ENV == 'alipay'
  },
  getTaroEnv: function() {
    return process.env.TARO_ENV
    // return 'weapp'
  },

  getNumber: function(v, defValue) {
    return v != null ? Number(v) : ((defValue != null) ? defValue : 0)
  },

  getString: function(v, defValue) {
    return v != null ? String(v) : ((defValue != null) ? String(defValue) : '')
  },

  getBoolean: function(v, defValue) {
    if (Util.isString(v))
      return (v === 'true')
    if (defValue != null && v == undefined)
      return Boolean(defValue)
    else
      return Boolean(v)
  },
  printObj: function(obj) {
    var str="";
    for (var item in obj){
      str += item + ":" +obj[item] + "\n";
    }
    console.log(str);
  },

  getParamForGenerateReport: function(state) {
    let param = 'currCity=' + state.mCurrCity
      + '&currProv=' + state.mCurrProvince
      + '&fp=' + state.mFirstPayment
      + '&tp=' + state.mTotalPayment
      + '&tl=' + state.mTotalLoan
      + '&tf=' + state.mTotalFee
      + '&tt=' + state.mTotalTax
      + '&hn=' + state.mHouseName
      + '&ha=' + state.mHouseArea
      + '&tpr=' + state.mTotalPrice
      + '&opr=' + state.mOriginPrice
      + '&wspr=' + state.mWebSignPrice
      + '&lgpr=' + state.mLowestGuidePrice
      + '&dt=' + state.mDeedTax
      + '&pit=' + state.mPersonalIncomeTax
      + '&vat=' + state.mValueAddedTax
      + '&ot=' + state.mOtherTax
      + '&af=' + state.mAgencyFee
      + '&lsf=' + state.mLoanServiceFee
      + '&ef=' + state.mEvaluationFee
      + '&mrf=' + state.mMortgageRegistrationFee
      + '&of=' + state.mOtherFee
      + '&cl=' + state.mCommercialLoan
      + '&pfl=' + state.mProvidentFundLoan
      + '&ol=' + state.mOtherLoan
      + '&fhrv=' + state.mFirstHouseRadioValue
      + '&atyrv=' + state.mAboveTwoYearsRadioValue
      + '&onhrv=' + state.mOnlyHouseRadioValue
      + '&orhrv=' + state.mOrdinaryHouseRadioValue
      + '&widtm=' + state.mWillInputDeedTaxManual
      + '&wipitm=' + state.mWillInputPersonalIncomeTaxManual
      + '&wivatm=' + state.mEditable
      + '&editable=' + state.mWillInputValueAddedTaxManual
    return param
  },
}
