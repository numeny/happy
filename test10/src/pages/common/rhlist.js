import Taro, { Component, Events, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'
import './rhlist.scss'
import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

import { SERVER_HOST } from '../common/const'
import { DEFAULT_IMG } from '../common/const'
import { ICON_IMG } from '../common/const'

export default class Rhlist extends Component {

  constructor(props) {
    super(props)
    const DEFAULT_CURR_PAGE = 1
    this.state = {
      // input
      searchCondition: (this.props.searchCondition != null) ? this.props.searchCondition : '',
      currSearchRhNum: 0,

      currCity: (this.props.currCity != null) ? this.props.currCity : '',
      currCityRhNum: 0,

      // internal state
      rhList: [],
      currPage: this.DEFAULT_CURR_PAGE,
      isOnEnd: false,
    }
  }

  componentWillMount() {
    console.error("bdg-searchCondition: " + this.state.searchCondition)
    this.requestData(this.state.searchCondition, this.DEFAULT_CURR_PAGE) // 1st page
  }

  addedUrl = (searchCondition, requestPage) => {
    let addedUrl = (searchCondition.length > 0 ? ('?' + searchCondition) : '')
    if (requestPage != this.DEFAULT_CURR_PAGE) { // 1st page
      addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '?') + 'page=' + requestPage
    }

    return addedUrl
  }

  loadMoreData(e) {
    this.requestData(this.state.searchCondition, this.state.currPage + 1) // 1st page
  }

  requestData = (searchCondition, requestPage) => {
    let addedUrl = this.addedUrl(searchCondition, requestPage)
    console.error('request url: ' + SERVER_HOST + '/show_rh_list' + addedUrl)
    // calc the total num of current city's rh
    let isOnlySearchCity = true
    let searchConditionTmp = searchCondition
    let conditionArray = String(searchConditionTmp).split("&")
    for(var j = 0; j < conditionArray.length; j++) {
      if (conditionArray[j].trim().indexOf("prov=") == -1
            && conditionArray[j].trim().indexOf("city=") == -1)
        isOnlySearchCity = false
    }

    Taro.request({
      url: SERVER_HOST + '/show_rh_list' + addedUrl,
      success: (res) => {
        console.log(res.data.records)
        let rhList = []
        if (requestPage == this.DEFAULT_CURR_PAGE) {
          rhList = res.data.records
        } else {
          rhList = this.state.rhList.concat(res.data.records)
        }
        // Taro.showToast({title: res.data.records[0].title_image})
        this.setState({
            rhList: rhList,
            currSearchRhNum: res.data.totalNum,
            currPage: res.data.currPage,
            isOnEnd: (res.data.currPage >= res.data.pageNum),
            currCityRhNum: isOnlySearchCity ? res.data.totalNum : this.state.currCityRhNum,
        })
      },
      fail: (error) => {
        Taro.showToast({title: 'fail'})
      },
      complete: () => {
        // Taro.showToast({title: "complete"})
      },
    })
  }

  componentDidMount () {
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.searchCondition == nextProps.searchCondition) {
      return
    }

    let searchCondition = (nextProps.searchCondition != null) ? nextProps.searchCondition : ''
    let currCity = (nextProps.currCity != null) ? nextProps.currCity : ''
    this.requestData(
        searchCondition,
        this.DEFAULT_CURR_PAGE) // 1st page
    this.setState({
        searchCondition: searchCondition,
        currCity: currCity,
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  showRhDetail (rh_id, e) {
    Taro.showToast({title: String(rh_id)})
    Taro.navigateTo({
      url: '/pages/rhdetail/rhdetail?rh_id=' + String(rh_id),
    })

    // Taro.showNavigationBarLoading();
  }

  render () {
    const { rhList } = this.state

    // display rest home list or error message
    const restHomeList = (
          <View className='rh-list-container'>
          {rhList.map((rh) =>
            <View className='rh-one-container' onClick={this.showRhDetail.bind(this, rh.id)}>
              <Image src={rh.title_image != "" ? rh.title_image : DEFAULT_IMG} className='rh-one-img'/>
              <View className='rh-one-desc-container'>
                <View className='rh-one-desc-name'>{rh.name}</View>
                <View className='rh-one-desc-address'>{rh.address}</View>
                <View className='rh-one-desc-bednum-container'>
                  <View className='rh-one-desc-bednum'>{rh.bednum_int}个床位</View>
                  <View className='rh-one-desc-property'><Text>{rh.factory_property}</Text></View>
                </View>
              </View>
            </View>
          )}
          </View>)

    const hasMoreData = (
        <View>
        { rhList.length == 0 ? (<View className='rh-list-loading-more'><View>暂无数据，</View><View>请换条件重新查询。</View></View>) : (this.state.isOnEnd ? (<Text className='rh-list-loading-more'>已经到底了</Text>) : (<Text className='rh-list-loading-more' onClick={this.loadMoreData.bind(this)}> 点击查看更多 </Text>)) }
        </View>
        )

    return (
      <View>
      {this.state.currCity.length != 0 ?
      <View className='rhlist-total-rh-count-container'>
        <View className='rhlist-total-rh-count-title'>
          {this.state.currCity}养老院
        </View>
        <View className='rhlist-total-rh-count-content'>
          共计{this.state.currCityRhNum}家
        </View>
        </View>: <View className='rhlist-curr-rh-count-container'>
        当前查询共计<Text>{this.state.currSearchRhNum}</Text>家
      </View>}

      <View className='rhlist-top-container'>
        {restHomeList}
        {hasMoreData}
      </View>
      </View>
    )
  }
}
