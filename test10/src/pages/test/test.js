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
  {name: CommonFunc.requestRhList, params: ['prov=北京市&city=北京市']},
  {name: CommonFunc.requestRhList, params: ['searchKey=美']},
  {name: CommonFunc.requestRhDetail, params: [10018644]},
  {name: CommonFunc.login, params: ['m', 'm']},
  {name: CommonFunc.loginForWeixin, },
  {name: CommonFunc.logout, },
  {name: CommonFunc.requestCityData, params: ['', '']},
  {name: CommonFunc.requestCityData, params: ['北京市', '']},
  {name: CommonFunc.requestCityData, params: ['山东省', '淄博市']},
  {name: CommonFunc.changeFav, params: [0, 10018644, true]},
  {name: CommonFunc.getCurrCityImpl, params: [116.310003, 39.991957]},
]

const TEST_COUNT = 100
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

  testOneCase = (testFunc) => {
    const funcName = testFunc.name.name
    console.log('start ' + funcName);
    const start = this.currTime()
    for (var idx = 0; idx < TEST_COUNT; idx++) {
      if ('params' in testFunc) {
        testFunc.name.apply(this, testFunc.params)
          .then(res => {
            const endTime = (this.currTime() - start)
            console.log('end2 ' + funcName + ': interval: '
              + endTime + ' ms');
          }).catch(error => {
            reject(error)
          })
      } else {
        testFunc.name()
          .then(res => {
            const endTime = (this.currTime() - start)
            console.log('end2 ' + funcName + ': interval: '
              + endTime + ' ms');
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
          <View className='test-container'>
          {allFunctions.map((func, i) =>
            <View onClick={this.testAllCases.bind(this, func, i)}
              className='test-submit'>
              {func.name.name}(
                {'params' in func && func.params.length &&
                  func.params.map((par, i) =>
                    i==0 ? (par) : (',' + par)
                  )
              })
            </View>
          )}
          </View>)
    
    return (
      <View className="test-top-view">
      <Video width='150px' height='190px' src={namedVideo} />
      <Image src={namedPng} />
      <FixedTitle title="用户登录" />
      <View> 总次数：{TEST_COUNT}</View>
      {testButtons}
      <PageFooter />
      </View>
    )
  }
}
