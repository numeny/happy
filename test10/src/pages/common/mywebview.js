import Taro, { Component } from '@tarojs/taro'
// 引入 WebView 组件
import { WebView } from '@tarojs/components'

export default class MywebView extends Component {
  componentWillMount () {
    // FIXME
    Taro.showToast({title: "componentWillMount: " + this.$router.params.url})
  }
  render () {
    return (
      <WebView src={this.$router.params.url} />
    )
  }
}
