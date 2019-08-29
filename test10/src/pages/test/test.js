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

const allFunctions = [
  {name: CommonFunc.getUserFavList, },
  {name: CommonFunc.requestRhList, params: ['']},
  {name: CommonFunc.requestRhDetail, params: [10018644]},
  {name: CommonFunc.login, params: ['m', 'm']},
  {name: CommonFunc.logout, },
  {name: CommonFunc.requestCityData, params: ['山东省', '']},
  {name: CommonFunc.requestCityData, params: ['北京市', '']},
]

export default class Login extends Component {

  config: Config = {
    navigationBarTitleText: '登录',
  }

  constructor(props) {
    super(props)
    this.state = {
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
          console.log('end2 testRhData: interval: '
            + (this.currTime() - start) + ' ms');
        }).catch(error => {
          reject(error)
        })
    }
    let end = this.currTime()
    console.log('end1 testRhData: interval: '
        + (end - start) + ' ms');
  }

  testrequestRhDetail = (e) =>  {
    console.log('start testrequestRhDetail: ');
    const start = this.currTime()
    for (var idx = 0; idx < 1000; idx++) {
      CommonFunc.requestRhDetail(10018644)
        .then(res => {
          console.log('end2 testrequestRhDetail: interval: '
            + (this.currTime() - start) + ' ms');
        }).catch(error => {
          reject(error)
        })
    }
    let end = this.currTime()
    console.log('end1 testrequestRhDetail: interval: '
        + (end - start) + ' ms');
  }

  testUserManager = (e) =>  {
  }

  testFavList = (e) =>  {
    console.log('start getUserFavList: ');
    const start = this.currTime()
    for (var idx = 0; idx < 100; idx++) {
      CommonFunc.getUserFavList()
        .then(res => {
          console.log('end2 getUserFavList: interval: '
            + (this.currTime() - start) + ' ms');
        }).catch(error => {
          reject(error)
        })
    }
    let end = this.currTime()
    console.log('end1 getUserFavList: interval: '
        + (end - start) + ' ms');
  }

  testOneCase = (testFunc) => {
    const funcName = testFunc.name.name
    console.log('start ' + funcName);
    const start = this.currTime()
    for (var idx = 0; idx < 100; idx++) {
      if ('params' in testFunc) {
        testFunc.name(testFunc.params)
          .then(res => {
            console.log('end2 ' + funcName + ': interval: '
              + (this.currTime() - start) + ' ms');
          }).catch(error => {
            reject(error)
          })
      } else {
        testFunc.name()
          .then(res => {
            console.log('end2 ' + funcName + ': interval: '
              + (this.currTime() - start) + ' ms');
          }).catch(error => {
            reject(error)
          })
      }
    }
    let end = this.currTime()
    console.log('end1 ' + funcName + ': interval: '
        + (end - start) + ' ms');
  }

  testAllCases = (func, idx, e) =>  {
    this.testOneCase(func)
    // this.testOneCase(CommonFunc.getUserFavList)
  }

  render () {

    const testButtons = (
          <View className='rh-list-container'>
          {allFunctions.map((func, i) =>
            <View onClick={this.testAllCases.bind(this, func, i)}
              className='login-input-submit'>
              {func.name.name}{'params' in func && func.params.length &&
                  func.params.map((par, i) =>
                    (par)
                  )
              }
            </View>
          )}
          </View>)
    
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
          <View onClick={this.testrequestRhDetail}
              className='login-input-submit'>
            testrequestRhDetail
          </View>
          <View onClick={this.testFavList}
              className='login-input-submit'>
            testFavList
          </View>
          <View onClick={this.testAllCases}
              className='login-input-submit'>
            testAllCases
          </View>
        </View>
<View>mmmmmmmmmmm</View>
      {testButtons}
      <PageFooter />
      </View>
    )
  }
}
