import { combineReducers } from 'redux'
import counter from './counter'
import deedTaxRate from './deedTaxRate'

export default combineReducers({
  counter,
  deedTaxRate,
})
