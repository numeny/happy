import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtIcon } from 'taro-ui'

import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import './fixedtitle.scss'
import { HOME_URL } from '@util/const'

export default class FixedTitle extends Component {

  constructor(props) {
    super(props)
    this.state = {
      stateTitle: this.props.title,
    }
  }

  goBack = e => {
    Taro.navigateBack()
  }

  goHome = e => {
    // first item is '首页'
    Taro.navigateTo({
      url: HOME_URL,
    })
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.title == this.state.title) {
      return
    }
    this.setState({
        stateTitle: nextProps.title,
    })
  }

  render () {
    return (
      <View className='ft-title'>
        <AtIcon value='chevron-left' size='20' onClick={this.goBack} className='ft-back-icon'></AtIcon>
        <View className='ft-text'>{this.state.stateTitle}</View>
        <AtIcon value='home' size='20' onClick={this.goHome} className='ft-home-icon'></AtIcon>
      </View>
    )
  }
}
