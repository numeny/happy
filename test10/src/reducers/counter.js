import { UPDATE_FAV_LIST, ADD_FAV_LIST, DEL_FAV_LIST, UPDATE_AVATAR } from '../constants/counter'

const INITIAL_STATE = {
  rhFavList: [],
  avatar: ''
}

function unique(arr) {
  if (!Array.isArray(arr)) {
    console.log('type error!')
    return
  }
  return Array.from(new Set(arr))
}

function delFavList_1(oldList, delList) {
  let newList = []
  for (var i = 0; i < oldList.length; i++) {
    if (delList.indexOf(oldList[i]) == -1) {
      newList.push(oldList[i])
    }
  }
  return newList
}

export default function counter (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_FAV_LIST:
      return {
        ...state,
        rhFavList: action.rhFavList
      }
    case ADD_FAV_LIST:
      return {
        ...state,
        rhFavList: unique(state.rhFavList.concat(action.rhFavList))
      }
    case DEL_FAV_LIST:
      return {
        ...state,
        rhFavList: delFavList_1(state.rhFavList, action.rhFavList)
      }
    case UPDATE_AVATAR:
      return {
        ...state,
        avatar: action.avatar
      }
    default:
      return state
  }
}
