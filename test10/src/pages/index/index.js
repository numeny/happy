import Taro, { Component, Events, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'
import './index.scss'
import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

import { SERVER_HOST } from '../common/const'
import { DEFAULT_IMG } from '../common/const'
import { ICON_IMG } from '../common/const'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }
  constructor(props) {
    super(props)
    const events = new Events()
    this.state = {isOn: false, message: "",
      rhList: [
        {name: "name1", address: "address1"},
        {name: "name2", address: "address2"},
      ],
      title_image: "",

      selectorPrice: ['不限', '0-1000', '1000-2000', '2000-3000', '3000-4000'],
      selectorPriceChecked: '不限',
      selectorBednum: ['不限', '0-50', '50-100', '100-200', '200-300', '300-500', '500-1000', '1000以上'],
      selectorBednumChecked: '不限',
      selectorType: ['不限', '老年公寓', '养老照料中心', '护理院', '其他'],
      selectorTypeChecked: '不限',
      selectorProp: ['不限', '民营机构', '国营机构', '公建民营', '民办公助', '其他'],
      selectorPropChecked: '不限',
    }
  }

  componentWillMount() {
    Taro.request({
      url: SERVER_HOST + '/show_rh_list',
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
    })
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onChangePrice = e => {
    this.setState({
      selectorPriceChecked: this.state.selectorPrice[e.detail.value]
    })
  }

  onChangeBednum = e => {
    this.setState({
      selectorBednumChecked: this.state.selectorBednum[e.detail.value]
    })
  }

  onChangeType = e => {
    this.setState({
      selectorTypeChecked: this.state.selectorType[e.detail.value]
    })
  }

  onChangeProp = e => {
    this.setState({
      selectorPropChecked: this.state.selectorProp[e.detail.value]
    })
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
              <Image src={rh.title_image != "" ? rh.title_image : DEFAULT_IMG} className='rh-one-img'/>
              <View className='rh-one-desc-container'>
                <Text className='rh-one-desc-head'>{rh.name}</Text>
                <Text className='rh-one-desc'>{rh.address}</Text>
                <Text className='rh-one-desc'>{rh.bednum_int}个床位</Text>
              </View>
            </View>
          )}
          </View>
        )
    return (
      <View className='top-container'>
        <Video width='150px' height='190px' src={namedVideo} />
        <View className='location-select-container'>
        </View>
        <View className='top-title-top-container'>
          <View className='top-title-container'>
            <Image className='top-title-back' src={namedPng} />
            <Text className='top-title-city'> city </Text>
            <Input type='text' placeholder='' className='top-title-input' />
            <Image className='top-title-menu' src={namedPng} />
          </View>
          <View className='classify-title-container'>
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
        </View>
      </View>
    )
  }
}
