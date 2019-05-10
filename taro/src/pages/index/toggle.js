import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'

export default class Toggle extends Component {
  constructor (props) {
    super(props)
    this.state = {isToggleOn: true}
  }

  onClick (e) {
  // onClick (willOn, e) {
    // this.setState({isToggleOn: willOn})
    e.stopPropagation()
    let newState = !this.state.isToggleOn

    this.setState({isToggleOn: newState})
    /* NO FUNCTION
    this.setState(prevState => {
      isToggleOn: !prevState.isToggleOn
    })
    */
    /*
    */
  }

  render () {
    return (
      <View>
        <Button size='mini' type='warn' onClick={this.onClick.bind(this)}>
          {this.state.isToggleOn ? 'ON' : 'OFF'}
        </Button>
        {this.state.isToggleOn ? <View>login</View> : <View>logout</View>}
      </View>
    )
  }
}
