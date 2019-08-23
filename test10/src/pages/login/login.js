import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtButton } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";
import "../../../node_modules/taro-ui/dist/style/components/button.scss";

import { SERVER_HOST, STORAGE_KEY_LOGIN, STORAGE_VALUE_LOGIN_SUCCESS, STORAGE_KEY_USER_NAME } from '../../util/const'
import { CommonFunc } from '@util/common_func'

import './login.scss'
import FixedTitle from '../common/fixedtitle'
import PageFooter from '../common/pagefooter'
import Rhlist from '../common/rhlist'

import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

import { connect } from '@tarojs/redux'
import { update } from '../../actions/counter'

@connect((state) => {
  return { prop_counter: state.counter }
}, (dispatch) => ({
  updateProp (rhFavList) {
    dispatch(update(rhFavList))
  },
}))

export default class Login extends Component {

  config: Config = {
    navigationBarTitleText: '登录',
  }

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',

      isLogin: false,
      loginedUsername: '',
    }
  }

  componentWillMount() {
    CommonFunc.getLoginedInfo().then(res => {
      console.log('componentWillMount-1, success, res: ' + res.username)
      this.setState({
        isLogin: true,
        loginedUsername: res.username,
      })
    }).catch(error => {
      console.log('componentWillMount-2, fail, error: ' + error)
      this.setState({
        isLogin: false,
        loginedUsername: '',
      })
    })
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

  onSubmit = (e) =>  {
    if (!CommonFunc.checkUsername(this.state.username)) {
      return
    }
    /*
    Taro.login({
      success (res) {
        if (res.code) {
          console.log('登录成功！' + res.code)
          //发起网络请求
          Taro.request({
            url: SERVER_HOST + '/weixinlogin?code=' + res.code,
            data: {
              code: res.code
            },
          }).then(res => {
            console.log('获取session_id成功！:' + res.data)
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
*/
    // CommonFunc.login(this.state.username, this.state.password)
/*
*/
    CommonFunc.loginForWeixin(this.state.username)
      .then(res => {
        console.log('onSubmit, success: ' + res)
        this.props.updateProp(res)
      }).catch(error => {
        console.log('onSubmit, error: ' + error)
      })
    /*
    if (!CommonFunc.checkUsername(this.state.username)) {
      return
    }
    if (!CommonFunc.checkPassword(this.state.password)) {
      return
    }
    CommonFunc.login(this.state.username, this.state.password)
      .then(res => {
          console.log('onSubmit, success: ' + res)
          // set user fav list, res is rhFavList
          this.props.updateProp(res)
      }).catch(error => {
          console.log('onSubmit, error: ' + error)
      })
    */
  }

  onExit = (e) =>  {
    CommonFunc.logout().then(res => {
        console.log('onExit-1, success, res: ')
        // clear user fav list
        this.props.updateProp([])
        this.setState({
          isLogin: false,
          loginedUsername: '',
        })
      }).catch(error => {
        console.log('onExit-2, fail, error: ' + error)
      })
  }

  onRegister = (e) =>  {
    Taro.navigateTo({
      url: '/pages/login/register',
    })
  }

  onChangePassword = (e) => {
  }

  render () {
    return (
      <View className="login-top-view">
      <Video width='150px' height='190px' src={namedVideo} />
      <Image src={namedPng} />
      <FixedTitle title="用户登录" />
      {!this.state.isLogin &&
      <View className="login-top-view-1">
        <View className='login-input-container'>
          <View className='login-input-container-1'>
            <View className='user-icon'/>
            <Input type='text' placeholder='请输入手机号码'
              className='login-input-username' onInput={this.onInputUserNameChange} />
          </View>
          <View className='login-input-container-1'>
            <View className='passwd-icon'/>
            <Input type='password' placeholder='请输入密码' onInput={this.onInputPasswordChange} />
          </View>
        </View>
        <View onClick={this.onSubmit} className='login-input-submit'>登 录</View>
        <View className='login-register-container'>
          <Text onClick={this.onChangePassword} className='login-input-change-password'>忘记密码</Text>
          <Text onClick={this.onRegister} className='login-input-register'>注册新用户</Text>
        </View>
      </View>
      }
      {this.state.isLogin &&
        <View>
          <View>当前登录用户: {this.state.loginedUsername}</View>
          <View onClick={this.onExit} className='login-input-submit'>退 出</View>
          <View>
            <Rhlist searchCondition='favList=t'
              isLogin={this.state.isLogin}
              showResult='false'
              title='您的收藏：'/>
          </View>
        </View>
      }
      <PageFooter />
      </View>
    )
  }
}
