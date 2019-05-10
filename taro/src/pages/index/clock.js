import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class Clock extends Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date() }
    this.timeId = setInterval(
      () => this.tick(),
      1000
    )
  }
  tick() {
    this.setState({date: new Date()})
  }
  render () {
    return (
      <View>
        Clock
        <Text>
          <View>
          <Text className='red-text'>
            {this.state.date.toLocaleTimeString()}.
          </Text>
          </View>
        </Text>
      </View>
    )
  }
}
