import { combineReducers } from 'redux'
import counter from './counter'
import loan from './loan'

export default combineReducers({
  counter, loan
})
