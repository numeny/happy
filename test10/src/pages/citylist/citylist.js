import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtIcon } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";
import "../../../node_modules/taro-ui/dist/style/components/button.scss";

import { SERVER_HOST } from '@util/const'

import './citylist.scss'
import FixedTitle from '../common/fixedtitle'
import PageFooter from '../common/pagefooter'
import { CommonFunc } from '../../util/common_func'

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
      selectedProv : '北京市',
      selectedCity : '北京市',
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
        currProv: this.$router.params.prov,
        currCity: this.$router.params.city,
        selectedProv : this.$router.params.prov,
        selectedCity : this.$router.params.city,
      })
    }
    this.requestCityData(currProv)
  }

  requestCityData = (prov) => {
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
  }

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

  showAreaList (prov, e) {
    this.showAreaListImpl(prov)
  }

  showAreaListImpl (prov) {
    this.requestCityData(prov)
    this.setState({
        selectedProv: prov,
        selectedCity: '',
    })
  }

  onButtonClicked (idx, e) {
    if (idx == 1) {
      // 重置
      this.showAreaListImpl('')
    } else if (idx == 2) {
      // 取消
      Taro.navigateBack()
    } else if (idx == 3) {
      // 确定
      if (this.state.selectedProv.length == 0) {
        // FIXME
        Taro.showToast({title: '请选省份!'})
      } else if (this.state.selectedCity.length == 0) {
        // FIXME
        Taro.showToast({title: '请选城市!'})
      } else {
        console.error('onButtonClicked: prov: '
            + this.state.selectedProv
            + ', city: ' + this.state.selectedCity)

        CommonFunc.selectNewCity(
            this.state.selectedProv, this.state.selectedCity)
      }
    }
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

  selectHotCity = (prov, city, e) => {
    this.setState({
        selectedProv: prov,
        selectedCity: city,
    })
    this.requestCityData(prov)
  }

  render () {
    const selectedStyle = {
      'color': '#8AC007',
    }

    let cityItems = (<View>
        {this.state.currCityItems.map((citys) =>
            <View className='hot-city-row-container'>
              <Text className='hot-city-item' style={citys[0] == this.state.selectedCity ? selectedStyle : ''} onClick={this.selectArea.bind(this, citys[0])}>{citys[0]}</Text>
              <Text className='hot-city-item' style={citys[1] == this.state.selectedCity ? selectedStyle : ''} onClick={this.selectArea.bind(this, citys[1])}>{citys[1]}</Text>
              <Text className='hot-city-item' style={citys[2] == this.state.selectedCity ? selectedStyle : ''} onClick={this.selectArea.bind(this, citys[2])}>{citys[2]}</Text>
            </View>
        )}
        </View>)

      let hotCityList = [[['北京市','北京市'], ['上海市', '上海市'], ['广东省', '深圳市']],
        [['广东省', '广州市'], ['重庆市', '重庆市'], ['天津市', '天津市']],
        [['江苏省', '苏州市'], ['四川省', '成都市'], ['湖北省', '武汉市']],
        [['浙江省', '杭州市'], ['江苏省', '南京市'], ['山东省', '青岛市']]]
      let hotCityItems = (<View>
          {hotCityList.map((citys) =>
              <View className='hot-city-row-container'>
              <Text className='hot-city-item' style={citys[0][1] == this.state.selectedCity ? selectedStyle : ''} onClick={this.selectHotCity.bind(this, citys[0][0], citys[0][1])}>{citys[0][1]}</Text>
              <Text className='hot-city-item' style={citys[1][1] == this.state.selectedCity ? selectedStyle : ''} onClick={this.selectHotCity.bind(this, citys[1][0], citys[1][1])}>{citys[1][1]}</Text>
              <Text className='hot-city-item' style={citys[2][1] == this.state.selectedCity ? selectedStyle : ''} onClick={this.selectHotCity.bind(this, citys[2][0], citys[2][1])}>{citys[2][1]}</Text>
              </View>
          )}
          </View>)

    return (
      <View className="top-view">
        {CommonFunc.isTaroEnvH5() &&
          <FixedTitle title="选择城市" />}
        <View className='city-container'>
          <View className='curr-city-container'>
            当前城市
            <View onClick={this.selectHotCity.bind(this, this.state.currProv, this.state.currCity)} className='curr-city'>
              <View className='curr-city-text'>{this.state.currCity}</View>
              <AtIcon onClick={this.getGeolocationCity} value='map-pin'
                  className='curr-city-loc' color= '#F00' size='15' />
            </View>
          </View>
          <View className='hot-city-container'>
            热点城市
            {hotCityItems}
          </View>
          <View className='hot-city-container'>
            <View>当前选择城市</View>
            <Text className='selected-area'
                    onClick={this.showAreaList.bind(this, '')}>全国</Text>
            {this.state.selectedProv.length > 0 &&
              <Text>
              -><Text className='selected-area' onClick={this.showAreaList.bind(this, this.state.selectedProv)}>{this.state.selectedProv}</Text>
                {this.state.selectedCity.length > 0 &&
                  <Text>
                  -><Text className='selected-area'>{this.state.selectedCity}</Text>
                  </Text>
                }
              </Text>}

            <View className="button-container">
              <View onClick={this.onButtonClicked.bind(this, 1)} className="button reset-button"><Text>重 置</Text></View>
              <View onClick={this.onButtonClicked.bind(this, 2)} className="button cancel-button"><Text>取 消</Text></View>
              <View onClick={this.onButtonClicked.bind(this, 3)} className="button confirm-button"><Text>确 定</Text></View>
            </View>
          </View>
          {cityItems}
        </View>
        <PageFooter />
      </View>
    )
  }
}
