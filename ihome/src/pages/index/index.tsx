import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup } from '@tarojs/components'
import './index.scss'

import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

export default class Index extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props)

    this.state = {

      mFirstPayment: 0,
      mTotalPayment: 0,
      mTotalLoan: 0,
      mTotalFee: 0,
      mTotalTax: 0,

      mTotolPrice: 0,
      mOriginPrice: 0,
      mWebSignPrice: 0,

      // Tax
      mDeedTax: 0,
      mDeedTaxRate: 0,
      mPersonalIncomeTax: 0,
      mBusinessTax: 0,
      mOtherTax: 0,

      // Fee
      mAgencyFee: 0,

      mLoanServiceFee: 0,
      mEvaluationFee: 0,
      mMortgageRegistrationFee: 0,
      mOtherFee: 0,

      // Loan
      mCommercialLoan: 0,
      mCommercialLoanYears: 0,
      mCommercialLoanInterestRate: 0,
      mCommercialLoanMonthlySupply: 0,


      mProvidentFundLoan: 0,
      mProvidentFundLoanYears: 0,
      mProvidentFundLoanInterestRate: 0,
      mProvidentFundLoanMonthlySupply: 0,

      mOtherLoan: 0,
      mOtherLoanYears: 0,
      mOtherLoanInterestRate: 0,
      mOtherLoanMonthlySupply: 0,

      mInputDeedTaxManual: false,
      mInputPersonalIncomeTaxManual: false,

      mFirstHomeRadioValue: 1,
      mAboveTwoYearsRadioValue: 1,
      mOnlyHomeRadioValue: 1,

      mIsFirstHomeRadioList: [
        { value: 1, text: '首套', checked: true, },
        { value: 2, text: '二套', checked: false, },
        { value: 3, text: '三套及以上', checked: false, },
      ],
      mIsAboveTwoYearsRadioList: [
        { value: 1, text: '不满两年', checked: true, },
        { value: 2, text: '满两年', checked: false, },
        { value: 3, text: '满五年', checked: false, },
      ],
      mIsOnlyHomeRadioList: [
        { value: 1, text: '是', checked: true, },
        { value: 2, text: '否', checked: false, },
      ],
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  updateFirstPayment = (totolPrice, totalLoan, totalFee, totalTax) => {
    this.setState({
        mFirstPayment: totolPrice - totalLoan + totalFee + totalTax,
    })
  }

  updateTotalPayment = (totolPrice, totalFee, totalTax) => {
    this.setState({
        mTotalPayment: totolPrice + totalFee + totalTax,
    })
  }

  updateTotalLoan = (commercialLoan, providentFundLoan, otherLoan) => {
    this.setState({
        mTotalPayment: (commercialLoan + providentFundLoan + otherLoan),
    })
  }

  updateTotalFee = (agencyFee, loanServiceFee, evaluationFee,
          mortgageRegistrationFee, otherFee) => {
    this.setState({
        mTotalFee: (agencyFee + loanServiceFee + evaluationFee
                    + mortgageRegistrationFee + otherFee),
    })
  }

  updateTotalTax = (deedTax, personalIncomeTax,
          businessTax, otherTax) => {
    this.setState({
        mTotalTax: (deedTax + personalIncomeTax +
                    + businessTax + otherTax)
    })
  }

  updatePersonalIncomeTax = (webSignPrice, originPrice) {
    this.setState({
        mPersonalIncomeTax: (webSignPrice * 0.9 - originPrice) * 0.2
    })
  }

  updateLetPersonalIncomeTaxEqualZero = (webSignPrice, originPrice) {
  }








  onInputDeedTaxManualCheckboxChange = (e) => {
    console.log('onInputDeedTaxManualCheckboxChange, e.detail:', e.detail)
  }

  clickInputDeedTaxManualCheckbox = (e) => {
    console.log('clickInputDeedTaxManualCheckbox, e.detail:', e.detail)
    this.setState({
        mInputDeedTaxManual: !this.state.mInputDeedTaxManual,
    })
  }

  onClickFirstHomeRadio = (idx, e) => {
    console.log('onClickFirstHomeRadio, idx:', idx)
    this.setState({
        mFirstHomeRadioValue: idx,
    })
  }

  onClickAboveTwoYearsRadio = (idx, e) => {
    console.log('onClickAboveTwoYearsRadio, value:', e.detail.value)
    this.setState({
        mAboveTwoYearsRadioValue: idx,
    })
  }

  onClickOnlyHomeRadio = (idx, e) => {
    console.log('onClickOnlyHomeRadio, value:', e.detail.value)
    this.setState({
        mOnlyHomeRadioValue: idx,
    })
  }

  render () {
    let colorForInputDeedTaxManual = this.state.mInputDeedTaxManual ?
            'idx-input-text' : 'idx-input-text-disable'

    return (
      <View className='idx-top-container'>
        <View className='idx-top-container-2'>
          <Video width='150px' height='190px' src={namedVideo} />
          <Image src={namedPng} width='150px' height='300px' />
          <Text>Hello world!</Text>
          <View className='idx-input-text-container'><Text className='idx-input-title'>房子名称</Text><Input className='idx-input-text' type='text' placeholder='请输入房子位置' /></View>
          <View className='idx-input-text-container'><Text className='idx-input-title'>总价（万元）</Text><Input className='idx-input-text' type='digit' placeholder='请输入总价' maxLength='10' /></View>
          <View className='idx-input-text-container'><Text className='idx-input-title'>原值（万元）</Text><Input className='idx-input-text' type='digit' placeholder='请输入房子原购买价' maxLength='10' /></View>
          <View className='idx-input-text-container'><Text className='idx-input-title'>网签价（万元）</Text><Input className='idx-input-text' type='digit' placeholder='请输入网签价' maxLength='10' /></View>

          <View className='idx-input-text-container'>
            <Text className='idx-input-title'>契税</Text>
            <Input className={colorForInputDeedTaxManual} disabled={!this.state.mInputDeedTaxManual} type='text' placeholder='请输入契税' maxLength='10' />
          </View>
          <CheckboxGroup>
            <View>
              <Checkbox checked={this.state.mInputDeedTaxManual}
                onClick={this.clickInputDeedTaxManualCheckbox} value={1}>
                    手动输入契税</Checkbox>
            </View>
          </CheckboxGroup>

          <RadioGroup>
            <View className='idx-input-text-container'>
              <View className='idx-input-title'>
                买方是否首套：
              </View>
              {this.state.mIsFirstHomeRadioList.map((item, i) => {
                return (
                  <View className='idx-input-title' onClick={this.onClickFirstHomeRadio.bind(this, item.value)} >
                    <Radio value={item.value}
                      checked={item.value == this.state.mFirstHomeRadioValue}
                      style={{transform: 'scale(0.7)'}} color='#FF7464'>
                      {item.text}
                    </Radio>
                  </View>)
              })}
            </View>
          </RadioGroup>
          <RadioGroup>
            <View className='idx-input-text-container'>
              <View className='idx-input-title'>
                是否满两年：
              </View>
              {this.state.mIsAboveTwoYearsRadioList.map((item, i) => {
                return (
                  <View className='idx-input-title' onClick={this.onClickAboveTwoYearsRadio.bind(this, item.value)} >
                    <Radio value={item.value}
                      checked={item.value == this.state.mAboveTwoYearsRadioValue}
                      style={{transform: 'scale(0.7)'}} color='#FF7464'>
                      {item.text}
                    </Radio>
                  </View>)
              })}
            </View>
          </RadioGroup>
          <RadioGroup>
            <View className='idx-input-text-container'>
              <View className='idx-input-title'>
                是否卖方唯一住宅：
              </View>
              {this.state.mIsOnlyHomeRadioList.map((item, i) => {
                return (
                  <View className='idx-input-title' onClick={this.onClickOnlyHomeRadio.bind(this, item.value)} >
                    <Radio value={item.value}
                      checked={item.value == this.state.mOnlyHomeRadioValue}
                      style={{transform: 'scale(0.7)'}} color='#FF7464'>
                      {item.text}
                    </Radio>
                  </View>)
              })}
            </View>
          </RadioGroup>


          <View className='idx-input-text-container'><Text className='idx-input-title'>商贷（万元）</Text><Input className='idx-input-text' type='digit' placeholder='请输入商贷总额' maxLength='10' /></View>
          <View className='idx-input-text-container'><Text className='idx-input-title'>公积金贷款（万元）</Text><Input className='idx-input-text' type='digit' placeholder='请输入公积金贷款总额' maxLength='10' /></View>
          <View className='idx-input-text-container'><Text className='idx-input-title'>其他贷款（万元）</Text><Input className='idx-input-text' type='digit' placeholder='请输入其他贷款总额' maxLength='10' /></View>

          <View className='idx-input-text-container'><Text className='idx-input-title'>总价：</Text><Input className='idx-input-text' type='text' placeholder='请输入总价' maxLength='10' />万</View>

          <View className='idx-input-text-container'><Text className='idx-input-title'>总价：</Text><Input className='idx-input-text' type='text' placeholder='请输入总价' maxLength='10' />万</View>
          <Button type='primary'>开始计算</Button>
        </View>
      </View>
    )
  }
}
