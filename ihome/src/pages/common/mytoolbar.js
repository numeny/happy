import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { AtIcon } from 'taro-ui'

import './mytoolbar.scss'

import { Util } from '@util/util'
import { Log } from '@util/log'

// FIXME, TODO: add to index.js
export const ToolbarItem = {
  CalcFirstPayment: 0,
  CalcLoan: 1,
}

export default class Toolbar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      mCurrIdx: this.props.initPage != null ? this.props.initPage : ToolbarItem.CalcFirstPayment,
      mItems: [
        // CalcFirstPayment
        {text: '计算首付', icon: 'home'},
        // CalcLoan
        {text: '计算房贷', icon: 'money'},
      ],
    }
  }

  onClickItem = (idx, e) => {
    Log.log('onClickItem, idx: ' + idx)
    this.setState({
      mCurrIdx: idx,
    })
    if (this.props.onItemChanged != null) {
      this.props.onItemChanged(idx)
    }
  }

  render () {
    return (
      <View className='mtb-top-view'>
        {this.state.mItems.map((item, i) => {
          return (
              <View className={this.state.mCurrIdx == i ? 'mtb-item-selected' : 'mtb-item-unselected'} onClick={this.onClickItem.bind(this, i)}>
                <AtIcon value={item.icon} size='15' color={this.state.mCurrIdx == i ? '#F00' : '#000'} />
                <View className='mtb-item-icon'>{item.text}</View> 
              </View>)
          })}
      </View>
    )
  }
}
