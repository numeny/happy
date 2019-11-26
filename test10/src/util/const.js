import Taro from '@tarojs/taro';

const HOST = "http://192.144.213.106"
const SERVER_PORT = ""
const IMAGES_PATH = "/images"
const DEF_AVATAR = "/avatar.png"
const DEF_LOGO = "/logo.png"

// FIXME
// image server should not the same with data server
export const IMG_SERVER_HOST = HOST

export const IMGS_ROOT_PATH = IMG_SERVER_HOST + IMAGES_PATH + '/'
export const DEF_LOGO_IMG = IMGS_ROOT_PATH + DEF_LOGO

// FIXME, load default image of NoImage from local
export const defaultPng = IMGS_ROOT_PATH + "/default.jpg"
export const SERVER_HOST = (SERVER_PORT == "") ? HOST : (HOST + ":" + SERVER_PORT)
export const DEFAULT_IMG = defaultPng
// FIXME, load icon image from local
export const ICON_IMG = defaultPng

export const DEF_USER_NAME = "匿名用户"
export const DEF_AVATAR_IMG = IMGS_ROOT_PATH + DEF_AVATAR

// refer to server/happy_inn/happy_inn/Utils.py
export const NUM_TRANSFORM_RH_ID = 10000000

export const PAGE_FOOTER_MENU = ['首页', '关于我们', '联系我们', '机构入驻']
export const ABOUT_US_MENU = ['关于我们', '联系我们', '机构入驻', '网站声明']

export const HOME_URL = '/pages/index/index'

export const STORAGE_KEY_LOGIN = 'login'
export const STORAGE_VALUE_LOGIN_SUCCESS = 'Y'
export const STORAGE_KEY_USER_ID = 'uid'
