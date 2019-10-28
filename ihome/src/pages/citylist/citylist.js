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
      currProv : '北京市',
      currCity : '北京市',
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
    }
    this.setState({
      currProv: currProv,
      currCity: currCity,
    })
  }

  /*
  getGeolocationCity = (e) => {
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
  }
  */

  onButtonClicked = (idx, e) => {
    if (idx == 1) {
      // 取消
      Taro.navigateBack()
    } else if (idx == 2) {
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
      let pages = Taro.getCurrentPages();
      // let currPage = pages[ pages.length - 1 ];
      let prevPage = pages[ pages.length - 2 ];
      prevPage.setData({
        mCurrProvince: this.state.currProv,
        mCurrCity: this.state.currCity,
      })
      Taro.navigateBack()
    }
  }

  onCityChanged = (e) => {
    // Util.printObj(e.detail)
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
  }
  /*
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
     */

  render () {
    const selectedStyle = {
      'color': '#8AC007',
    }

      let hotCityList = [[['北京市','北京市'], ['上海市', '上海市'], ['广东省', '深圳市']],
        [['广东省', '广州市'], ['重庆市', '重庆市'], ['天津市', '天津市']]
        /* [['江苏省', '苏州市'], ['四川省', '成都市'], ['湖北省', '武汉市']],
        [['浙江省', '杭州市'], ['江苏省', '南京市'], ['山东省', '青岛市']]*/]
      let hotCityItems = (<View>
          {hotCityList.map((citys) =>
            <View className='hot-city-row-container'>
            <Text className='hot-city-item' style={citys[0][1] == this.state.currCity ? selectedStyle : ''} onClick={this.selectHotCity.bind(this, citys[0][0], citys[0][1])}>{citys[0][1]}</Text>
            <Text className='hot-city-item' style={citys[1][1] == this.state.currCity ? selectedStyle : ''} onClick={this.selectHotCity.bind(this, citys[1][0], citys[1][1])}>{citys[1][1]}</Text>
            <Text className='hot-city-item' style={citys[2][1] == this.state.currCity ? selectedStyle : ''} onClick={this.selectHotCity.bind(this, citys[2][0], citys[2][1])}>{citys[2][1]}</Text>
            </View>
          )}
          </View>)

    //    <PageFooter />
    return (
      <View className="top-view">
        {Util.isH5() &&
          <FixedTitle title="选择城市" />}
        <View className='city-container'>
          <View className='curr-city-container'>
            当前城市
            <View className='hot-city-row-container'>
              <Text className='hot-city-item' onClick={this.selectHotCity} style={selectedStyle}>{this.state.currCity}</Text>
              <Picker mode='region' className='city-picker' onChange={this.onCityChanged}>点击选择</Picker> 
            </View>
          </View>
          <View className='hot-city-container'>
            热点城市
            {hotCityItems}
          </View>
          <View className="cl-button-container">
              <Button className="cl-button-item" type='default' onClick={this.onButtonClicked.bind(this, 1)}>取 消</Button>
              <Button className="cl-button-item" type='primary' onClick={this.onButtonClicked.bind(this, 2)}>确 定</Button>
          </View>
        </View>
      </View>
    )
  }
}
