import { CALC_DEEP_TAX_RATE } from '../constants/deedTaxRate'

const INITIAL_STATE = {
  deedTaxRate: 0
}

function CalcClient() {
  this.calcDeedTaxRate = function(isFirstHouse, houseArea) {
    let deedTaxRate = 0
    if (isFirstHouse) {
        deedTaxRate = (houseArea <= 90) ? 0.01 : 0.015
    } else {
        deedTaxRate = 0.03
    }
    return deedTaxRate
  }

  this.getPersonalIncomeTax = function() {
    return 0
  }

}
let sCalcClient = new CalcClient()

export default function deedTaxRate (state = INITIAL_STATE, action) {
  switch (action.type) {
    case CALC_DEEP_TAX_RATE:
      return {
        ...state,
        deedTaxRate: sCalcClient.calcDeedTaxRate(
            action.isFirstHouse, action.houseArea),
      }
    default:
      return state
  }
}
