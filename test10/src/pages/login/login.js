import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtButton } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";
import "../../../node_modules/taro-ui/dist/style/components/button.scss";

import { SERVER_HOST } from '../common/const'
import { CommonFunc } from '../common/errorcode'

import './login.scss'
import FixedTitle from '../common/fixedtitle'
import PageFooter from '../common/pagefooter'

import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

export default class Login extends Component {

  config: Config = {
    navigationBarTitleText: '登录',
  }

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
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

  checkUsername = (username) =>  {
    return username.length != 0
  }

  checkPassword = (password) =>  {
    return password.length != 0
  }

  onSubmit = (e) =>  {
    if (!this.checkUsername(this.state.username)) {
      Taro.showToast({title: '请输入用户名！'})
      return
    }
    if (!this.checkPassword(this.state.password)) {
      Taro.showToast({title: '请输入密码！'})
      return
    }

    Taro.request({
      url: SERVER_HOST + '/login?username=' + this.state.username + "&password=" + this.state.password,
      success: (res) => {
        console.log("res.data:")
        console.log(res.data)
        Taro.showToast({title: String(res.data.return)})
        Taro.showToast({title: CommonFunc.getErrorString(res.data.return)})

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

  onRegister = (e) =>  {
    Taro.navigateTo({
      url: '/pages/login/register',
    })
  }

  onChangePassword = (e) =>  {
  }

  render () {
    return (
      <View className="login-top-view">
      <Video width='150px' height='190px' src={namedVideo} />
      <Image src={namedPng} />
      <FixedTitle title="用户登录" />
      <View className="login-top-view-1">
        <View className='login-input-container'>
          <Input type='text' placeholder='请输入手机号码' className='login-input-username' onInput={this.onInputUserNameChange} />
          <Input type='password' placeholder='输入密码' onInput={this.onInputPasswordChange} />
        </View>
        <View onClick={this.onSubmit} className='login-input-submit'>登 录</View>
        <View className='login-register-container'>
          <Text onClick={this.onChangePassword} className='login-input-change-password'>忘记密码</Text>
          <Text onClick={this.onRegister} className='login-input-register'>注册新用户</Text>
        </View>
      </View>
      <PageFooter />
      </View>
    )
  }
}
