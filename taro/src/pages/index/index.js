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

export default class Index extends Component {

  constructor(props) {
    super(props)
    const events = new Events()
    // events.on('click_button', this.click_button.bind(this))
    this.state = {isOn: false, message: "",
      rhList: [
        {name: "name1", address: "address1"},
        {name: "name2", address: "address2"},
      ]
    }
  }

  click_button (e) {
    let b = this.state.isOn

    // url: 'http://127.0.0.1:8000/show_rh_list?page=1',
    Taro.request({
      url: 'http://10.129.192.204:10001/show_rh_list',
      success: (res) => {
        console.log(res.data.records)
        Taro.showToast({title: res.data.records[1].name})
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
    // }).then(res => this.setState({message: "hello"}))
    // }).then(res => console.error(res.data))
    // get('http://127.0.0.1:8000/show_rh_list?page=1')

    // Taro.navigateTo({url: '/pages/rhdetail/rhdetail'})

    this.setState({isOn: !b})
    // this.setState({message: "hello"})
    Taro.showNavigationBarLoading();
  }

  onClick () {
    Taro.showToast({title: "onClick"})
    const events = new Events()
    events.trigger('click_button')
  }

  render () {
    const { rhList } = this.state
    const restHomeList = (
          <View className='rh-list-container'>
          {rhList.map((rh) =>
            <View className='rh-one-container' onClick={this.click_button.bind(this)}>
              <Image src={namedPng} className='rh-one-img'/>
              <View className='rh-one-desc-container'>
                <Text className='rh-one-desc-head'>{rh.name}</Text>
                <Text className='rh-one-desc'>{rh.address}</Text>
                <Text className='rh-one-desc'> my red</Text>
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
            <Image src={namedPng} className='rh-one-img'/>
            <View className='rh-one-desc-container'>
              <Text className='rh-one-desc-head'> my red</Text>
              <Text className='rh-one-desc'> my red</Text>
              <Text className='rh-one-desc'> my red</Text>
            </View>
          </View>
          <Navigator url='/pages/rhdetail/rhdetail' className='rh-one-container'>
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
