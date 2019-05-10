import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import namedPng from '@images/index/1.jpeg'

export default class Rhdetail extends Component {

  constructor(props) {
    super(props)
  }

  render () {
    return (
      <View>
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
