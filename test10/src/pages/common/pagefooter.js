import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './pagefooter.scss'
import { PAGE_FOOTER_MENU } from '../common/const'

export default class PageFooter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      showAboutMenu: (this.props.showAboutMenu != null && this.props.showAboutMenu == 'false' ? false : true) ,
    }
  }

  onNavigateToAboutUs (idx, e) {
    if (idx == 0) {
      // first item is '首页'
      Taro.navigateTo({
        url: '/pages/index/index',
      })
    } else {
      Taro.navigateTo({
        url: '/pages/aboutus/aboutus?idx=' + idx,
      })
    }
  }

  render () {
    const menuViews = (<View className='about-us-container'>
        {PAGE_FOOTER_MENU.map((value, index) =>
          <Text className='about-us' onClick={this.onNavigateToAboutUs.bind(this, index)}>{value}</Text>
        )}
        </View>)

    return (
      <View className='pagefooter-top-view'>
        {this.state.showAboutMenu && menuViews}
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
