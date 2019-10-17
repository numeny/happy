import {
  CALC_DEEP_TAX_RATE,
} from '../constants/deedTaxRate'


export const calcDeedTaxRate = (isFirstHouse, houseArea) => {
  return {
    type: CALC_DEEP_TAX_RATE,
    isFirstHouse: isFirstHouse,
    houseArea: houseArea
  }
}
