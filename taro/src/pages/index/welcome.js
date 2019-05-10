import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class Welcome extends Component {
  static externalClasses = ['my-class']
  render () {
    return (
      <View>
        Welcome
        <View>
        <Text className='red-text'>
          hello {this.props.name}, this is from Welcome!
        </Text>
        </View>
      </View>
    )
  }
}
