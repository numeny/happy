import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtIcon } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";
import "../../../node_modules/taro-ui/dist/style/components/button.scss";

import './citylist.scss'
// import FixedTitle from '../common/fixedtitle'
import PageFooter from '../common/pagefooter'
// import { CommonFunc } from '../../util/common_func'
import { Util } from '../../util/util'

import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

export default class Citylist extends Component {

  config: Config = {
    navigationBarTitleText: '选择城市',
  }

  constructor(props) {
    super(props)
    this.state = {
      // currProv : this.props.currProv,
      currProv : '北京市',
      currCity : '北京市',
      currCityItems : [],
      isDisplayingCity : false,
    }
  }

  componentWillMount() {
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
        selectedProv : currProv,
        selectedCity : currCity,
      })
    }
    // this.requestCityData(currProv)
  }

  requestCityData = (prov) => {
    /*
    CommonFunc.requestCityData(prov, '').then(res => {
      let currCityItems = []
      let newElem = []
      for (let i = 0; i < res.data.length; i++) {
        if (i % 3 == 0) {
          newElem = new Array()
          currCityItems.push(newElem)
        } else {
          newElem = currCityItems[currCityItems.length-1]
        }
        newElem.push(res.data[i])
      }

      this.setState({
          currCityItems: currCityItems,
          isDisplayingCity: (prov.length > 0),
      })
    }).catch(error => {
        console.error("request city data fail!")
    })
    */
  }

  getGeolocationCity = (e) => {
    /*
    CommonFunc.getCurrCity(true)
      .then(res => {
        if (res.data.province.length <= 0
            || res.data.city.length <= 0) {
          return Promise.reject(res)
        }
        console.log("CommonFunc.getCurrCity, province: "
            + res.data.province + ", city: " + res.data.city)
        this.setState({
            currProv: res.data.province,
            currCity: res.data.city,
        })
        this.selectHotCity(res.data.province, res.data.city)
      }).catch(error => {
        console.error(error)
      })
    */
  }

  showAreaList (prov, e) {
    // this.showAreaListImpl(prov)
  }

  showAreaListImpl (prov) {
    this.requestCityData(prov)
    this.setState({
        selectedProv: prov,
        selectedCity: '',
    })
  }

  selectArea (area, e) {
    if (this.state.isDisplayingCity) {
      // province has been selected
      // this.requestCityData(area)
      this.setState({
          selectedCity: area,
      })
    } else {
      // province has not been selected
      this.requestCityData(area)
      this.setState({
          selectedProv: area,
          selectedCity: '',
      })
    }
  }

  onButtonClicked = (idx, e) => {
    if (idx == 1) {
      // 重置
      // this.showAreaListImpl('')
    } else if (idx == 2) {
      // 取消
      Taro.navigateBack()
    } else if (idx == 3) {
      // 确定
      this.selectNewCity()
    }
  }

  selectNewCity = () => {
    // FIXME
    if (Util.isH5()) {
      // only for h5
      // CommonFunc.requestRhListWithCityInfo(prov, city)
    } else {
      // for weapp, because view stack length should be small than 10
      // FIXME
      let pages = Taro.getCurrentPages();
      console.error('pages')
      console.error(pages)
      console.error(pages.length)
      let currPage = pages[ pages.length - 1 ];
      console.error('currPage')
      console.error(currPage)
      let prevPage = pages[ pages.length - 2 ];
      console.error('prevPage')
      console.error(prevPage)
      prevPage.setData({
        mCurrProvince: this.state.currProv,
        mCurrCity: this.state.currCity,
      })
      console.error('selectNewCity(), this.state.currCity, '
          + this.state.currCity)
      Taro.navigateBack()
    }
  }

  onCityChanged = (e) => {
    console.error("onCityChanged, " + e.detail.value)
    console.error("onCityChanged, " + String(e.detail.value).split(","))
    Util.printObj(e.detail)
    let valItem = String(e.detail.value).split(",")
    let province = valItem[0]
    let city = valItem[1]

    this.setState({
      currProv: province,
      currCity: city,
    })
  }

  selectHotCity = (prov, city, e) => {
    this.setState({
      currProv: prov,
      currCity: city,
    })
    // this.requestCityData(prov)
  }

  render () {
    const selectedStyle = {
      'color': '#8AC007',
    }

      let hotCityList = [[['北京市','北京市'], ['上海市', '上海市'], ['广东省', '深圳市']],
        [['广东省', '广州市'], ['重庆市', '重庆市'], ['天津市', '天津市']],
        [['江苏省', '苏州市'], ['四川省', '成都市'], ['湖北省', '武汉市']],
        [['浙江省', '杭州市'], ['江苏省', '南京市'], ['山东省', '青岛市']]]
      let hotCityItems = (<View>
          {hotCityList.map((citys) =>
            <View className='hot-city-row-container'>
            <Text className='hot-city-item' style={citys[0][1] == this.state.currCity ? selectedStyle : ''} onClick={this.selectHotCity.bind(this, citys[0][0], citys[0][1])}>{citys[0][1]}</Text>
            <Text className='hot-city-item' style={citys[1][1] == this.state.currCity ? selectedStyle : ''} onClick={this.selectHotCity.bind(this, citys[1][0], citys[1][1])}>{citys[1][1]}</Text>
            <Text className='hot-city-item' style={citys[2][1] == this.state.currCity ? selectedStyle : ''} onClick={this.selectHotCity.bind(this, citys[2][0], citys[2][1])}>{citys[2][1]}</Text>
            </View>
          )}
          </View>)

    return (
      <View className="top-view">
        {Util.isH5() &&
          <FixedTitle title="选择城市" />}
        <View className='city-container'>
          <View className='curr-city-container'>
            当前城市
            <View className='hot-city-row-container'>
              <Text className='hot-city-item' onClick={this.selectHotCity} style={selectedStyle}>{this.state.currCity}</Text>
              <Picker mode='region' className='hot-city-item'onChange={this.onCityChanged}>点击选择</Picker> 
              <View className='icon-city-location' onClick={this.getGeolocationCity}>
                {!Util.isAlipay() &&
                  <AtIcon onClick={this.getGeolocationCity} value='map-pin'
                    color= '#F00' size='15' />
                }
                {Util.isAlipay() &&
                  <View className='at-icon at-icon-map-pin'></View>
                }
              </View>
            </View>
          </View>
          <View className='hot-city-container'>
            热点城市
            {hotCityItems}
          </View>
          <View className="cl-button-container">
              <Button type='default' onClick={this.onButtonClicked.bind(this, 1)}>重 置</Button>
              <Button type='default' onClick={this.onButtonClicked.bind(this, 2)}>取 消</Button>
              <Button type='primary' onClick={this.onButtonClicked.bind(this, 3)}>确 定</Button>
          </View>
        </View>
        <PageFooter />
      </View>
    )
  }
}
