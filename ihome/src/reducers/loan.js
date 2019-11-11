import { SetCommercialLoanTotal, SetCommercialLoanMonthlyPayment, SetProvidentFundLoanTotal, SetProvidentFundLoanMonthlyPayment, SetOtherLoanTotal, SetOtherLoanMonthlyPayment, SetAllLoanTotal, SetAllLoanMonthlyPayment } from '../constants/loan'

const INITIAL_STATE = {
  mCommercialLoanTotal: 0,
  mCommercialLoanMonthlyPayment: 0,

  mProvidentFundLoanTotal: 0,
  mProvidentFundLoanMonthlyPayment: 0,

  mOtherLoanTotal: 0,
  mOtherLoanMonthlyPayment: 0,

  mAllLoanTotal: 0,
  mAllLoanMonthlyPayment: 0,
}

export default function loan (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SetCommercialLoanTotal:
      return {
        ...state,
        mCommercialLoanTotal: action.mCommercialLoanTotal,
      }
    case SetCommercialLoanMonthlyPayment:
      return {
        ...state,
        mCommercialLoanMonthlyPayment: action.mCommercialLoanMonthlyPayment
      }
    case SetProvidentFundLoanTotal:
      return {
        ...state,
        mProvidentFundLoanTotal: action.mProvidentFundLoanTotal
      }
    case SetProvidentFundLoanMonthlyPayment:
      return {
        ...state,
        mProvidentFundLoanMonthlyPayment: action.mProvidentFundLoanMonthlyPayment
      }
    case SetOtherLoanTotal:
      return {
        ...state,
        mOtherLoanTotal: action.mOtherLoanTotal
      }
    case SetOtherLoanMonthlyPayment:
      return {
        ...state,
        mOtherLoanMonthlyPayment: action.mOtherLoanMonthlyPayment }
    case SetAllLoanTotal:
      return {
        ...state,
        mAllLoanTotal: action.mAllLoanTotal
      }
    case SetAllLoanMonthlyPayment:
      return {
        ...state,
        mAllLoanMonthlyPayment: action.mAllLoanMonthlyPayment
      }
    default:
      return state
  }
}
