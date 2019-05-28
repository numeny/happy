import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import namedPng from '@images/index/1.jpeg'

import { SERVER_HOST } from '../common/const'

export default class Rhdetail extends Component {

  constructor(props) {
    super(props)
    this.state = { rhId : this.$router.params.rh_id }
  }

  componentDidMount () {
    Taro.showToast({title: String(this.state.rhId)})
    Taro.request({
      url: SERVER_HOST + '/get_rh_detail?rhid=' + String(this.state.rhId),
      success: (res) => {
        console.log(res.data.records)
        Taro.showToast({title: res.data.record.name})
      },
      fail: (error) => {
        console.error('bdg-error')
        Taro.showToast({title: 'fail'})
      },
      complete: () => {
        // Taro.showToast({title: "complete"})
      },
    })//.then(res => Taro.showToast({title: "1111"}))
  }

  render () {
    return (
      <View>
        <View>
        rh_id: {this.state.rhId}
        </View>
        <Swiper indicatorColor='#999' indicatorActiveColor='#333'
                circular indicatorDots autoplay>
          <SwiperItem>
            <Image src={namedPng} width="100%" />
          </SwiperItem>
          <SwiperItem>
            <Image src={namedPng} width="100%" />
          </SwiperItem>
          <SwiperItem>
            <Image src={namedPng} width="100%" />
          </SwiperItem>
        </Swiper>
        <View className='title-container'>
          <View>
            <Text className='title-item'> title </Text>
          </View>
          <View>
            <Text> address </Text>
          </View>
        </View>
      </View>
    )
  }
}
