import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

import './pagefooter.scss'
import { Util } from '@util/util'

export default class PageFooter extends Component {

  constructor(props) {
    super(props)
    this.state = {
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

  render () {

    return (
      <View className='pagefooter-top-view'>
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
