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
      mHouseName: '',
      mHouseArea: '',

      mTotalPrice: 0,
      mOriginPrice: 0,
      mWebSignPrice: 0,
      mLowestGuidePrice: 0,

      // Tax
      mDeedTax: 0,
      mDeedTaxRate: 0.03, // FIXME
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

      mFirstHouseRadioValue: 1,
      mAboveTwoYearsRadioValue: 1,
      mOnlyHouseRadioValue: 1,

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

  updateFirstPayment = (totalPayment, totalLoan) => {
    this.setState({
        mFirstPayment: totalPayment - totalLoan,
    })
  }

  updateTotalPayment = (totalPrice, totalFee, totalTax) => {
    let totalPayment = totalPrice + totalFee + totalTax
    this.setState({
        mTotalPayment: totalPayment,
    })
    this.updateFirstPayment(totalPayment, this.state.mTotalLoan)
    return totalPayment
  }

  updateTotalLoan = (commercialLoan, providentFundLoan, otherLoan) => {
    let totalLoan = commercialLoan + providentFundLoan + otherLoan
    this.setState({
        mTotalLoan: totalLoan,
    })
    this.updateFirstPayment(this.state.mTotalPayment, totalLoan)
    return totalLoan
  }

  updateTotalFee = (agencyFee, loanServiceFee, evaluationFee,
          mortgageRegistrationFee, otherFee) => {
    let totalFee = (agencyFee + loanServiceFee + evaluationFee
                    + mortgageRegistrationFee + otherFee)
    this.setState({
        mTotalFee: totalFee,
    })
    this.updateTotalPayment(this.state.mTotalPrice,
            totalFee, this.state.mTotalTax)
    return totalFee
  }

  updateTotalTax = (deedTax, personalIncomeTax,
          businessTax, otherTax) => {
    let totalTax = (deedTax + personalIncomeTax +
                    + businessTax + otherTax)
    this.setState({
        mTotalTax: totalTax,
    })
    this.updateTotalPayment(this.state.mTotalPrice,
            this.state.mTotalFee, totalTax)
    return totalTax
  }

  updatePersonalIncomeTax2 = (webSignPrice, originPrice,
      deedTax, businessTax, otherTax) => {
    // FIXME, on other city
    let personalIncomeTax = (webSignPrice * 0.9 - originPrice) * 0.2
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    this.setState({
        mPersonalIncomeTax: personalIncomeTax,
    })

    this.updateTotalTax(deedTax, personalIncomeTax, businessTax, otherTax)
    return personalIncomeTax
  }

  updatePersonalIncomeTax = (webSignPrice, originPrice) => {
    return this.updatePersonalIncomeTax2(webSignPrice, originPrice,
        this.state.mDeedTax, this.state.mBusinessTax, this.state.mOtherTax)
  }

  updateDeedTax = (webSignPrice, deedTaxRate,
      willInputDeedTaxManual, inputDeedTaxManual) => {
    return this.updateDeedTax2(webSignPrice, deedTaxRate,
        willInputDeedTaxManual, inputDeedTaxManual,
        this.state.mPersonalIncomeTax,
        this.state.mBusinessTax, this.state.mOtherTax)
  }

  updateDeedTax2 = (webSignPrice, deedTaxRate,
      willInputDeedTaxManual, inputDeedTaxManual,
      personalIncomeTax, businessTax, otherTax) => {
    // FIXME
    let deedTax = 0
    if (willInputDeedTaxManual) {
      deedTax = inputDeedTaxManual
    } else {
      deedTax = webSignPrice * deedTaxRate
    }
    this.setState({
        mDeedTax: deedTax,
    })
    console.error("updateDeedTax: ", deedTax);
    console.error("updateDeedTax: personalIncomeTax: ",
        personalIncomeTax);
    this.updateTotalTax(deedTax, personalIncomeTax, businessTax, otherTax)
    return deedTax
  }

  // FIXME
  lowestPersonalIncomeTax = () => {
    if (this.state.mLowestGuidePrice == 0) {
      Taro.showToast({title: "请输入最低指导价！"})
      return
    }

    if (this.state.mOriginPrice == 0) {
      Taro.showToast({title: "请输入原值！"})
      return
    }
    // let personalIncomeTax = (webSignPrice * 0.9 - originPrice) * 0.2
    let webSignPrice = Math.max(this.state.mOriginPrice * 10 / 9,
        this.state.mLowestGuidePrice)

    console.error("lowestPersonalIncomeTax, webSignPrice: ", webSignPrice);
    this.onWebSignPriceChanged(webSignPrice)
  }

  onInputHouseName = (e) => {
    this.setState({
        mHouseName: e.target.value,
    })
  }

  onInputHouseArea = (e) => {
    try {
      let houseArea = Number(e.target.value)
      this.setState({
          mHouseArea: houseArea,
      })


    } catch(err) {
      console.log("onInputHouseArea: ", err);
      Taro.showToast({title: "请输入正确的面积！"})
    }
  }

  onInputTotalPrice = (e) => {
    try {
      let totalPrice = Number(e.target.value)
      this.setState({
          mTotalPrice: totalPrice,
      })

      this.updateTotalPayment(totalPrice,
              this.state.mTotalFee, this.state.mTotalTax)
    } catch(err) {
      console.log("onInputTotalPrice: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputOriginPrice = (e) => {
    try {
      let originPrice = Number(e.target.value)
      /*
      if (e.target.value.length != 0) {
        originPrice = parseFloat(e.target.value)
      }
      */
      // FIXME
      if (e.target.value.length != 0 && !Util.isNumber(originPrice)) {
        console.log("onInputOriginPrice-1-2: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
        return
      }
      this.setState({
          mOriginPrice: originPrice,
      })

      this.updatePersonalIncomeTax(this.state.mWebSignPrice, originPrice)

    } catch(err) {
      console.log("onInputOriginPrice: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onWebSignPriceChanged = (webSignPrice) => {
    this.setState({
        mWebSignPrice: webSignPrice,
    })
    let personalIncomeTax = this.updatePersonalIncomeTax2(webSignPrice, this.state.mOriginPrice)

    this.updateDeedTax2(webSignPrice, this.state.mDeedTaxRate,
          this.state.mWillInputDeedTaxManual, this.state.mInputDeedTaxManual,
          personalIncomeTax, this.state.mBusinessTax,
          this.state.mOtherTax)
  }

  onInputWebSignPrice = (e) => {
    try {
      let webSignPrice = Number(e.target.value)
      this.onWebSignPriceChanged(webSignPrice)
    } catch(err) {
      console.log("onInputWebSignPrice: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputLowestGuidePrice = (e) => {
    console.log("onInputLowestGuidePrice: ", e.target.value);
    try {
      let lowestGuidePrice = Number(e.target.value)
      this.setState({
          mLowestGuidePrice: lowestGuidePrice,
      })

    } catch(err) {
      console.log("onInputLowestGuidePrice: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputAgencyFee = (e) => {
    try {
      let agencyFee = Number(e.target.value)
      this.setState({
          mAgencyFee: agencyFee,
      })
      this.updateTotalFee(agencyFee,
          this.state.mLoanServiceFee, this.state.mEvaluationFee,
          this.state.mMortgageRegistrationFee, this.state.mOtherFee)
    } catch(err) {
      console.log("onInputAgencyFee: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputLoanServiceFee = (e) => {
    try {
      let loanServiceFee = Number(e.target.value)
      this.setState({
          mLoanServiceFee: loanServiceFee,
      })
      this.updateTotalFee(this.state.mAgencyFee,
          loanServiceFee, this.state.mEvaluationFee,
          this.state.mMortgageRegistrationFee, this.state.mOtherFee)
    } catch(err) {
      console.log("onInputLoanServiceFee: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputEvaluationFee = (e) => {
    try {
      let evaluationFee = Number(e.target.value)
      this.setState({
          mEvaluationFee: evaluationFee,
      })
      this.updateTotalFee(this.state.mAgencyFee,
          this.state.mLoanServiceFee, evaluationFee,
          this.state.mMortgageRegistrationFee, this.state.mOtherFee)
    } catch(err) {
      console.log("onInputEvaluationFee: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputMortgageRegistrationFee = (e) => {
    try {
      let mortgageRegistrationFee = Number(e.target.value)
      this.setState({
          mMortgageRegistrationFee: mortgageRegistrationFee,
      })
      this.updateTotalFee(this.state.mAgencyFee,
          this.state.mLoanServiceFee, this.state.mEvaluationFee,
          mortgageRegistrationFee, this.state.mOtherFee)
    } catch(err) {
      console.log("onInputMortgageRegistrationFee: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputOtherFee = (e) => {
    try {
      let otherFee = Number(e.target.value)
      this.setState({
          mOtherFee: otherFee,
      })
      this.updateTotalFee(this.state.mAgencyFee,
          this.state.mLoanServiceFee, this.state.mEvaluationFee,
          this.state.mMortgageRegistrationFee, otherFee)
    } catch(err) {
      console.log("onInputOtherFee: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputCommercialLoan = (e) => {
    try {
      let commercialLoan = Number(e.target.value)
      this.setState({
          mCommercialLoan: commercialLoan,
      })

      this.updateTotalLoan(commercialLoan,
          this.state.mProvidentFundLoan, this.state.mOtherLoan)
    } catch(err) {
      console.log("onInputCommercialLoan: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputProvidentFundLoan = (e) => {
    try {
      let providentFundLoan = Number(e.target.value)
      this.setState({
          mProvidentFundLoan: providentFundLoan,
      })

      this.updateTotalLoan(this.state.mCommercialLoan,
          providentFundLoan, this.state.mOtherLoan)
    } catch(err) {
      console.log("onInputProvidentFundLoan: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputOtherLoan = (e) => {
    try {
      let otherLoan = Number(e.target.value)
      this.setState({
          mOtherLoan: otherLoan,
      })

      this.updateTotalLoan(this.state.mCommercialLoan,
          this.state.mProvidentFundLoan, otherLoan)
    } catch(err) {
      console.log("onInputOtherLoan: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputDeedTaxManual = (e) => {
    if (!this.state.mWillInputDeedTaxManual) {
      console.error('Should not update deed tax manully, e.target.value:',
          e.target.value)
      return
    }
    try {
      let inputDeedTaxManual = Number(e.target.value)
      this.setState({
          mInputDeedTaxManual: inputDeedTaxManual,
      })

      this.updateDeedTax(this.state.mWebSignPrice, this.state.mDeedTaxRate,
            this.state.mWillInputDeedTaxManual, inputDeedTaxManual)

    } catch(err) {
      console.log("onInputDeedTaxManual: ", err);
      Taro.showToast({title: "请输入正确的契税金额！"})
    }
  }

  clickWillInputDeedTaxManualCheckbox = (e) => {
    console.log('clickWillInputDeedTaxManualCheckbox, e.detail:', e.detail)
    this.setState({
        mWillInputDeedTaxManual: !this.state.mWillInputDeedTaxManual,
        mInputDeedTaxManual: 0,
    })
  }

  onClickFirstHouseRadio = (idx, e) => {
    console.log('onClickFirstHouseRadio, idx:', idx)
    this.setState({
        mFirstHouseRadioValue: idx,
    })
  }

  onClickAboveTwoYearsRadio = (idx, e) => {
    console.log('onClickAboveTwoYearsRadio, value:', e.detail.value)
    this.setState({
        mAboveTwoYearsRadioValue: idx,
    })
  }

  onClickOnlyHouseRadio = (idx, e) => {
    console.log('onClickOnlyHouseRadio, value:', e.detail.value)
    this.setState({
        mOnlyHouseRadioValue: idx,
    })
  }

  render () {
    let classNameForInputDeedTaxManual = this.state.mWillInputDeedTaxManual ?
            'idx-input-text idx-input-text-deedtax' : 'idx-input-text-disable idx-input-text-deedtax'

    return (
      <View className='idx-top-container'>
        <View className='idx-top-container-2'>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>房子名称</Text>
            <Input className='idx-input-text' type='text' placeholder='房子位置' onInput={this.onInputHouseName} />
            <Text className='idx-input-title2'>房子面积</Text>
            <Input className='idx-input-text' type='digit' placeholder='房子面积' maxLength='10' onInput={this.onInputHouseArea} />
          </View>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>总价</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputTotalPrice} />
            <Text className='idx-input-title2'>原值</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputOriginPrice} />
          </View>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>网签价</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputWebSignPrice} />
            <Text className='idx-input-title2'>最低指导价</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputLowestGuidePrice} />
          </View>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>中介费</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputAgencyFee} />
            <Text className='idx-input-title2'>贷款服务费</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputLoanServiceFee} />
          </View>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>评估费</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputEvaluationFee} />
            <Text className='idx-input-title2'>抵押登记费</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputMortgageRegistrationFee} />
          </View>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>其他费用（万元）</Text>
            <Input className='idx-input-text' type='digit' placeholder='请输入其他费用' maxLength='10' onInput={this.onInputOtherFee} />
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>契税（万元）</Text>
            <Input className={classNameForInputDeedTaxManual}
              disabled={!this.state.mWillInputDeedTaxManual} type='text'
              placeholder='0' maxLength='10'
              onInput={this.onInputDeedTaxManual} />
            <CheckboxGroup>
              <View className='idx-input-title'>
                <Checkbox checked={this.state.mWillInputDeedTaxManual}
                  onClick={this.clickWillInputDeedTaxManualCheckbox}>
                      手动输入契税</Checkbox>
              </View>
            </CheckboxGroup>
          </View>

          <RadioGroup>
            <View className='idx-input-item-container'>
              <Text className='idx-radio-title'>买方是否首套：</Text>
              {this.state.mIsFirstHouseRadioList.map((item, i) => {
                return (
                  <View onClick={this.onClickFirstHouseRadio.bind(this, item.value)} >
                    <Radio value={item.value}
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
                  <View onClick={this.onClickAboveTwoYearsRadio.bind(this, item.value)} >
                    <Radio value={item.value}
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
                    <Radio value={item.value}
                      checked={item.value == this.state.mOnlyHouseRadioValue}
                      style={{transform: 'scale(0.8)', padding: '0px 15px'}} color='#FF7464'>
                      <Text className='idx-radio-text'>{item.text}</Text>
                    </Radio>
                  </View>)
              })}
            </View>
          </RadioGroup>


          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>商贷</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputCommercialLoan} />
            <Text className='idx-input-title2'>公积金贷款</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputProvidentFundLoan} />
          </View>
          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>其他贷款</Text>
            <Input className='idx-input-text' type='digit' placeholder='万元' maxLength='10' onInput={this.onInputOtherLoan} />
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>首付</Text>
            <Text className='idx-input-text'>{this.state.mFirstPayment.toFixed(2)}</Text>
            <Text className='idx-input-title2'>总支付</Text>
            <Text className='idx-input-text'>{this.state.mTotalPayment.toFixed(2)}</Text>
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>总费用</Text>
            <Text className='idx-input-text'>{this.state.mTotalFee.toFixed(2)}</Text>
            <Text className='idx-input-title2'>总税款</Text>
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
            <Text className='idx-input-title'>营业税</Text>
            <Text className='idx-input-text'>{this.state.mBusinessTax.toFixed(2)}</Text>
            <Text className='idx-input-title2'>其他税</Text>
            <Text className='idx-input-text'>{this.state.mOtherTax.toFixed(2)}</Text>
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>中介费</Text>
            <Text className='idx-input-text'>{this.state.mAgencyFee.toFixed(2)}</Text>
            <Text className='idx-input-title2'>贷款服务费</Text>
            <Text className='idx-input-text'>{this.state.mLoanServiceFee.toFixed(2)}</Text>
          </View>

          <View>实际网签价：{this.state.mWebSignPrice.toFixed(2)}</View>
          <Button type='primary' onClick={this.lowestPersonalIncomeTax}>
            个税为零计算</Button>
          <Button type='primary'>开始计算</Button>
        </View>
      </View>
    )
  }
}