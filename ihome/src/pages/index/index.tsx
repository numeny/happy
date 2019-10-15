import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup } from '@tarojs/components'
import './index.scss'

import { Util } from '../../util/util'

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

      // input
      mTotalPrice: 0,
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

      // input
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

      mWillInputDeedTaxManual: false,
      mInputDeedTaxManual: 0,
      mWillInputPersonalIncomeTaxManual: false,

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

  updateFirstPayment = (totalPrice, totalLoan, totalFee, totalTax) => {
    this.setState({
        mFirstPayment: totalPrice - totalLoan + totalFee + totalTax,
    })
  }

  updateTotalPayment = (totalPrice, totalFee, totalTax) => {
    this.setState({
        mTotalPayment: totalPrice + totalFee + totalTax,
    })
  }

  updateTotalLoan = (commercialLoan, providentFundLoan, otherLoan) => {
    let totalLoan = commercialLoan + providentFundLoan + otherLoan
    this.setState({
        mTotalLoan: totalLoan,
    })
    this.updateFirstPayment(this.state.mTotalPrice, totalLoan,
            this.state.mTotalFee, this.state.mTotalTax)
  }

  updateTotalFee = (agencyFee, loanServiceFee, evaluationFee,
          mortgageRegistrationFee, otherFee) => {
    let totalFee = (agencyFee + loanServiceFee + evaluationFee
                    + mortgageRegistrationFee + otherFee)
    this.setState({
        mTotalFee: totalFee,
    })
    this.updateFirstPayment(this.state.mTotalPrice, this.state.mTotalLoan,
            totalFee, this.state.mTotalTax)
    this.updateTotalPayment(this.state.mTotalPrice,
            totalFee, this.state.mTotalTax)
  }

  updateTotalTax = (deedTax, personalIncomeTax,
          businessTax, otherTax) => {
    let totalTax = (deedTax + personalIncomeTax +
                    + businessTax + otherTax)
    this.setState({
        mTotalTax: totalTax,
    })
    this.updateFirstPayment(this.state.mTotalPrice,
            this.state.mTotalLoan, this.state.mTotalFee, totalTax)
    this.updateTotalPayment(this.state.mTotalPrice,
            this.state.mTotalFee, totalTax)
  }

  updatePersonalIncomeTax = (webSignPrice, originPrice) {
    let personalIncomeTax = (webSignPrice * 0.9 - originPrice) * 0.2
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    this.setState({
        mPersonalIncomeTax: personalIncomeTax,
    })

    this.updateTotalTax(this.state.mDeedTax, personalIncomeTax,
            this.state.mBusinessTax, this.state.mOtherTax)
  }

  updateDeedTax = (webSignPrice, deedTaxRate, inputDeedTaxManual) {
  }

  updateLetPersonalIncomeTaxEqualZero = (webSignPrice, originPrice) {
  }


  onInputHomeName = (e) => {
    console.log('onInputHomeName, e.target.value:', e.target.value)
  }

  onInputTotalPrice = (e) => {
    console.log('onInputTotalPrice, e.target.value:', e.target.value)
    try {
      let totalPrice = Number(e.target.value)
      this.updateFirstPayment(totalPrice, this.state.mTotalLoan,
              this.state.mTotalFee, this.state.mTotalTax)
      this.updateTotalPayment(totalPrice,
              this.state.mTotalFee, this.state.mTotalTax)
    } catch(err) {
      console.log("onInputTotalPrice: ", err);
      Taro.showToast({title: "请输入正确的总价！"})
    }
  }

  onInputOriginPrice = (e) => {
    try {
      let originPrice = 0
      if (e.target.value.length != 0) {
        originPrice = parseFloat(e.target.value)
      }
      // FIXME
      if (e.target.value.length != 0 && !Util.isNumber(originPrice)) {
        console.log("onInputOriginPrice-1-2: ", err);
        Taro.showToast({title: "请输入正确的原值！"})
        return
      }
      console.log('onInputOriginPrice-1-1, originPrice:', originPrice)
      this.updatePersonalIncomeTax(this.state.mWebSignPrice, originPrice)

    } catch(err) {
      console.log("onInputOriginPrice: ", err);
      Taro.showToast({title: "请输入正确的原值！"})
    }
  }


  onInputWebSignPrice = (e) => {
    console.log('onInputWebSignPrice, e.target.value:', e.target.value)
  }

  onInputCommercialLoan = (e) => {
    console.log('onInputCommercialLoan, e.target.value:', e.target.value)
  }

  onInputProvidentFundLoan = (e) => {
    console.log('onInputProvidentFundLoan, e.target.value:', e.target.value)
  }

  onInputOtherLoan = (e) => {
    console.log('onInputOtherLoan, e.target.value:', e.target.value)
  }

  onInputDeedTaxManual = (e) => {
    console.log('onInputDeedTaxManual, e.target.value:', e.target.value)
    try {
      let originPrice = Number(e.target.value)
mInputDeedTaxManual


      this.updatePersonalIncomeTax(this.state.mWebSignPrice, originPrice)

    } catch(err) {
      console.log("onInputOriginPrice: ", err);
      Taro.showToast({title: "请输入正确的原值！"})
    }

  }

  clickInputDeedTaxManualCheckbox = (e) => {
    console.log('clickInputDeedTaxManualCheckbox, e.detail:', e.detail)
    this.setState({
        mWillInputDeedTaxManual: !this.state.mWillInputDeedTaxManual,
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
    let classNameForInputDeedTaxManual = this.state.mWillInputDeedTaxManual ?
            'idx-input-text' : 'idx-input-text-disable'

    return (
      <View className='idx-top-container'>
        <View className='idx-top-container-2'>
          <Video width='150px' height='190px' src={namedVideo} />
          <Image src={namedPng} width='150px' height='300px' />
          <Text>Hello world!</Text>
          <View className='idx-input-text-container'>
            <Text className='idx-input-title'>房子名称</Text>
            <Input className='idx-input-text' type='text' placeholder='请输入房子位置' onInput={this.onInputHomeName} />
          </View>
          <View className='idx-input-text-container'>
            <Text className='idx-input-title'>总价（万元）</Text>
            <Input className='idx-input-text' type='digit' placeholder='请输入总价' maxLength='10' onInput={this.onInputTotalPrice} />
          </View>
          <View className='idx-input-text-container'>
            <Text className='idx-input-title'>原值（万元）</Text>
            <Input className='idx-input-text' type='digit' placeholder='请输入房子原购买价' maxLength='10' onInput={this.onInputOriginPrice} />
          </View>
          <View className='idx-input-text-container'>
            <Text className='idx-input-title'>网签价（万元）</Text>
            <Input className='idx-input-text' type='digit' placeholder='请输入网签价' maxLength='10' onInput={this.onInputWebSignPrice} />
          </View>

          <View className='idx-input-text-container'>
            <Text className='idx-input-title'>契税</Text>
            <Input className={classNameForInputDeedTaxManual}
              disabled={!this.state.mWillInputDeedTaxManual} type='text'
              placeholder='请输入契税' maxLength='10'
              onInput={this.onInputDeedTaxManual} />
          </View>
          <CheckboxGroup>
            <View>
              <Checkbox checked={this.state.mWillInputDeedTaxManual}
                onClick={this.clickInputDeedTaxManualCheckbox}>
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


          <View className='idx-input-text-container'>
            <Text className='idx-input-title'>商贷（万元）</Text>
            <Input className='idx-input-text' type='digit' placeholder='请输入商贷总额' maxLength='10' onInput={this.onInputCommercialLoan} />
          </View>
          <View className='idx-input-text-container'>
            <Text className='idx-input-title'>公积金贷款（万元）</Text>
            <Input className='idx-input-text' type='digit' placeholder='请输入公积金贷款总额' maxLength='10' onInput={this.onInputProvidentFundLoan} />
          </View>
          <View className='idx-input-text-container'>
            <Text className='idx-input-title'>其他贷款（万元）</Text>
            <Input className='idx-input-text' type='digit' placeholder='请输入其他贷款总额' maxLength='10' onInput={this.onInputOtherLoan} />
          </View>

          <View>首付：{this.state.mFirstPayment}</View>
          <View>总支付：{this.state.mTotalPayment}</View>
          <View>总费用：{this.state.mTotalFee}</View>
          <View>总税款：{this.state.mTotalTax}</View>
          <View>契税：{this.state.mDeedTax}</View>
          <View>个人所得税：{this.state.mPersonalIncomeTax}</View>
          <View>营业税：{this.state.mBusinessTax}</View>
          <View>其他税：{this.state.mOtherTax}</View>
          <View>中介费：{this.state.mAgencyFee}</View>
          <View>贷款服务费：{this.state.mLoanServiceFee}</View>
          <Button type='primary'>开始计算</Button>
        </View>
      </View>
    )
  }
}
