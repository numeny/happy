import Taro, { Component } from '@tarojs/taro'
// 引入 WebView 组件
import { WebView } from '@tarojs/components'

export default class MywebView extends Component {
  componentWillMount () {}
  render () {
    return (
      <WebView src={this.$router.params.url} />
    )
  }
}
