import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator, ScrollView } from '@tarojs/components'
import { AtIcon } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import './favicon.scss'

import { CommonFunc } from '@util/common_func'

import { connect } from '@tarojs/redux'
import { update, addFavList, delFavList } from '../../actions/counter'

@connect((state) => {
  return { prop_counter: state.counter }
}, (dispatch) => ({
  addFavListProp (rhId) {
    console.error('addFavList, surccess, ' + rhId)
    dispatch(addFavList([rhId]))
  },
  delFavListProp (rhId) {
    console.error('delFavList, surccess, ' + rhId)
    dispatch(delFavList([rhId]))
  },
}))

export default class FavIcon extends Component {

  constructor(props) {
    super(props)
    this.state = {
      rhIdProp : this.props.rhId,
    }
  }

  componentDidMount () {
  }

  onFavorite = (rhId, isFavorite, e) => {
    console.error('onFavorite, rhId: ' + rhId)
    CommonFunc.onFavorite(rhId, isFavorite, e).then(res => {
      console.error('onFavorite, surccess')
      if (isFavorite) {
        this.props.addFavListProp(rhId)
      } else {
        this.props.delFavListProp(rhId)
      }
    }).catch(error => {
      console.error('onFavorite, error')
      console.error(error)
    })
  }

  render () {
    return (
      <View>
        {this.props.prop_counter.rhFavList.indexOf(this.state.rhIdProp) != -1 ?
          <AtIcon value='heart-2' color= '#F00' size='15' onClick={this.onFavorite.bind(this, this.state.rhIdProp, false)} /> :
          <AtIcon value='heart' size='15' onClick={this.onFavorite.bind(this, this.state.rhIdProp, true)} />}
      </View>
    )
  }
}
