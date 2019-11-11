import {
  SetCommercialLoanTotal,
  SetCommercialLoanMonthlyPayment,

  SetProvidentFundLoanTotal,
  SetProvidentFundLoanMonthlyPayment,

  SetOtherLoanTotal,
  SetOtherLoanMonthlyPayment,

  SetAllLoanTotal,
  SetAllLoanMonthlyPayment,
} from '../constants/loan'

export const setCommercialLoanTotal = (loan) => {
  return {
    type: SetCommercialLoanTotal,
    mCommercialLoanTotal: loan
  }
}

export const setCommercialLoanMonthlyPayment = (loan) => {
  return {
    type: SetCommercialLoanMonthlyPayment,
    mCommercialLoanMonthlyPayment: loan
  }
}

export const setProvidentFundLoanTotal = (loan) => {
  return {
    type: SetProvidentFundLoanTotal,
    mProvidentFundLoanTotal: loan
  }
}

export const setProvidentFundLoanMonthlyPayment = (loan) => {
  return {
    type: SetProvidentFundLoanMonthlyPayment,
    mProvidentFundLoanMonthlyPayment: loan
  }
}

export const setOtherLoanTotal = (loan) => {
  return {
    type: SetOtherLoanTotal,
    mOtherLoanTotal: loan
  }
}

export const setOtherLoanMonthlyPayment = (loan) => {
  return {
    type: SetOtherLoanMonthlyPayment,
    mOtherLoanMonthlyPayment: loan
  }
}

export const setAllLoanTotal = (loan) => {
  return {
    type: SetAllLoanTotal,
    mAllLoanTotal: loan
  }
}

export const setAllLoanMonthlyPayment = (loan) => {
  return {
    type: SetAllLoanMonthlyPayment,
    mAllLoanMonthlyPayment: loan
  }
}
