import {
  CALC_DEEP_TAX_RATE,
} from '../constants/deedTaxRate'


export const calcDeepTaxRate = (isFirstHouse, houseArea) => {
// export const calcDeepTaxRate = () => {
  return {
    type: CALC_DEEP_TAX_RATE,
    isFirstHouse: isFirstHouse,
    houseArea: houseArea
    // deedTaxRate: 0.8,
  }
}
