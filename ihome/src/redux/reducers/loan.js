import { DefaultValue, DefaultRateDiscountIdx } from '../../constants/loan'

import { SetLoanData } from '../constants/loan'
import { RepaymentType } from '../../constants/loan.js'

const INITIAL_STATE = {
  // refer to constants/loan.js : LoanDataType
  mLoanData: [0, 0, 0, 0, 0, // 0-4
              0, 0, 0, RepaymentType.CapitalAndInterest, RepaymentType.CapitalAndInterest, // 5-9
              RepaymentType.CapitalAndInterest, 25, 25, 25, DefaultValue.BaseInterestRateCommercialLoan, // 10-14
              DefaultValue.BaseInterestRateProvidentFundLoan, DefaultValue.BaseInterestRateOtherLoan, false, false, false, // 15-19
              DefaultRateDiscountIdx.CommercialLoan, DefaultRateDiscountIdx.ProvidentFundLoan, DefaultRateDiscountIdx.OtherLoan, // 20-24
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

  switch (action.type) {
    case SetLoanData:
      return getNewLoanData(state, action)

    default:
      return state
  }
}
