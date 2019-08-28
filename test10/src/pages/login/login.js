import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import { AtButton } from 'taro-ui'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";
import "../../../node_modules/taro-ui/dist/style/components/button.scss";

import { DEF_AVATAR_IMG, DEF_USER_NAME } from '../../util/const'
import { CommonFunc } from '@util/common_func'
import { Util } from '@util/util'

import './login.scss'
import FixedTitle from '../common/fixedtitle'
import PageFooter from '../common/pagefooter'
import Rhlist from '../common/rhlist'

import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'

import { connect } from '@tarojs/redux'
import { updateFavList, updateAvatar, updateUsername } from '../../actions/counter'

const LOGIN_TYPE_NONE = 0
const LOGIN_TYPE_WEIXIN = 1
const LOGIN_TYPE_PHONE = 2

@connect((state) => {
  return { prop_counter: state.counter }
}, (dispatch) => ({
  updateFavListProp (rhFavList) {
    dispatch(updateFavList(rhFavList))
  },
  updateUsernameProp (username) {
    dispatch(updateUsername(username))
  },
  updateAvatarProp (avatar) {
    dispatch(updateAvatar(avatar))
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
      loginType: LOGIN_TYPE_NONE,
    }
  }

  componentWillMount() {
    CommonFunc.getLoginedInfo().then(res => {
      console.log('componentWillMount-1, success, res: ' + res.username)
      this.setState({
        isLogin: true,
      })
    }).catch(error => {
      console.log('componentWillMount-2, fail, error: ' + error)
      this.setState({
        isLogin: false,
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

  loginWithPhone = (e) =>  {
    /*
    if (Util.getTaroEnv() === 'weapp') {
      CommonFunc.loginForWeixin()
        .then(res => {
          console.log('loginWithPhone, success: ' + res)
          this.props.updateFavListProp(res)
        }).catch(error => {
          console.log('loginWithPhone, error: ' + error)
        })
    } else if (Util.getTaroEnv() === 'h5') {
    */
      if (!Util.checkUsername(this.state.username)) {
        return
      }
      if (!Util.checkPassword(this.state.password)) {
        return
      }
      CommonFunc.login(this.state.username, this.state.password)
        .then(res => {
            console.log('loginWithPhone, success: ' + res)
            // set user fav list, res is rhFavList
            this.props.updateFavListProp(res)
        }).catch(error => {
            console.log('loginWithPhone, error: ' + error)
        })
    // }
  }

  onGetUserInfo = (e) =>  {
    console.log('onGetUserInfo')
    console.log(e)
    console.log(e.detail)
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)

    let avatarUrl = ''
    let nickName = ''
    if (!!e.detail && !!e.detail.userInfo) {
      let userInfo = e.detail.userInfo
      avatarUrl = userInfo.avatarUrl
      nickName = userInfo.nickName

      const country = userInfo.country
      const province = userInfo.province
      const city = userInfo.city
      const gender = userInfo.gender //性别 0：未知、1：男、2：女

      console.log('onGetUserInfo'
                  + ', country: ' + userInfo.country
                  + ', province: ' + userInfo.province
                  + ', city: ' + userInfo.city
                  + ', gender: ' + userInfo.gender)

    } else {
      console.log('onGetUserInfo, Can not get user info!')
      avatarUrl = DEF_AVATAR_IMG
      nickName = DEF_USER_NAME
    }
    this.props.updateAvatarProp(avatarUrl)
    this.props.updateUsernameProp(nickName)
    console.log('onGetUserInfo, avatarUrl: '
                + avatarUrl
                + ', nickName: ' + nickName)
    console.log('onGetUserInfo, props.avatar: '
                + this.props.prop_counter.avatar
                + ', props.nickName: '
                + this.props.prop_counter.nickName)
  }

  onGetPhoneNumber = (e) =>  {
    console.log('onGetPhoneNumber')
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  }

  onLoginWithWeixin = (e) =>  {
    if (Util.getTaroEnv() != 'weapp') {
      // FIXME, h5 do not support weixin login
      return
    }
    CommonFunc.loginForWeixin().then(res => {
        console.log('onLoginWithWeixin, success: ' + res)
        this.props.updateFavListProp(res.rhFavList)
        console.log('onLoginWithWeixin, res.rhFavList: ' + res.rhFavList)
      }).catch(error => {
        console.log('onLoginWithWeixin, error: ' + error)
      })
  }

  onLoginWithPhone = (e) =>  {
    this.setState({
      isLogin: false,
      loginType: LOGIN_TYPE_PHONE,
    })
  }

  onExit = (e) =>  {
    CommonFunc.logout().then(res => {
        console.log('onExit-1, success, res: ')
        // clear user fav list
        this.props.updateFavListProp([])
        this.setState({
          isLogin: false,
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
      {!this.state.isLogin && this.state.loginType == LOGIN_TYPE_NONE &&
        <View className="login-top-view-1">
          <Button onClick={this.onLoginWithWeixin}
              open-type='getUserInfo'
              onGetUserInfo={this.onGetUserInfo}
              className='login-input-submit'>
            微信登录
          </Button>
          <View onClick={this.onLoginWithPhone} className='login-input-submit'>手机号登录</View>
          <View onGetPhoneNumber={this.onGetPhoneNumber}
              className='login-input-submit'>
            获取手机号
          </View>
        </View>}
 

      {!this.state.isLogin && this.state.loginType == LOGIN_TYPE_PHONE &&
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
          <View onClick={this.loginWithPhone} className='login-input-submit'>登 录</View>
          <View className='login-register-container'>
            <Text onClick={this.onChangePassword} className='login-input-change-password'>忘记密码</Text>
            <Text onClick={this.onRegister} className='login-input-register'>注册新用户</Text>
          </View>
        </View>}

      {this.state.isLogin &&
        <View>
          <View>当前登录用户: </View>
          <View className='login-input-container-1'>
            {this.props.prop_counter.avatar.length > 0 &&
              <Image src={this.props.prop_counter.avatar}
                className='login-avatar' />
            }
            {this.props.prop_counter.username.length > 0 &&
              <Text className='login-username'>
                {this.props.prop_counter.username}</Text>
            }
            {this.props.prop_counter.avatar == DEF_AVATAR_IMG &&
              <Button open-type='getUserInfo'
                  onGetUserInfo={this.onGetUserInfo}
                  className='login-input-submit'>
                更新您的登录信息</Button>
            }
          </View>
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
