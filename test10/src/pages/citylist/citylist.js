import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import './citylist.scss'


import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

export default class Citylist extends Component {

  constructor(props) {
    super(props)
    this.state = {
      currProv : '北京市',
      currCity : '北京市',
    }
  }

  componentDidMount () {
  }

  render () {
    return (
      <View className="top-view">
        <Video width='150px' height='190px' src={namedVideo} />
        <Image src={namedPng} />
        <View className='title'>
          <View className='at-icon at-icon-chevron-left back-icon'></View>
          <View className='title-select-city'>选择城市</View>
        </View>
        <View className='city-container'>
          <View className='curr-city-container'>
            当前城市
            <View className='curr-city'>{this.state.currCity}</View>
          </View>
          <View className='hot-city-container'>
            热点城市
            <View className='hot-city-row-container'>
              <Text className='hot-city-item'>北京市</Text>
              <Text className='hot-city-item'>上海市</Text>
              <Text className='hot-city-item'>深圳市</Text>
            </View>
            <View className='hot-city-row-container'>
              <Text className='hot-city-item'>广州市</Text>
              <Text className='hot-city-item'>天津市</Text>
              <Text className='hot-city-item'>杭州市</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
}
