import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './pagefooter.scss'
import { PAGE_FOOTER_MENU, ABOUT_US_MENU, HOME_URL } from '@util/const'
import { Util } from '@util/util'

export default class PageFooter extends Component {

  constructor(props) {
    super(props)
    this.state = {
      stateShowAboutMenu: (this.props.showAboutMenu != null && this.props.showAboutMenu == 'false' ? false : true),
      stateShowHomePageItem: (!Util.isH5()
                              || (this.props.showHomePageItem != null
                              && this.props.showHomePageItem == 'false')
                                ? false : true),
    }
  }

  onTest = (e) => {
    if (!DEBUG) {
      return
    }
    console.log('onTest')
    Taro.navigateTo({
      url: '/pages/test/test',
    })
  }

  onNavigateToAboutUs (idx, e) {
    if (this.state.stateShowHomePageItem && idx == 0) {
      // first item is '首页'
      Taro.navigateTo({
        url: HOME_URL,
      })
    } else {
      Taro.navigateTo({
        url: '/pages/aboutus/aboutus?idx=' + (this.state.stateShowHomePageItem ? idx - 1: idx),
      })
    }
  }

  render () {
    const menuList = this.state.stateShowHomePageItem ? PAGE_FOOTER_MENU : ABOUT_US_MENU;
    const menuViews = (<View className='about-us-container'>
        {menuList.map((value, index) =>
          <Text className='about-us'
              onClick={this.onNavigateToAboutUs.bind(this, index)}>
            {value}
          </Text>
        )}
        </View>)

    return (
      <View className='pagefooter-top-view'>
        {this.state.stateShowAboutMenu && menuViews}
        <View className='copyright-container'>
          Copyright@老玩童 All Rights Reserved
        </View>
        <View className='copyright-container' onClick={this.onTest}>
          京ICP备xxxxxxxxx号 京公网安备xxxxxxxxxx号
        </View>
      </View>
    )
  }
}
