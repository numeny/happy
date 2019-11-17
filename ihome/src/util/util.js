import Taro from '@tarojs/taro';

import { CommercialLoanTotal, CommercialLoanMonthlyPayment, ProvidentFundLoanTotal, ProvidentFundLoanMonthlyPayment, OtherLoanTotal, OtherLoanMonthlyPayment, AllLoanTotal, AllLoanMonthlyPayment, RadioValueCommercialLoanPaymentMethod, RadioValueProvidentFundLoanPaymentMethod, RadioValueOtherLoanPaymentMethod, DurationCommercialLoan, DurationProvidentFundLoan, DurationOtherLoan, RateCommercialLoan, RateProvidentFundLoan, RateOtherLoan, RateInputManualCommercialLoan, RateInputManualProvidentFundLoan, RateInputManualOtherLoan, RateDiscountIdxCommercialLoan, RateDiscountIdxProvidentFundLoan, RateDiscountIdxOtherLoan } from '../redux/constants/loan'

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
    AllLoanMonthlyPayment: 35,
  },

  isInstanceOf: function(thisVar, varType) {
    return Object.prototype.toString.call(thisVar)
            === "[object " + varType + "]"
  },

  typeOf: function(thisVar) {
    return Object.prototype.toString.call(thisVar)
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

  // 默认为零
  getNumber2: function(v) {
    return Util.getNumber(v, 0)
  },

  getNumber: function(v, defValue) {
    return (v != null && Util.isNumber(v)) ? Number(v) : ((defValue != null) ? defValue : v)
  },



  isNonZeroNumber: function(v) {
    return v != undefined && v != null && v != 0
      && Util.isNumber(v)
  },

  getNumber3default0: function(v) {
    return Util.getNumber3(v, 0)
  },
  getNumber3: function(v, defValue) {
    return (v == undefined || v == 'undefined' || v == null || v == 'null' ) ? defValue : Number(v)
  },

  // <Input> 需要有placehold显示的输入框
  getNumber4: function(v) {
    return (v == undefined || v == 'undefined' || v == null || v == 'null') ? undefined : Number(v)
  },

  getString: function(v, defValue) {
    return (v != undefined && v != 'undefined' &&  v != null && v != 'null') ? String(v) : ((defValue != undefined) ? String(defValue) : '')
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

  getParamForGenerateReport: function(state, loan_data_array) {
    let param = 'currCity=' + state.mCurrCity
      + '&currProv=' + state.mCurrProvince
      + '&fp=' + state.mFirstPayment
      + '&tp=' + state.mTotalPayment
      + '&tf=' + state.mTotalFee
      + '&tt=' + state.mTotalTax
      + '&hn=' + state.mHouseName
      + '&ha=' + state.mHouseArea
      + '&tpr=' + state.mTotalPrice
      + '&opr=' + state.mOriginPrice
      + '&wspr=' + state.mWebSignPrice
      + '&ots=' + state.mOriginTaxSum
      + '&dt=' + state.mDeedTax
      + '&pit=' + state.mPersonalIncomeTax
      + '&vat=' + state.mValueAddedTax
      + '&ot=' + state.mOtherTax
      + '&af=' + state.mAgencyFee
      + '&lsf=' + state.mLoanServiceFee
      + '&ef=' + state.mEvaluationFee
      + '&mrf=' + state.mMortgageRegistrationFee
      + '&of=' + state.mOtherFee
      + '&fhrv=' + state.mFirstHouseRadioValue
      + '&atyrv=' + state.mAboveTwoYearsRadioValue
      + '&ohrv=' + state.mOnlyHouseRadioValue
      + '&orhrv=' + state.mOrdinaryHouseRadioValue
      + '&widtm=' + state.mWillInputDeedTaxManual
      + '&wipitm=' + state.mWillInputPersonalIncomeTaxManual
      + '&wivatm=' + state.mWillInputValueAddedTaxManual
      + '&editable=' + state.mEditable
      + '&clt=' + loan_data_array[CommercialLoanTotal]
      + '&clmp=' + loan_data_array[CommercialLoanMonthlyPayment]

      + '&pflt=' + loan_data_array[ProvidentFundLoanTotal]
      + '&pflmp=' + loan_data_array[ProvidentFundLoanMonthlyPayment]

      + '&olt=' + loan_data_array[OtherLoanTotal]
      + '&olmp=' + loan_data_array[OtherLoanMonthlyPayment]

      + '&alt=' + loan_data_array[AllLoanTotal]
      + '&amp=' + loan_data_array[AllLoanMonthlyPayment]

      + '&rvclpm=' + loan_data_array[RadioValueCommercialLoanPaymentMethod]
      + '&rvpflpm=' + loan_data_array[RadioValueProvidentFundLoanPaymentMethod]
      + '&rvolpm=' + loan_data_array[RadioValueOtherLoanPaymentMethod]

      + '&dcl=' + loan_data_array[DurationCommercialLoan]
      + '&dpf=' + loan_data_array[DurationProvidentFundLoan]
      + '&dol=' + loan_data_array[DurationOtherLoan]

      + '&rcl=' + loan_data_array[RateCommercialLoan]
      + '&rpf=' + loan_data_array[RateProvidentFundLoan]
      + '&rol=' + loan_data_array[RateOtherLoan]

      + '&rimcl=' + loan_data_array[RateInputManualCommercialLoan]
      + '&rimpfl=' + loan_data_array[RateInputManualProvidentFundLoan]
      + '&rimol=' + loan_data_array[RateInputManualOtherLoan]

      + '&rdicl=' + loan_data_array[RateDiscountIdxCommercialLoan]
      + '&rdipfl=' + loan_data_array[RateDiscountIdxProvidentFundLoan]
      + '&rdiol=' + loan_data_array[RateDiscountIdxOtherLoan]

    return param
  },
}
