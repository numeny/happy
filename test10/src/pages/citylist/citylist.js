import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtButton } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";
import "../../../node_modules/taro-ui/dist/style/components/button.scss";

import { SERVER_HOST } from '../common/const'

import './citylist.scss'


import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

export default class Citylist extends Component {

  constructor(props) {
    super(props)
    this.state = {
      // currProv : this.props.currProv,
      currProv : '北京市',
      currCity : '北京市',
      selectedProv : '北京市',
      selectedCity : '北京市',
      currCityItems : [],
    }
  }

  componentWillMount() {
    let currProv = this.state.currProv
    let currCity = this.state.currCity
    console.error("componentWillMount-2, this.$router.params: " + this.$router.params);
    if (this.$router.params.prov != null
        && this.$router.params.prov.length > 0
        && this.$router.params.city != null
        && this.$router.params.city.length > 0) {
      console.error("componentWillMount-3, this.$router.params: " + this.$router.params);
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
    let url = SERVER_HOST + '/arealist' + ((prov.length > 0) ? ("?prov=" + prov) : "")
    Taro.request({
      url: url,
      success: (res) => {
        console.error("currCityItems: " + res.data)

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
        })
      },
      fail: (error) => {
        console.error("fail")
      /*
        console.error('bdg-error')
        this.setState({message: 'hello'})
        Taro.showToast({title: 'fail'})
        */
      },
      complete: () => {
        console.error("complete")
        // Taro.showToast({title: "complete"})
      },
    })
  }

  requestRhList = (prov, city) => {
    let addedUrl = (prov.length > 0) ? ('?prov=' + prov) : ''
    if(city.length > 0) {
      addedUrl = addedUrl + (addedUrl.length > 0 ? '&' : '?') + 'city=' + city
    }

    Taro.navigateTo({
      url: '/pages/index/index' + addedUrl,
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
      this.showAreaListImpl('')
    } else if (idx == 2) {
    } else if (idx == 3) {
      this.requestRhList(this.state.selectedProv, this.state.selectedCity)
    }
  }

  selectArea (area, e) {
    console.error("selectArea, this.state.selectedProv: area: " + area
        + ", this.state.selectedProv: " + this.state.selectedProv
        + ", this.state.selectedProv: " + this.state.selectedProv
        )
    if (this.state.selectedProv.length > 0) {
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

  render () {
    let cityItems = (<View>
        {this.state.currCityItems.map((citys) =>
            <View className='hot-city-row-container'>
              <Text className='hot-city-item' onClick={this.selectArea.bind(this, citys[0])}>{citys[0]}</Text>
              <Text className='hot-city-item' onClick={this.selectArea.bind(this, citys[1])}>{citys[1]}</Text>
              <Text className='hot-city-item' onClick={this.selectArea.bind(this, citys[2])}>{citys[2]}</Text>
            </View>
        )}
        </View>)

    return (
      <View className="top-view">
        <Video width='150px' height='190px' src={namedVideo} />
        <Image src={namedPng} />
        <View className='title'>
          <View className='at-icon at-icon-chevron-left back-icon'></View>
          <View className='title-select-city'>选择城市</View>
        </View>
        <View className='city-container'>
          <View className='curr-city-container'>
            当前城市
            <View className='curr-city'>{this.state.currCity}</View>
          </View>
          <View className='hot-city-container'>
            热点城市
            <View className='hot-city-row-container'>
              <Text className='hot-city-item'>北京市</Text>
              <Text className='hot-city-item'>上海市</Text>
              <Text className='hot-city-item'>深圳市</Text>
            </View>
            <View className='hot-city-row-container'>
              <Text className='hot-city-item'>广州市</Text>
              <Text className='hot-city-item'>天津市</Text>
              <Text className='hot-city-item'>杭州市</Text>
            </View>
            <View className='hot-city-row-container'>
              <Text className='hot-city-item'>广州市</Text>
              <Text className='hot-city-item'>天津市</Text>
              <Text className='hot-city-item'>杭州市</Text>
            </View>
          </View>
          <View className='hot-city-container'>
            <View>选择城市</View>
            <Text className='selected-area' onClick={this.showAreaList.bind(this, '')}>全国</Text>
            {this.state.selectedProv.length > 0 &&
            <Text>
            -><Text className='selected-area' onClick={this.showAreaList.bind(this, this.state.selectedProv)}>{this.state.selectedProv}</Text>
              {this.state.selectedCity.length >0 && 
              <Text>
              -><Text className='selected-area'>{this.state.selectedCity}</Text>
              </Text>
              }
            </Text>
             }
            <View className="button-container">
            <AtButton onClick={this.onButtonClicked.bind(this, 1)} className="button" size='small' type='secondary'>重置</AtButton>
            <AtButton onClick={this.onButtonClicked.bind(this, 2)} className="button" size='small' type='secondary'>取消</AtButton>
            <AtButton onClick={this.onButtonClicked.bind(this, 3)} className="button" size='small' type='primary'>确定</AtButton>
            </View>
          </View>
          {cityItems}
        </View>
      </View>
    )
  }
}
