// import { SetLoanData, SetCommercialLoanTotal, SetCommercialLoanMonthlyPayment, SetProvidentFundLoanTotal, SetProvidentFundLoanMonthlyPayment, SetOtherLoanTotal, SetOtherLoanMonthlyPayment, SetAllLoanTotal, SetAllLoanMonthlyPayment } from '../constants/loan'
// import { SetLoanData } from '../constants/loan'

import { RepaymentType } from '../util/util'

const INITIAL_STATE = {
  // refer to constants/loan.js : LoanDataType
  mLoanData: [0, 0, 0, 0, 0, // 0-4
              0, 0, 0, 0, 0, // 5-9
              0, 0, 0, 0, 0, // 10-14
              0, 0, false, false, false, // 15-19
              0, 0, 0, // 20-24
             ],

  mCommercialLoanTotal: 0,
  mCommercialLoanMonthlyPayment: 0,

  mProvidentFundLoanTotal: 0,
  mProvidentFundLoanMonthlyPayment: 0,

  mOtherLoanTotal: 0,
  mOtherLoanMonthlyPayment: 0,

  mAllLoanTotal: 0,
  mAllLoanMonthlyPayment: 0,
}

function getNewLoanData (state, action) {
  state.mLoanData[action.mField] = action.mValue
  return {
    ...state,
  }
}

export default function loan (state = INITIAL_STATE, action) {

  return getNewLoanData(state, action)
  /*
  switch (action.type) {
    case SetLoanData:
      return getNewLoanData(state, action)

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
  */
}
