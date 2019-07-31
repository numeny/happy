import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './pagefooter.scss'

export default class PageFooter extends Component {

  render () {
    return (
      <View className='pagefooter-top-view'>
        <View className='about-us-container'>
          <Text className='about-us'>关于我们</Text>
          <Text className='about-us'>联系我们</Text>
          <Text className='about-us'>网站声明</Text>
          <Text className='about-us'>机构入驻</Text>
        </View>
        <View className='copyright-container'>
          Copyright@老玩童 All Rights Reserved
        </View>
        <View className='copyright-container'>
          京ICP备xxxxxxxxx号 京公网安备xxxxxxxxxx号
        </View>
      </View>
    )
  }
}
