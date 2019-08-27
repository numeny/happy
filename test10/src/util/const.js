import Taro from '@tarojs/taro';
import namedPng from '@images/index/1.jpeg'

const HOST = "http://192.168.31.160"
export const SERVER_HOST = HOST + ":8001"
export const DEFAULT_IMG = namedPng
export const ICON_IMG = namedPng
export const IMG_SERVER_HOST = HOST
export const IMGS_ROOT_PATH = IMG_SERVER_HOST + "/images"

// refer to server/happy_inn/happy_inn/Utils.py
export const NUM_TRANSFORM_RH_ID = 10000000

export const PAGE_FOOTER_MENU = ['首页', '关于我们', '联系我们', '机构入驻']
export const ABOUT_US_MENU = ['关于我们', '联系我们', '机构入驻', '网站声明']

export const HOME_URL = '/pages/index/index'

export const STORAGE_KEY_LOGIN = 'login'
export const STORAGE_VALUE_LOGIN_SUCCESS = 'Y'
export const STORAGE_KEY_USER_ID = 'uid'
