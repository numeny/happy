import { SetHouseData } from '../constants/house'

const INITIAL_STATE = {
  // refer to constants/loan.js : LoanDataType
  mHouseData: [0, 0, 0, 0, 0, // 0-4
             ],
}

export default function house (state = INITIAL_STATE, action) {

  switch (action.type) {
    case SetHouseData:
      state.mHouseData[action.mField] = action.mValue
      return {
        ...state,
      }

    default:
      return state
  }
}
