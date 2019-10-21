import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup } from '@tarojs/components'
import './report.scss'

import { Util } from '../../util/util'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

export default class Report extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '茜茜猫首付计算器',
  }

  constructor(props) {
    super(props)

    this.state = {
      mOpenFromMain: (this.$router.params.from != null & this.$router.params.from == 'main') ? true : false,

      mFirstPayment: Number(this.$router.params.fp),
      mTotalPayment: Number(this.$router.params.tp),
      mTotalLoan: Number(this.$router.params.tl),
      mTotalFee: Number(this.$router.params.tf),
      mTotalTax: Number(this.$router.params.tt),

      // input
      mHouseName: this.$router.params.hn,
      mHouseArea: Number(this.$router.params.ha),

      mTotalPrice: Number(this.$router.params.tpr),
      mOriginPrice: Number(this.$router.params.opr),
      mWebSignPrice: Number(this.$router.params.wspr),
      mLowestGuidePrice: Number(this.$router.params.lgpr),

      // Tax
      mDeedTax: Number(this.$router.params.dt),
      mPersonalIncomeTax: Number(this.$router.params.pit),
      mValueAddedTax: Number(this.$router.params.vat),
      mOtherTax: Number(this.$router.params.ot),

      // Fee
      mAgencyFee: Number(this.$router.params.af),
      mLoanServiceFee: Number(this.$router.params.lsf),
      mEvaluationFee: Number(this.$router.params.ef),
      mMortgageRegistrationFee: Number(this.$router.params.mrf),
      mOtherFee: Number(this.$router.params.of),

      // Loan
      mCommercialLoan: Number(this.$router.params.cl),
      mProvidentFundLoan: Number(this.$router.params.pfl),
      mOtherLoan: Number(this.$router.params.ol),

      mFirstHouseRadioValue: Number(this.$router.params.fhrv),
      mAboveTwoYearsRadioValue: Number(this.$router.params.atyrv),
      mOnlyHouseRadioValue: Boolean(this.$router.params.onhrv),
      mOrdinaryHouseRadioValue: Boolean(this.$router.params.orhrv),

      mIsFirstHouseRadioList: [
        { value: 1, text: '首套', checked: true, },
        { value: 2, text: '二套', checked: false, },
        { value: 3, text: '三套及以上', checked: false, },
      ],
      mIsAboveTwoYearsRadioList: [
        { value: 1, text: '不满两年', checked: true, },
        { value: 2, text: '满两年', checked: false, },
        { value: 3, text: '满五年', checked: false, },
      ],
      mIsOnlyHouseRadioList: [
        { value: true, text: '是', checked: true, },
        { value: false, text: '否', checked: false, },
      ],
      mIsOrdinaryHouseRadioList: [
        { value: true, text: '是', checked: true, },
        { value: false, text: '否', checked: false, },
      ],
    }

  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onShareAppMessage = (share) => {
    let param = Util.getParamForGenerateReport(this.state);
    return {
      title: Util.appTitle,
      path: '/pages/report/report?' + param 
    }
  }

  navigateToMainPage = (e) => {
    Taro.navigateTo({
      url: '/pages/index/index',
    })
  }

  onClickOpenTipBoxIcon = (idx, e) => {
    console.log('onClickOpenTipBoxIcon, idx: ' + idx)
    Taro.navigateTo({
      url: '/pages/tipbox/tipbox?idx=' + idx
    })
  }

  render () {
    return (
      <View className='idx-top-container'>

        <View className='idx-top-container-2'>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>房子名称</Text>
            <Text className='idx-input-text'>{this.state.mHouseName}</Text>
            <Text className='idx-input-title2'>房子面积</Text>
            <Text className='idx-input-text'>{this.state.mHouseArea}</Text>
          </View>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>价格</Text>
            <Text className='idx-input-text'>{this.state.mTotalPrice}</Text>
            <Text className='idx-input-title2'>原值</Text>
            <Text className='idx-input-text'>{this.state.mOriginPrice}</Text>
          </View>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>网签价</Text>
            <Text className='idx-input-text'>{this.state.mWebSignPrice}</Text>
            <Text className='idx-input-title2'>最低指导价</Text>
            <Text className='idx-input-text'>{this.state.mLowestGuidePrice}</Text>
          </View>

          <RadioGroup>
            <View className='idx-input-item-container'>
              <Text className='idx-radio-title'>买方是否首套：</Text>
              {this.state.mIsFirstHouseRadioList.map((item, i) => {
                return (
                  <View onClick={this.onClickFirstHouseRadio.bind(this, item.value)} >
                    <Radio value={item.value} disabled={true}
                      checked={item.value == this.state.mFirstHouseRadioValue}
                      style={{transform: 'scale(0.8)'}} color='#FF7464'>
                      <Text className='idx-radio-text'>{item.text}</Text>
                    </Radio>
                  </View>)
              })}
            </View>
          </RadioGroup>
          <RadioGroup>
            <View className='idx-input-item-container'>
              <Text className='idx-radio-title'>是否满两年：</Text>
              {this.state.mIsAboveTwoYearsRadioList.map((item, i) => {
                return (
                  <View>
                    <Radio value={item.value} disabled={true}
                      onClick={this.onClickAboveTwoYearsRadio.bind(this, item.value)} 
                      checked={item.value == this.state.mAboveTwoYearsRadioValue}
                      style={{transform: 'scale(0.8)'}} color='#FF7464'>
                      <Text className='idx-radio-text'>{item.text}</Text>
                    </Radio>
                  </View>)
              })}
            </View>
          </RadioGroup>
          <RadioGroup>
            <View className='idx-input-item-container'>
              <Text className='idx-radio-title'>是否卖方唯一住宅：</Text>
              {this.state.mIsOnlyHouseRadioList.map((item, i) => {
                return (
                  <View onClick={this.onClickOnlyHouseRadio.bind(this, item.value)} >
                    <Radio value={item.value} disabled={true}
                      checked={item.value == this.state.mOnlyHouseRadioValue}
                      style={{transform: 'scale(0.8)', padding: '0px 15px'}} color='#FF7464'>
                      <Text className='idx-radio-text'>{item.text}</Text>
                    </Radio>
                  </View>)
              })}
            </View>
          </RadioGroup>
          <RadioGroup>
            <View className='idx-input-item-container'>
              <Text className='idx-radio-title'>是否普通住宅：</Text>
              {this.state.mIsOrdinaryHouseRadioList.map((item, i) => {
                return (
                  <View onClick={this.onClickOrdinaryHouseRadio.bind(this, item.value)} >
                    <Radio value={item.value} disabled={true}
                      checked={item.value == this.state.mOrdinaryHouseRadioValue}
                      style={{transform: 'scale(0.8)', padding: '0px 15px'}} color='#FF7464'>
                      <Text className='idx-radio-text'>{item.text}</Text>
                    </Radio>
                  </View>)
              })}
            </View>
          </RadioGroup>


          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>商贷</Text>
            <Text className='idx-input-text'>{this.state.mCommercialLoan.toFixed(2)}</Text>
            <Text className='idx-input-title2'>公积金贷款</Text>
            <Text className='idx-input-text'>{this.state.mProvidentFundLoan.toFixed(2)}</Text>
          </View>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>其他贷款</Text>
            <Text className='idx-input-text'>{this.state.mOtherLoan.toFixed(2)}</Text>
          </View>

          <View className='idx-input-item-container'>
            <View className='idx-input-title'>总首付<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.FirstPayment)}></View></View>
            <Text className='idx-input-text'>{this.state.mFirstPayment.toFixed(2)}</Text>
            <View className='idx-input-title2'>总支付<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalPayment)}></View></View>
            <Text className='idx-input-text'>{this.state.mTotalPayment.toFixed(2)}</Text>
          </View>

          <View className='idx-input-item-container'>
            <View className='idx-input-title'>总费用<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalFee)}></View></View>
            <Text className='idx-input-text'>{this.state.mTotalFee.toFixed(2)}</Text>
            <View className='idx-input-title2'>总税款<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalTax)}></View></View>
            <Text className='idx-input-text'>{this.state.mTotalTax.toFixed(2)}</Text>
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>总税费</Text>
            <Text className='idx-input-text'>{(this.state.mTotalTax + this.state.mTotalFee).toFixed(2)}</Text>
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>契税</Text>
            <Text className='idx-input-text'>{this.state.mDeedTax.toFixed(2)}</Text>
            <Text className='idx-input-title2'>个人所得税</Text>
            <Text className='idx-input-text'>{this.state.mPersonalIncomeTax.toFixed(2)}</Text>
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>增值税</Text>
            <Text className='idx-input-text'>{this.state.mValueAddedTax.toFixed(2)}</Text>
            <Text className='idx-input-title2'>其他税</Text>
            <Text className='idx-input-text'>{this.state.mOtherTax.toFixed(2)}</Text>
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>中介费</Text>
            <Text className='idx-input-text'>{this.state.mAgencyFee.toFixed(2)}</Text>
            <Text className='idx-input-title2'>贷款服务费</Text>
            <Text className='idx-input-text'>{this.state.mLoanServiceFee.toFixed(2)}</Text>
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>评估费</Text>
            <Text className='idx-input-text'>{this.state.mEvaluationFee}</Text>
            <Text className='idx-input-title2'>抵押登记费</Text>
            <Text className='idx-input-text'>{this.state.mMortgageRegistrationFee}</Text>
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>其他费用（万元）</Text>
            <Text className='idx-input-text'>{this.state.mOtherFee}</Text>
          </View>

          <View className='idx-button-container'>
            {!this.state.mOpenFromMain &&
              <Button type='primary' onClick={this.navigateToMainPage}>重新计算</Button>}
            <Button type='primary' open-type='share'>结果转发给朋友</Button>
          </View>
        </View>
      </View>
    )
  }
}
