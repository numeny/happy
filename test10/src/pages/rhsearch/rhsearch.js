import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtButton } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import './rhsearch.scss'
import PageFooter from '../common/pagefooter'
import Rhlist from '../common/rhlist'

import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

export default class RhSearch extends Component {

  config: Config = {
    navigationBarTitleText: '搜索养老院',
  }

  constructor(props) {
    super(props)
    this.state = {
      searchCondition: '',
      searchKeyword: '',
      inputValue: '',
      startSearch: false,
    }
  }

  componentWillMount() {
  }

  goBack (e) {
    Taro.navigateBack()
  }

  startSearch (e) {
    let searchCondition =
      (this.state.inputValue.length != 0) ? ('searchKey=' + this.state.inputValue) : ''
      // startedSearch: false,
    this.setState({
      searchCondition: searchCondition,
      startedSearch: true,
    })
  }

  onInputChanged (e)  {
    this.setState({
      inputValue: e.target.value,
    })
  }

  render () {
    return (
      <View className="rhsearch-top-view">
        <Video width='150px' height='190px' src={namedVideo} />
        <Image src={namedPng} />
        <View className='rh-search-title-container'>
          <View onClick={this.goBack.bind(this)} className='at-icon at-icon-chevron-left rh-search-back-icon'></View>
          <View className='rh-search-title-text'>搜索养老院</View>
        </View>
        <View className='search-box-container'>
          <View className='search-box-container-2'>
            <Input type='text' placeholder='找养老院' onInput={this.onInputChanged.bind(this)} onConfirm={this.startSearch.bind(this)} className='rh-search-search-box' />
            <View onClick={this.startSearch.bind(this)} className='at-icon at-icon-search rh-search-search-icon'></View>
          </View>
        </View>
        {this.state.startedSearch ?
          <Rhlist searchCondition={this.state.searchCondition} /> : <View>input key</View>}
        <View>
          热门搜索
        <View>
          热门搜索
        </View>
        </View>
        <PageFooter />
      </View>
    )
  }
}
