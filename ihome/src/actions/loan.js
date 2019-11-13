import {
  SetLoanData,
} from '../constants/loan'

export const setLoanData = (field, value) => {
  return {
    type: SetLoanData,
    mField: field,
    mValue: value,
  }
}
