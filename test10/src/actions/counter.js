import {
  UPDATE,
  ADD_FAV_LIST,
  DEL_FAV_LIST,
} from '../constants/counter'

export const update = (rhFavList) => {
  return {
    type: UPDATE, 
    rhFavList: rhFavList
  }
}

export const addFavList = (rhFavList) => {
  return {
    type: ADD_FAV_LIST, 
    rhFavList: rhFavList
  }
}

export const delFavList = (rhFavList) => {
  return {
    type: DEL_FAV_LIST,
    rhFavList: rhFavList
  }
}
