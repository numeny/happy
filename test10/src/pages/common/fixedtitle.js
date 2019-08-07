import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import './fixedtitle.scss'
import { HOME_URL } from '../common/const'

export default class FixedTitle extends Component {

  constructor(props) {
    super(props)
    this.state = {
      title: this.props.title,
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
        title: nextProps.title,
    })
  }

  render () {
    return (
      <View className='ft-title'>
        <View onClick={this.goBack} className='at-icon at-icon-chevron-left ft-back-icon'></View>
        <View className='ft-text'>{this.state.title}</View>
        <View onClick={this.goHome} className='at-icon at-icon-home ft-home-icon'></View>
      </View>
    )
  }
}
