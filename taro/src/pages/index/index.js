import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import Welcome from './welcome'
import Clock from './clock'
import Toggle from './toggle'

import './index.scss'
import namedJson from './1.json'
import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

// import get from '@common/interceptor'

import { SERVER_HOST } from '../common/const'

export default class Index extends Component {

  constructor(props) {
    super(props)
    const events = new Events()
    // events.on('click_button', this.click_button.bind(this))
    this.state = {isOn: false, message: "",
      rhList: [
        {name: "name1", address: "address1", images: "@images/index/1.jpeg"},
        {name: "name2", address: "address2", images: "@images/index/1.jpeg"},
      ],
      title_image: ""
    }
  }

  componentWillMount() {
    Taro.request({
      url: SERVER_HOST + '/show_rh_list',
      // url: 'http://10.129.192.204:10001' + '/show_rh_list',
      success: (res) => {
        console.log(res.data.records)
        Taro.showToast({title: res.data.records[0].title_image})
        this.setState({
            message: 'success',
            rhList: res.data.records,
        })
      },
      fail: (error) => {
        console.error('bdg-error')
        this.setState({message: 'hello'})
        Taro.showToast({title: 'fail'})
      },
      complete: () => {
        // Taro.showToast({title: "complete"})
      },
    })//.then(res => Taro.showToast({title: "1111"}))
  }

  click_button (rh_id, e) {
    Taro.showToast({title: String(rh_id)})
    Taro.navigateTo({
      url: '/pages/rhdetail/rhdetail?rh_id=' + String(rh_id),
    })

    Taro.showNavigationBarLoading();
  }

  render () {
    const { rhList } = this.state
    const restHomeList = (
          <View className='rh-list-container'>
          {rhList.map((rh) =>
            <View className='rh-one-container' onClick={this.click_button.bind(this, rh.id)}>
              <Image src={rh.title_image} className='rh-one-img'/>
              <View className='rh-one-desc-container'>
                <Text className='rh-one-desc-head'>{rh.name}</Text>
                <Text className='rh-one-desc'>{rh.address}</Text>
                <Text className='rh-one-desc'>{rh.id}</Text>
              </View>
            </View>
          )}
          </View>
        )
    return (
      <View className='top-container'>
        <View className='top-title-top-container'>
          <View className='top-title-container'>
            <Image className='top-title-back' src={namedPng} />
            <Text className='top-title-city'> city </Text>
            <Input type='text' placeholder='' className='top-title-input' />
            <Image className='top-title-menu' src={namedPng} />
          </View>
          <View className='classify-title-container'>
            <Text className='classify-title-item'> 价格 </Text>
            <Text className='classify-title-item'> 床位数 </Text>
            <Text className='classify-title-item'> 类型 </Text>
            <Text className='classify-title-item'> 性质 </Text>
          </View>
        </View>
        {restHomeList}
        <View className='rh-list-container'>
          <View className='rh-one-container' onClick={this.click_button.bind(this)}>
            <Image src={namedPng} className='rh-one-img'/>
            <View className='rh-one-desc-container'>
              <Text className='rh-one-desc-head'> my red</Text>
              <Text className='rh-one-desc'> my red</Text>
              <Text className='rh-one-desc'> my red</Text>
            </View>
          </View>
          <View className='rh-one-container' onClick={this.click_button.bind(this)}>
            <Image src="http://10.129.192.204/images/17169/title/1921451205.JPG" className='rh-one-img'/>
            <View className='rh-one-desc-container'>
              <Text className='rh-one-desc-head'> my red</Text>
              <Text className='rh-one-desc'> my red</Text>
              <Text className='rh-one-desc'> my red</Text>
            </View>
          </View>
          <Navigator url='html' className='rh-one-container'>
          <View className='rh-one-container'>
            <Image src={namedPng} className='rh-one-img'/>
            <View className='rh-one-desc-container'>
              <Text className='rh-one-desc-head'> my red</Text>
              <Text className='rh-one-desc'> my red</Text>
              <Text className='rh-one-desc'> my red</Text>
            </View>
          </View>
          </Navigator>
        </View>
      </View>
    )
  }
}
