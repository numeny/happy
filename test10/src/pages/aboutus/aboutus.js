import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtButton } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";
import "../../../node_modules/taro-ui/dist/style/components/button.scss";

import { SERVER_HOST } from '../common/const'

import './aboutus.scss'
import FixedTitle from '../common/fixedtitle'
import PageFooter from '../common/pagefooter'

import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

export default class AboutUs extends Component {

  config: Config = {
    navigationBarTitleText: '关于我们',
  }

  constructor(props) {
    super(props)
    this.state = {
      currItem: this.$router.params.idx,
      titleArray: ['关于我们', '联系我们', '网站声明', '机构入驻'],
    }
  }

  componentWillMount() {
    console.error('componentWillMount, currItem' + this.state.currItem)
  }

  onSelectItem (index, e) {
    if (index == this.state.currItem) {
      return
    }
    console.error('onSelectItem, title: ' + index)
    this.setState({
      currItem: index,
    })
  }

  render () {
    const selectStyle = {
      'color': '#8AC007',
    }

    let titleViews = (<View className='au-title-container'>
        {this.state.titleArray.map((title, index) =>
            <View className='au-title-item' style={this.state.titleArray[this.state.currItem] == title ? selectStyle : ''} onClick={this.onSelectItem.bind(this, index)}>{title}</View>
        )}
        </View>)
    return (
      <View className="au-top-view">
        <Video width='150px' height='190px' src={namedVideo} />
        <Image src={namedPng} />
        <FixedTitle title={this.state.titleArray[this.state.currItem]}/>
        <View>
        {titleViews}
        </View>
        <View>
        </View>
      </View>
    )
  }
}
