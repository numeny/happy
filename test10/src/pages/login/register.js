import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtButton } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";
import "../../../node_modules/taro-ui/dist/style/components/button.scss";

import { SERVER_HOST } from '@util/const'
import { CommonFunc } from '../common/errorcode'

import './register.scss'
import FixedTitle from '../common/fixedtitle'
import PageFooter from '../common/pagefooter'

import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

export default class Register extends Component {

  config: Config = {
    navigationBarTitleText: '注册新用户',
  }

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      password2: '',
    }
  }

  onInputUserNameChange = (e) =>  {
    this.setState({
      username: e.target.value,
    })
  }

  onInputPasswordChange = (e) =>  {
    this.setState({
      password: e.target.value,
    })
  }

  onInputPasswordChange2 = (e) =>  {
    this.setState({
      password2: e.target.value,
    })
  }

  checkUsername = (username) =>  {
    return username.length != 0
  }

  checkPassword = (password, password2) =>  {
    if (password.length == 0) {
      Taro.showToast({title: '请输入密码！'})
      return false
    }
    if (password2.length == 0) {
      Taro.showToast({title: '请再次输入密码！'})
      return false
    }
    if (password != password2) {
      Taro.showToast({title: '两次输入密码不一致！'})
      return false;
    }
    return true;
  }

  onSubmit = (e) =>  {
    if (!this.checkUsername(this.state.username)) {
      Taro.showToast({title: '请输入用户名！'})
      return
    }
    if (!this.checkPassword(this.state.password, this.state.password2)) {
      return
    }

    Taro.request({
      url: SERVER_HOST + '/registerUser?username=' + this.state.username + "&password=" + this.state.password,
      success: (res) => {
        console.log(res.data)
        Taro.showToast({title: String(res.data.ret)})
        Taro.showToast({title: CommonFunc.getErrorString(res.data.ret)})

        this.setState({
        })
      },
      fail: (error) => {
        console.error('bdg-error')
        Taro.showToast({title: 'fail'})
      },
      complete: () => {
        // Taro.showToast({title: "complete"})
      },
    })
  }

  onChangePassword = (e) =>  {
  }

  render () {
    return (
      <View className="reg-top-view">
      <Video width='150px' height='190px' src={namedVideo} />
      <Image src={namedPng} />
      <FixedTitle title="注册新用户" />
      <View className="reg-top-view-1">
        <View className='reg-input-container'>
          <Input type='text' placeholder='请输入手机号码' className='reg-input-username' onInput={this.onInputUserNameChange} />
          <Input type='password' placeholder='输入密码' onInput={this.onInputPasswordChange} />
          <Input type='password' placeholder='再次输入密码' onInput={this.onInputPasswordChange2} />
        </View>
        <View onClick={this.onSubmit} className='reg-input-submit'>注 册</View>
        <View className='reg-register-container'>
          <Text onClick={this.onChangePassword} className='reg-input-change-password'>忘记密码</Text>
        </View>
      </View>
      <PageFooter />
      </View>
    )
  }
}
