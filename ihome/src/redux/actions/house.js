import {
  SetHouseData,
} from '../constants/house'

export const setLoanData = (field, value) => {
  return {
    type: SetHouseData,
    mField: field,
    mValue: value,
  }
}
