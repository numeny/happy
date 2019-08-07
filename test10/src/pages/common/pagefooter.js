import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './pagefooter.scss'

export default class PageFooter extends Component {

  onNavigateToAboutUs (idx, e) {
    Taro.navigateTo({
      url: '/pages/aboutus/aboutus?idx=' + idx,
    })
  }

  render () {
    return (
      <View className='pagefooter-top-view'>
        <View className='about-us-container'>
          <Text className='about-us' onClick={this.onNavigateToAboutUs.bind(this, 0)}>关于我们</Text>
          <Text className='about-us' onClick={this.onNavigateToAboutUs.bind(this, 1)}>联系我们</Text>
          <Text className='about-us' onClick={this.onNavigateToAboutUs.bind(this, 2)}>网站声明</Text>
          <Text className='about-us' onClick={this.onNavigateToAboutUs.bind(this, 3)}>机构入驻</Text>
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
