import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtButton } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import './rhsearch.scss'

import FixedTitle from '../common/fixedtitle'
import PageFooter from '../common/pagefooter'
import { RHLIST_TYPE_SEARCH } from '../../util/const_internal'
import Rhlist from '../common/rhlist'
import { CommonFunc } from '../../util/common_func'
import { Util } from '../../util/util'

import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

import { connect } from '@tarojs/redux'
import { update, addFavList, delFavList } from '../../actions/counter'

@connect((state) => {
  return { prop_counter: state.counter }
}, (dispatch) => ({
  addFavListProp (rhId) {
    console.error('addFavList, surccess, ' + rhId)
    dispatch(addFavList([rhId]))
  },
  delFavListProp (rhId) {
    console.error('delFavList, surccess, ' + rhId)
    dispatch(delFavList([rhId]))
  },
}))

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

  goBack = (e) => {
    Taro.navigateBack()
  }

  startSearch = (e) => {
    let searchCondition =
      (this.state.inputValue.length != 0) ? ('searchKey=' + this.state.inputValue) : ''
      // startedSearch: false,
    this.setState({
      searchCondition: encodeURI(searchCondition),
      startedSearch: true,
    })
  }

  onInputChanged = (e) =>  {
    this.setState({
      inputValue: e.target.value,
    })
  }

  selectHotCity (prov, city, e) {
    CommonFunc.selectNewCity(prov, city)
  }

  render () {
    let hotCityList = [[['北京市','北京市'], ['上海市', '上海市'], ['广东省', '深圳市']],
      [['广东省', '广州市'], ['浙江省', '杭州市'], ['天津市', '天津市']]]
    let hotCityItems = (<View>
        {hotCityList.map((citys) =>
            <View className='hot-city-row-container'>
            <Text className='hot-city-item' onClick={this.selectHotCity.bind(this, citys[0][0], citys[0][1])}>{citys[0][1]}</Text>
            <Text className='hot-city-item' onClick={this.selectHotCity.bind(this, citys[1][0], citys[1][1])}>{citys[1][1]}</Text>
            <Text className='hot-city-item' onClick={this.selectHotCity.bind(this, citys[2][0], citys[2][1])}>{citys[2][1]}</Text>
            </View>
        )}
        </View>)


    return (
      <View className="rs-top-view">
        {CommonFunc.isTaroEnvH5() &&
          <FixedTitle title='搜索养老院'/>}
        <View className='sb-container'>
          <View className='sb-container-2'>
            <Input type='text' placeholder='找养老院' onInput={this.onInputChanged} onConfirm={this.startSearch} className='sb-search-box' />
            <View onClick={this.startSearch} className='at-icon at-icon-search rs-search-icon'></View>
          </View>
        </View>
        <View>热门搜索：</View>
        {hotCityItems}
        {this.state.startedSearch &&
          <Rhlist searchCondition={this.state.searchCondition}
            type={RHLIST_TYPE_SEARCH} />}
        <PageFooter />
      </View>
    )
  }
}
