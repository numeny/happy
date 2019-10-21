import Taro from '@tarojs/taro';

export const Util = {

  appTitle: '茜茜猫首付计算器',

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

  getParamForGenerateReport: function(state) {
    let param = 'fp=' + state.mFirstPayment
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
