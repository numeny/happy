import {
  UPDATE_FAV_LIST,
  ADD_FAV_LIST,
  DEL_FAV_LIST,
  UPDATE_USERNAME,
  UPDATE_AVATAR,
} from '../constants/counter'

export const updateFavList = (rhFavList) => {
  return {
    type: UPDATE_FAV_LIST,
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

export const updateUsername = (username) => {
  return {
    type: UPDATE_USERNAME,
    username: username
  }
}

export const updateAvatar = (avatar) => {
  return {
    type: UPDATE_AVATAR,
    avatar: avatar
  }
}
