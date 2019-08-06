import Taro, { Component, Events, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import './index.scss'
import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

import { SERVER_HOST } from '../common/const'
import { DEFAULT_IMG } from '../common/const'
import { ICON_IMG } from '../common/const'

import PageFooter from '../common/pagefooter'
import Rhlist from '../common/rhlist'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '全国最全的养老院查询',
  }

  constructor(props) {
    super(props)

    this.state = {
      searchCondition: '',

      currProv: "北京市",
      currCity: "北京市",

      selectorArea: [],
      selectorAreaChecked: '不限',
      selectorAreaCheckedIdx: 0,

      selectorPrice: ['不限', '0-1000', '1000-2000', '2000-3000', '3000-5000', '5000-7000', '7000-10000', '10000-'],
      selectorPriceChecked: '不限',
      selectorPriceCheckedIdx: 0,

      selectorBednum: ['不限', '0-50', '50-100', '100-200', '200-300', '300-500', '500-1000', '1000-'],
      selectorBednumChecked: '不限',
      selectorBednumCheckedIdx: 0,

      selectorType: ['不限', '老年公寓', '养老照料中心', '护理院', '其他'],
      selectorTypeChecked: '不限',
      selectorTypeCheckedIdx: 0,

      selectorProp: ['不限', '民营机构', '国营机构', '公建民营', '民办公助', '其他'],
      selectorPropChecked: '不限',
      selectorPropCheckedIdx: 0,
    }
  }

  componentWillMount() {
    /*
    Taro.getLocation({
      success: (res) => {
        console.error("success, res: " + res)
        Taro.showToast({title: 'success'})
      },
      fail: (error) => {
        Taro.showToast({title: 'fail'})
        console.error("fail")
      },
      complete: () => {
        Taro.showToast({title: 'complete'})
        console.error("complete")
      },
    })
    */

    let currProv = this.state.currProv
    let currCity = this.state.currCity
    if (this.$router.params.prov != null
        && this.$router.params.prov.length > 0
        && this.$router.params.city != null
        && this.$router.params.city.length > 0) {
      currProv = this.$router.params.prov
      currCity = this.$router.params.city
      this.setState({
        currProv: currProv,
        currCity: currCity,
      })
    }
    this.requestData(this.state.selectorPriceCheckedIdx, this.state.selectorBednumCheckedIdx,
        this.state.selectorTypeCheckedIdx, this.state.selectorPropCheckedIdx,
        currProv, currCity,
        this.state.selectorAreaCheckedIdx) // 1st page
  }

  requestAreaRhData = (selectorAreaCheckedIdx) => {
    this.requestData(this.state.selectorPriceCheckedIdx, this.state.selectorBednumCheckedIdx,
        this.state.selectorTypeCheckedIdx, this.state.selectorPropCheckedIdx,
        this.state.currProv, this.state.currCity,
        selectorAreaCheckedIdx)
  }

  requestPriceData = (selectorPriceCheckedIdx) => {
    this.requestData(selectorPriceCheckedIdx, this.state.selectorBednumCheckedIdx,
        this.state.selectorTypeCheckedIdx, this.state.selectorPropCheckedIdx,
        this.state.currProv, this.state.currCity,
        this.state.selectorAreaCheckedIdx)
  }

  requestBednumData = (selectorBednumCheckedIdx) => {
    this.requestData(this.state.selectorPriceCheckedIdx, selectorBednumCheckedIdx,
        this.state.selectorTypeCheckedIdx, this.state.selectorPropCheckedIdx,
        this.state.currProv, this.state.currCity,
        this.state.selectorAreaCheckedIdx)
  }

  requestTypeData = (selectorTypeCheckedIdx) => {
    this.requestData(this.state.selectorPriceCheckedIdx, this.state.selectorBednumCheckedIdx,
        selectorTypeCheckedIdx, this.state.selectorPropCheckedIdx,
        this.state.currProv, this.state.currCity,
        this.state.selectorAreaCheckedIdx)
  }

  requestPropData = (selectorPropCheckedIdx) => {
    this.requestData(this.state.selectorPriceCheckedIdx, this.state.selectorBednumCheckedIdx,
        this.state.selectorTypeCheckedIdx, selectorPropCheckedIdx,
        this.state.currProv, this.state.currCity,
        this.state.selectorAreaCheckedIdx)
  }

  addedUrl = (selectorPriceCheckedIdx, selectorBednumCheckedIdx,
      selectorTypeCheckedIdx, selectorPropCheckedIdx,
      currProv, currCity,
      selectorAreaCheckedIdx) => {
    let addedUrl = ''
    if (selectorPriceCheckedIdx != 0) {
      let selectorPriceChecked = this.state.selectorPrice[selectorPriceCheckedIdx]
      let price = String(selectorPriceChecked).split("-")
      try {
        if (price[0].length > 0) {
          let minPrice = parseInt(price[0])
          addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '') + 'min_price=' + minPrice
        }
      } catch(err) {
        console.error('[Warning] calc min price error!')
      }
      try {
        if (price[1].length > 0) {
          let maxPrice = parseInt(price[1])
          addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '') + 'max_price=' + maxPrice
        }
      } catch(err) {
        console.error('[Warning] calc max price error!')
      }
    }
    if (selectorBednumCheckedIdx != 0) {
      let selectorBednumChecked = this.state.selectorBednum[selectorBednumCheckedIdx]
      let bednum = String(selectorBednumChecked).split("-")
      try {
        if (bednum[0].length > 0) {
          let minBednum = parseInt(bednum[0])
          addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '') + 'min_bed=' + minBednum
        }
      } catch(err) {
        console.error('[Warning] calc min bed num error!')
      }
      try {
        if (bednum[1].length > 0) {
          let maxBednum = parseInt(bednum[1])
          addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '') + 'max_bed=' + maxBednum
        }
      } catch(err) {
        console.error('[Warning] calc max bed num error!')
      }
    }
    if (selectorTypeCheckedIdx != 0) {
      addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '') + 'type=' + selectorTypeCheckedIdx
    }
    if (selectorPropCheckedIdx != 0) {
      addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '') + 'prop=' + selectorPropCheckedIdx
    }

    if (currProv.length != 0) {
      addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '') + 'prov=' + currProv
    }

    if (currCity.length != 0) {
      addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '') + 'city=' + currCity
    }

    if (selectorAreaCheckedIdx != 0) {
      addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '') + 'area=' + this.state.selectorArea[selectorAreaCheckedIdx]
    }
    return addedUrl
  }

  requestData = (selectorPriceCheckedIdx, selectorBednumCheckedIdx,
      selectorTypeCheckedIdx, selectorPropCheckedIdx,
      currProv, currCity,
      selectorAreaCheckedIdx) => {
    let addedUrl = this.addedUrl(selectorPriceCheckedIdx,
        selectorBednumCheckedIdx, selectorTypeCheckedIdx,
        selectorPropCheckedIdx, currProv, currCity,
        selectorAreaCheckedIdx)
    console.error('request url: ' + SERVER_HOST + '/show_rh_list' + addedUrl)
    this.setState({
      searchCondition: addedUrl,
    })
  }

  requestAreaData = () => {
    let url = SERVER_HOST + '/arealist' + "?prov=" + this.state.currProv + "&city=" + this.state.currCity
    Taro.request({
      url: url,
      success: (res) => {
        console.log(res.data)
        let selectorArea = ['不限']
        for (var i in res.data) {
            selectorArea.push(res.data[i])
        }
        this.setState({
            selectorArea: selectorArea,
        })
      },
      fail: (error) => {
        console.error('fail')
        Taro.showToast({title: 'fail'})
      },
      complete: () => {
        // Taro.showToast({title: "complete"})
      },
    })
  }

  componentDidMount () {
    this.requestAreaData()
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onChangeArea = e => {
    this.requestAreaRhData(e.detail.value)
    this.setState({
      selectorAreaChecked: this.state.selectorArea[e.detail.value],
      selectorAreaCheckedIdx: e.detail.value,
    })
  }

  onChangePrice = e => {
    this.requestPriceData(e.detail.value)
    this.setState({
      selectorPriceChecked: this.state.selectorPrice[e.detail.value],
      selectorPriceCheckedIdx: e.detail.value,
    })
  }

  onChangeBednum = e => {
    this.requestBednumData(e.detail.value)
    this.setState({
      selectorBednumChecked: this.state.selectorBednum[e.detail.value],
      selectorBednumCheckedIdx: e.detail.value,
    })
  }

  onChangeType = e => {
    this.requestTypeData(e.detail.value)
    this.setState({
      selectorTypeChecked: this.state.selectorType[e.detail.value],
      selectorTypeCheckedIdx: e.detail.value,
    })
  }

  onChangeProp = e => {
    this.requestPropData(e.detail.value)
    this.setState({
      selectorPropChecked: this.state.selectorProp[e.detail.value],
      selectorPropCheckedIdx: e.detail.value,
    })
  }

  selectCitylist (e) {
    Taro.navigateTo({
      url: '/pages/citylist/citylist?prov=' + this.state.currProv + '&city=' + this.state.currCity,
    })
  }

  searchRh (e) {
    Taro.navigateTo({
      url: '/pages/rhsearch/rhsearch',
    })
  }

  scrollToTop (e) {
    Taro.pageScrollTo({
      scrollTop: 0,
      duration: 300,
    })
  }

  render () {
    return (
      <View className='top-container'>
        <Video width='150px' height='190px' src={namedVideo} />
        <Image src={namedPng} />
        <View className='top-title-top-container'>
          <View className='top-title-container'>
            <View>
            <Text className='top-title-city' onClick={this.selectCitylist.bind(this)}>{this.state.currCity}</Text>
            <View onClick={this.selectCitylist.bind(this)} className='at-icon at-icon-chevron-down'></View>
            </View>

            <View className='rh-classify-search-box-container' onClick={this.searchRh.bind(this)}>
              <Input type='text' placeholder='找养老院' className='rh-classify-search-box' />
              <View className='at-icon at-icon-search rh-classify-search-icon'></View>
            </View>
          </View>
          <View className='classify-title-container'>
              <Picker className='classify-title-item' mode='selector' range={this.state.selectorArea} onChange={this.onChangeArea}>
                {this.state.selectorAreaChecked == "不限"?<View className='classify-title-item'>区域</View>:
                <View className='classify-title-item'>{this.state.selectorAreaChecked}</View>}
              </Picker>
              <Picker className='classify-title-item' mode='selector' range={this.state.selectorPrice} onChange={this.onChangePrice}>
                {this.state.selectorPriceChecked == "不限"?<View className='classify-title-item'>价格</View>:
                <View className='classify-title-item'>{this.state.selectorPriceChecked}元</View>}
              </Picker>
              <Picker className='classify-title-item' mode='selector' range={this.state.selectorBednum} onChange={this.onChangeBednum}>
                {this.state.selectorBednumChecked == "不限"?<View className='classify-title-item'>床位数</View>:
                <View className='classify-title-item'>{this.state.selectorBednumChecked}</View>}
              </Picker>
              <Picker className='classify-title-item' mode='selector' range={this.state.selectorType} onChange={this.onChangeType}>
                {this.state.selectorTypeChecked == "不限"?<View className='classify-title-item'>类型</View>:
                  <View className='classify-title-item'>{this.state.selectorTypeChecked}</View>}
              </Picker>
              <Picker className='classify-title-item' mode='selector' range={this.state.selectorProp} onChange={this.onChangeProp}>
                {this.state.selectorPropChecked == "不限"?<View className='classify-title-item'>性质</View>:
                <View className='classify-title-item'>{this.state.selectorPropChecked}</View>}
              </Picker>
          </View>
        </View>
        <Rhlist searchCondition={this.state.searchCondition} currCity={this.state.currCity} />
        <View onClick={this.scrollToTop.bind(this)} className='fixed-to-top'>
            <View className='at-icon at-icon-chevron-up'>
            </View>
        </View>
        <PageFooter />
      </View>
    )
  }
}
