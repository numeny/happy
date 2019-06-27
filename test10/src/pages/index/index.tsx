import Taro, { Component, Events, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'
import './index.scss'
import namedPng from '@images/index/1.jpeg'
import { SERVER_HOST } from '../common/const'

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
    // events.on('click_button', this.click_button.bind(this))
    this.state = {isOn: false, message: "",
      rhList: [
        {name: "name1", address: "address1"},
        {name: "name2", address: "address2"},
      ]
      title_image: ""
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
  click_button (rh_id, e) {
    /*
    */
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
                <Text className='rh-one-desc'>{rh.bednum_int}个床位</Text>
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
