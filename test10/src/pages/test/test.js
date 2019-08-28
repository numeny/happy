import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtButton } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";
import "../../../node_modules/taro-ui/dist/style/components/button.scss";

import { IMGS_ROOT_PATH } from '../../util/const'
import { CommonFunc } from '@util/common_func'
import { Util } from '@util/util'

import './test.scss'
import FixedTitle from '../common/fixedtitle'
import PageFooter from '../common/pagefooter'
import Rhlist from '../common/rhlist'

import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

import { connect } from '@tarojs/redux'
import { updateFavList, updateAvatar, updateUsername } from '../../actions/counter'

const LOGIN_TYPE_NONE = 0
const LOGIN_TYPE_WEIXIN = 1
const LOGIN_TYPE_PHONE = 2

export default class Login extends Component {

  config: Config = {
    navigationBarTitleText: '登录',
  }

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
    }
  }

  componentWillMount() {
  }

  // Milliseconds
  currTime() {
    return (new Date()).getTime()
  }

  testRhData = (e) =>  {
    console.log('start testRhData: ');
    const start = this.currTime()
    for (var idx = 0; idx < 100; idx++) {
      CommonFunc.requestRhList('')
        .then(res => {
          console.log('end testRhData: interval: '
            + (this.currTime() - start) + ' ms');
        }).catch(error => {
          reject(error)
        })
    }
    let end = this.currTime()
    console.log('end testRhData: interval: '
        + (end - start) + ' ms');
  }

  testRhData1 = (e) =>  {
    console.log('start getUserFavList: ');
    const start = this.currTime()
    for (var idx = 0; idx < 1000; idx++) {
      CommonFunc.getUserFavList()
        .then(res => {
          console.log('end getUserFavList: interval: '
            + (this.currTime() - start) + ' ms');
        }).catch(error => {
          reject(error)
        })
    }
    let end = this.currTime()
    console.log('end testRhData: interval: '
        + (end - start) + ' ms');
  }

  testUserManager = (e) =>  {
  }

  testFavList = (e) =>  {
  }

  render () {
    return (
      <View className="login-top-view">
      <Video width='150px' height='190px' src={namedVideo} />
      <Image src={namedPng} />
      <FixedTitle title="用户登录" />
        <View className="login-top-view-1">
          <View onClick={this.testRhData}
              className='login-input-submit'>
            testRhData
          </View>
          <View onClick={this.testUserManager} className='login-input-submit'>
            testUserManager
          </View>
          <View onClick={this.testFavList}
              className='login-input-submit'>
            testFavList
          </View>
        </View>
      <PageFooter />
      </View>
    )
  }
}
