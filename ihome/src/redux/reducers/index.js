import { combineReducers } from 'redux'
import loan from './loan'
import house from './house'

export default combineReducers({
  house, loan
})
