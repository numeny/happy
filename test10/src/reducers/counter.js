import { UPDATE, ADD_FAV_LIST, DEL_FAV_LIST } from '../constants/counter'

const INITIAL_STATE = {
  rhFavList: []
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE:
      return {
        ...state,
        rhFavList: action.rhFavList
      }
    case ADD_FAV_LIST:
      return {
        ...state,
        rhFavList: state.rhFavList.concat(action.rhFavList)
      }
    case DEL_FAV_LIST:
      return {
        ...state,
        rhFavList: state.rhFavList.concat(action.rhFavList)
      }
    default:
      return state
  }
}
