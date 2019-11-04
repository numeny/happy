import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup, Picker } from '@tarojs/components'
import './calc_loan.scss'

import { Log } from '@util/log'
import { Util } from '../../util/util'
import { sCalcClientDecider } from '../index/cityclient/city_client_decider'
// FIXIME
// import TaroRegionPicker from '../../components/taro-region-picker/index'

import { Toolbar } from '../common/mytoolbar'

import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

let sCalcClient = null

const LoanType = {
  CommercialLoan: 0,
  ProvidentFundLoan: 1,
  OtherLoan: 2,
}

const RepaymentType = {
  CapitalAndInterest: 0,
  Capital: 1,
}

const DefaultRateDiscountIdx = {
  CommercialLoan: '3',
  ProvidentFundLoan: '0',
  OtherLoan: '3',
}

// FIXME
const BaseInterestRateCommercialLoan = 4.9
const BaseInterestRateProvidentFundLoan = 3.25

export default class CalcLoan extends Component {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '茜茜猫首付计算神器',
  }

  constructor(props) {
    super(props)


    this.state = {
      mEditable: true,

      mTitleArray: ['商业贷款', '公积金贷款', '其他贷款'],

      mIsShowingLoanViewCommercialLoan: false,
      mIsShowingLoanViewProvidentFundLoan: false,
      mIsShowingLoanViewOtherLoan: false,

      mTotalCommercialLoan: this.props.commercialLoan,
      mTotalProvidentFundLoan: this.props.providentFundLoan,
      mTotalOtherLoan: this.props.otherLoan,

      mDurationIdxCommercialLoan: 24,
      mDurationIdxProvidentFundLoan: 24,
      mDurationIdxOtherLoan: 24,

      mDurationCommercialLoan: 25,
      mDurationProvidentFundLoan: 25,
      mDurationOtherLoan: 25,

      mRateCommercialLoan: BaseInterestRateCommercialLoan,
      mRateProvidentFundLoan: BaseInterestRateProvidentFundLoan,
      mRateOtherLoan: BaseInterestRateCommercialLoan,

      mRateDiscountIdxCommercialLoan: Number(DefaultRateDiscountIdx.CommercialLoan),
      mRateDiscountIdxProvidentFundLoan: Number(DefaultRateDiscountIdx.ProvidentFundLoan),
      mRateDiscountIdxOtherLoan: Number(DefaultRateDiscountIdx.OtherLoan),

      mMonthlyRepaymentCommercialLoan: 0,
      mMonthlyRepaymentProvidentFundLoan: 0,
      mMonthlyRepaymentOtherLoan: 0,

      mMonthlyRepaymentTotalLoan: 0,

      mRadioValueCommercialLoanPaymentMethod: RepaymentType.CapitalAndInterest,
      mRadioValueProvidentFundLoanPaymentMethod: RepaymentType.CapitalAndInterest,
      mRadioValueOtherLoanPaymentMethod: RepaymentType.CapitalAndInterest,

      mPaymentMethodRadioList: [
        { value: 0, text: '等额本息', checked: true, },
        { value: 1, text: '等额本金', checked: false, },
      ],
      mDurationSelector: [
        '1年', '2年', '3年', '4年', '5年',
        '6年', '7年', '8年', '9年', '10年',
        '11年', '12年', '13年', '14年', '15年',
        '16年', '17年', '18年', '19年', '20年',
        '21年', '22年', '23年', '24年', '25年',
        '26年', '27年', '28年', '29年', '30年',
      ],
      mCommercialLoanRateSelector: [
        '基准利率8.5折', '基准利率9折', '基准利率9.5折',
        '基准利率(4.9%)', '基准利率1.05倍', '基准利率1.1倍',
        '基准利率1.15倍', '基准利率1.2倍', '基准利率1.25倍',
      ],
      mCommercialLoanRateSelectorValueArray: [
        0.85, 0.9, 0.95,
        1.0, 1.05, 1.1,
        1.15, 1.2, 1.25,
      ],
      mProvidentFundLoanRateSelector: [
        '基准利率(3.25%)', '基准利率1.05倍', '基准利率1.1倍',
        '基准利率1.15倍', '基准利率1.2倍', '基准利率1.25倍',
      ],
      mProvidentFundLoanRateSelectorValueArray: [
        1.0, 1.05, 1.1,
        1.15, 1.2, 1.25,
      ],
    }
  }

  componentWillMount () { }

  componentWillReceiveProps(nextProps) {
    Log.log('componentWillReceiveProps--------: ')
    if (nextProps.commercialLoan == this.state.mTotalCommercialLoan
        && nextProps.providentFundLoan == this.state.mTotalProvidentFundLoan
        && nextProps.otherLoan == this.state.mTotalOtherLoan) {
      return
    }
    this.setState({
      mTotalCommercialLoan: nextProps.commercialLoan,
      mTotalProvidentFundLoan: nextProps.providentFundLoan,
      mTotalOtherLoan: nextProps.otherLoan,
    }, () => {
      this.updateAllLoanResult()
    })
  }

  onShareAppMessage = (share) => {
    return {
      title: Util.appTitle,
      path: '/pages/index/index?' + param
    }
  }

  updateLoanTotalResult = () => {
      this.setState({
        mMonthlyRepaymentTotalLoan:
            mMonthlyRepaymentCommercialLoan
          + mMonthlyRepaymentProvidentFundLoan
          + mMonthlyRepaymentOtherLoan,
      }, => this.updateParentViewData())
  }

  updateLoanResult = (loanType) => {
    let radioValuePaymentMethod =
          this.getRadioValuePaymentMethod(loanType)
    let loan = this.getLoan(loanType)
    let interestRate = this.getInterestRate(loanType)
    let loanDuration = this.getLoanDuration(loanType)
    let monthlyPayment = this.calcMonthlyRepayment(
                            radioValuePaymentMethod, loan,
                            interestRate, loanDuration)
    if (LoanType.CommercialLoan == loanType) {
      this.setState({
        mMonthlyRepaymentCommercialLoan: monthlyPayment,
      }, this.updateLoanTotalResult())
    } else if (LoanType.ProvidentFundLoan == loanType) {
      this.setState({
        mMonthlyRepaymentProvidentFundLoan: monthlyPayment,
      }, this.updateLoanTotalResult())
    } else if (LoanType.OtherLoan == loanType) {
      this.setState({
        mMonthlyRepaymentOtherLoan: monthlyPayment,
      }, this.updateLoanTotalResult())
    }
  }

  updateParentViewData = () => {
    if (this.props.onUpdateData == undefined
          && this.props.onUpdateData == null) {
      return
    }
    this.props.onUpdateData({
      totalCommercialLoan: this.state.mTotalCommercialLoan,
      totalProvidentFundLoan: this.state.mTotalProvidentFundLoan,
      totalOtherLoan: this.state.mTotalOtherLoan,
      monthlyRepaymentCommercialLoan: this.state.mMonthlyRepaymentCommercialLoan,
      monthlyRepaymentProvidentFundLoan: this.state.mMonthlyRepaymentProvidentFundLoan,
      monthlyRepaymentOtherLoan: this.state.mMonthlyRepaymentOtherLoan,
    })
  }

  updateAllLoanResult = () => {
    Log.log('updateAllLoanResult------------')
    this.updateLoanResult(LoanType.CommercialLoan)
    this.updateLoanResult(LoanType.ProvidentFundLoan)
    this.updateLoanResult(LoanType.OtherLoan)
  }

  onClickPaymentMethodRadio = (value, loanType, e) => {
    Log.log('onClickPaymentMethodRadio, value: '
        + value + ', loanType: ' + loanType)
    if (LoanType.CommercialLoan == loanType) {
      this.setState({
          mRadioValueCommercialLoanPaymentMethod: value,
      }, () => {
          this.updateLoanResult(loanType)
      })
    } else if (LoanType.ProvidentFundLoan == loanType) {
      this.setState({
          mRadioValueProvidentFundLoanPaymentMethod: value,
      }, () => {
          this.updateLoanResult(loanType)
      })
    } else if (LoanType.OtherLoan == loanType) {
      this.setState({
          mRadioValueOtherLoanPaymentMethod: value,
      }, () => {
          this.updateLoanResult(loanType)
      })
    }
  }

  onInputLoan = (loanType, e) => {
    try {
      let totalLoan = Number(e.target.value)
      Log.log('onInputLoan, totalLoan: '
            + totalLoan + ', loanType: ' + loanType)
      if (LoanType.CommercialLoan == loanType) {
        this.setState({
            mTotalCommercialLoan: totalLoan,
        }, () => {
            this.updateLoanResult(loanType)
        })
      } else if (LoanType.ProvidentFundLoan == loanType) {
        this.setState({
            mTotalProvidentFundLoan: totalLoan,
        }, () => {
            this.updateLoanResult(loanType)
        })
      } else if (LoanType.OtherLoan == loanType) {
        this.setState({
            mTotalOtherLoan: totalLoan,
        }, () => {
            this.updateLoanResult(loanType)
        })
      }
    } catch(err) {
      Log.error("onInputLoan: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputLoanRate = (loanType, e) => {
    try {
      let interestRate = Number(e.target.value)
      Log.log('onInputLoanRate, interestRate: '
            + interestRate + ', loanType: ' + loanType)
      if (LoanType.CommercialLoan == loanType) {
        this.setState({
            mRateCommercialLoan: interestRate,
        }, () => {
            this.updateLoanResult(loanType)
        })
      } else if (LoanType.ProvidentFundLoan == loanType) {
        this.setState({
            mRateProvidentFundLoan: interestRate,
        }, () => {
            this.updateLoanResult(loanType)
        })
      } else if (LoanType.OtherLoan == loanType) {
        this.setState({
            mRateOtherLoan: interestRate,
        }, () => {
            this.updateLoanResult(loanType)
        })
      }
    } catch(err) {
      Log.error("onInputLoanRate: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onDurationChanged = (loanType, e) => {
    Log.log('picker发送选择改变，携带值为', e.detail.value)
    let durationIdx = Number(e.detail.value)
    if (LoanType.CommercialLoan == loanType) {
      this.setState({
          mDurationIdxCommercialLoan: durationIdx,
      }, () => {
          this.updateLoanResult(loanType)
      })
    } else if (LoanType.ProvidentFundLoan == loanType) {
      this.setState({
          mDurationIdxProvidentFundLoan: durationIdx,
      }, () => {
          this.updateLoanResult(loanType)
      })
    } else if (LoanType.OtherLoan == loanType) {
      this.setState({
          mDurationIdxOtherLoan: durationIdx,
      }, () => {
          this.updateLoanResult(loanType)
      })
    }
  }

  onLoanRatePickerChanged = (loanType, e) => {
    let index = Number(e.detail.value)
    let rateDiscount = 1.0 
    let interestRate = BaseInterestRateCommercialLoan
    if (LoanType.CommercialLoan == loanType) {
      rateDiscount = this.state.mCommercialLoanRateSelectorValueArray[index]
      interestRate = rateDiscount * BaseInterestRateCommercialLoan
      this.setState({
          mRateCommercialLoan: interestRate,
          mRateDiscountIdxCommercialLoan: index,
      }, () => {
          this.updateLoanResult(loanType)
      })
    } else if (LoanType.ProvidentFundLoan == loanType) {
      rateDiscount = this.state.mProvidentFundLoanRateSelectorValueArray[index]
      interestRate = rateDiscount * BaseInterestRateProvidentFundLoan
      this.setState({
          mRateProvidentFundLoan: interestRate,
          mRateDiscountIdxProvidentFundLoan: index,
      }, () => {
          this.updateLoanResult(loanType)
      })
    } else if (LoanType.OtherLoan == loanType) {
      rateDiscount = this.state.mCommercialLoanRateSelectorValueArray[index]
      interestRate = rateDiscount * BaseInterestRateCommercialLoan
      this.setState({
          mRateOtherLoan: interestRate,
          mRateDiscountIdxOtherLoan: index,
      }, () => {
          this.updateLoanResult(loanType)
      })
    } else {
      console.error('[Error] No this loan type!')
    }
    console.log('picker发送选择改变，携带值为' , e.detail.value
        + ', rateDiscount: ' + rateDiscount
        + ', interestRate: ' + interestRate)
  }

  calcMonthlyRepayment = (repaymentType, totalLoan,
      interestRate, years) => {
    console.error('calcMonthlyRepayment()'
        + ', repaymentType: ' + repaymentType
        + ', totalLoan: ' + totalLoan
        + ', interestRate: ' + interestRate
        + ', years: ' + years)
    // 等额本金：
    //（贷款本金/ 还款月数）+（本金 — 已归还本金累计额）×每月利率
    if (repaymentType == RepaymentType.Capital) {
      let firstMonthlyPayment = (totalLoan * interestRate) / 1200
          + totalLoan / (years * 12)
      return firstMonthlyPayment
    }
    // 等额本息：
    // [贷款本金×月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数－1]
    let monthlyRate = interestRate / 1200
    let maxRate = 1.0
    // maxRate =（1+月利率）^还款月数
    for (let i = 0; i < (12 * years); i++) {
      maxRate = maxRate * (1 + monthlyRate)
    }
    let monthlyPayment = 0
    if ((maxRate - 1) != 0) {
      monthlyPayment = (totalLoan * monthlyRate * maxRate) / (maxRate - 1)
    }
    console.error('calcMonthlyRepayment()'
        + ', monthlyRate: ' + monthlyRate
        + ', maxRate: ' + maxRate
        + ', 12 * years: ' + (12 * years)
        + ', monthlyPayment: ' + monthlyPayment)
    return monthlyPayment 
  }

  startCalc = (e) => {
    this.updateAllLoanResult()
  }

  clearData = (e) => {
    this.setState({
      mIsShowingLoanViewCommercialLoan: false,
      mIsShowingLoanViewProvidentFundLoan: false,
      mIsShowingLoanViewOtherLoan: false,

      mTotalCommercialLoan: 0,
      mTotalProvidentFundLoan: 0,
      mTotalOtherLoan: 0,

      mDurationIdxCommercialLoan: 24,
      mDurationIdxProvidentFundLoan: 24,
      mDurationIdxOtherLoan: 24,

      mDurationCommercialLoan: 25,
      mDurationProvidentFundLoan: 25,
      mDurationOtherLoan: 25,

      mRateCommercialLoan: BaseInterestRateCommercialLoan,
      mRateProvidentFundLoan: BaseInterestRateProvidentFundLoan,
      mRateOtherLoan: BaseInterestRateCommercialLoan,

      mRateDiscountIdxCommercialLoan: Number(DefaultRateDiscountIdx.CommercialLoan),
      mRateDiscountIdxProvidentFundLoan: Number(DefaultRateDiscountIdx.ProvidentFundLoan),
      mRateDiscountIdxOtherLoan: Number(DefaultRateDiscountIdx.OtherLoan),

      mMonthlyRepaymentCommercialLoan: 0,
      mMonthlyRepaymentProvidentFundLoan: 0,
      mMonthlyRepaymentOtherLoan: 0,

      mRadioValueCommercialLoanPaymentMethod: RepaymentType.CapitalAndInterest,
      mRadioValueProvidentFundLoanPaymentMethod: RepaymentType.CapitalAndInterest,
      mRadioValueOtherLoanPaymentMethod: RepaymentType.CapitalAndInterest,
    })
  }

  recaculate = (e) => {
    this.setState(
      prevState => ({
        mEditable: true,
      })
    )
  }

  showLoanView = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      this.setState(
        prevState => ({
          mIsShowingLoanViewCommercialLoan: !this.state.mIsShowingLoanViewCommercialLoan,
        })
      )
      this.updateLoanResult(loanType)
    } else if (loanType == LoanType.ProvidentFundLoan) {
      this.setState(
        prevState => ({
          mIsShowingLoanViewProvidentFundLoan: !this.state.mIsShowingLoanViewProvidentFundLoan,
        })
      )
      this.updateLoanResult(loanType)
    } else if (loanType == LoanType.OtherLoan) {
      this.setState(
        prevState => ({
          mIsShowingLoanViewOtherLoan: !this.state.mIsShowingLoanViewOtherLoan,
        })
      )
      this.updateLoanResult(loanType)
    } else {
      return true
    }
  }

  isShowingLoanView = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.state.mIsShowingLoanViewCommercialLoan
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mIsShowingLoanViewProvidentFundLoan
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mIsShowingLoanViewOtherLoan
    } else {
      return true
    }
  }

  getLoan = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.state.mTotalCommercialLoan
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mTotalProvidentFundLoan
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mTotalOtherLoan
    }
  }

  getInterestRate = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.state.mRateCommercialLoan
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mRateProvidentFundLoan
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mRateOtherLoan
    }
  }

  getRateDiscountText = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.state.mCommercialLoanRateSelector[
              this.state.mRateDiscountIdxCommercialLoan]
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mProvidentFundLoanRateSelector[
              this.state.mRateDiscountIdxProvidentFundLoan]
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mCommercialLoanRateSelector[
              this.state.mRateDiscountIdxOtherLoan]
    }
  }

  getDefaultRateDiscountIdx = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return DefaultRateDiscountIdx.CommercialLoan
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return DefaultRateDiscountIdx.ProvidentFundLoan
    } else if (loanType == LoanType.OtherLoan) {
      return DefaultRateDiscountIdx.OtherLoan
    }
  }

  getMonthlyRepayment = (loanType) => {
    let loan = 0
    if (loanType == LoanType.CommercialLoan) {
      loan = this.state.mMonthlyRepaymentCommercialLoan
    } else if (loanType == LoanType.ProvidentFundLoan) {
      loan = this.state.mMonthlyRepaymentProvidentFundLoan
    } else if (loanType == LoanType.OtherLoan) {
      loan = this.state.mMonthlyRepaymentOtherLoan
    }
    return loan * 10000
  }

  getRadioValuePaymentMethod = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.state.mRadioValueCommercialLoanPaymentMethod
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mRadioValueProvidentFundLoanPaymentMethod
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mRadioValueOtherLoanPaymentMethod
    } else {
      console.error('[Error] getRadioValuePaymentMethod, no loanTyp!')
      return 0
    }
  }

  getLoanDuration = (loanType) => {
    let duration = 0
    if (loanType == LoanType.CommercialLoan) {
      duration = this.state.mDurationIdxCommercialLoan
    } else if (loanType == LoanType.ProvidentFundLoan) {
      duration = this.state.mDurationIdxProvidentFundLoan
    } else if (loanType == LoanType.OtherLoan) {
      duration = this.state.mDurationIdxOtherLoan
    } else {
      console.error('[Error] getLoanDurationIdx, no loanTyp!')
      duration = 0
    }
    return duration + 1
  }

  getLoanDurationIdx = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.state.mDurationIdxCommercialLoan
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mDurationIdxProvidentFundLoan
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mDurationIdxOtherLoan
    } else {
      console.error('[Error] getLoanDurationIdx, no loanTyp!')
      return 0
    }
  }

  getLoanDurationText = (loanType) => {
    return this.state.mDurationSelector[
            this.getLoanDurationIdx(loanType)]
  }

  render () {
    const {mPaymentMethodRadioList} = this.state
    return (
      <View className='cl-top-container'>
        <View>
          <View className='cl-top-title-container'>
            <View className='cl-top-title-unit'>计算单位：万元</View>
          </View>

        {this.state.mTitleArray.map((item0, loanType) => {
          return (
          <View>
            <View className='cl-item-title'
              onClick={this.showLoanView.bind(this, loanType)}>{item0}
              {this.isShowingLoanView(loanType) ?
                <View className='at-icon at-icon-chevron-up'></View>
                : <View className='at-icon at-icon-chevron-down'></View>}
            </View>
            {this.isShowingLoanView(loanType) &&
            <View>
            <RadioGroup>
              <View className='cl-input-item-container'>
                <Text className='cl-radio-title'>还款方式：</Text>
                {mPaymentMethodRadioList.map((item, i) => {
                  return (
                    <View onClick={this.onClickPaymentMethodRadio.bind(this, item.value, loanType)} >
                      <Radio value={item.value} disabled={!this.state.mEditable}
                        checked={item.value == this.getRadioValuePaymentMethod(loanType)}
                        style={{transform: 'scale(0.8)'}} color='#FF7464'>
                      </Radio>
                      <Text className='cl-radio-text'>{item.text}</Text>
                    </View>)
                })}
              </View>
            </RadioGroup>
            <View className='cl-input-item-container'>
              <Text className='cl-input-title'>贷款额</Text>
              <Input className='cl-input-text' type='digit' placeholder='万元'
                  disabled={!this.state.mEditable} maxLength='10'
                  value={this.getLoan(loanType)}
                  onInput={this.onInputLoan.bind(this, loanType)} />
              <Text className='cl-input-title2'>贷款年限</Text>
              <View className='cl-input-text'>
                <Picker mode='selector' range={this.state.mDurationSelector} value='24'
                     onChange={this.onDurationChanged.bind(this, loanType)} className='cl-duration-picker'>
                  {this.getLoanDurationText(loanType)}
                  <View className='at-icon at-icon-chevron-down'></View>
                </Picker>
              </View>
            </View>
          
            <View className='cl-input-item-container'>
              <Text className='cl-input-title'>利率</Text>
              <Text className='cl-rate-discount-placehold'>
                {this.getRateDiscountText(loanType)}
              </Text>
              <View className='cl-input-text-rate-container'>
                <Input className='cl-input-text-rate' type='digit' placeholder='贷款利率' value={this.getInterestRate(loanType)}
                    disabled={!this.state.mEditable} maxLength='6' onInput={this.onInputLoanRate.bind(this, loanType)} />
                <Picker mode='selector' value={this.getDefaultRateDiscountIdx(loanType)}
                    range={(loanType == LoanType.ProvidentFundLoan) ?
                        this.state.mProvidentFundLoanRateSelector
                          : this.state.mCommercialLoanRateSelector}
                    onChange={this.onLoanRatePickerChanged.bind(this, loanType)} className='cl-duration-picker'>
                  %<View className='at-icon at-icon-chevron-down'></View>
                </Picker>
              </View>
            </View>
            <View className='cl-input-item-container-bold'>
              <Text className='cl-input-title-bold'>每月还款(元)</Text>
              <Text className='cl-input-title-bold'>
              {this.getMonthlyRepayment(loanType).toFixed(0)}
              </Text>
            </View>
            </View>}
          </View>
        )})}

        {this.state.mEditable ?
           (<View className='cl-button-container'>
              <Button className='cl-button-item' type='primary' onClick={this.clearData}>清空数据</Button>
              <Button className='cl-button-item' type='primary' onClick={this.startCalc}>开始计算</Button>
            </View>)
              : (<View className='cl-button-container'>
                    <Button className='cl-button-item' type='primary' onClick={this.recaculate}>重新计算</Button>
                    <Button className='cl-button-item' type='primary' open-type='share'>分享结果</Button>
                  </View>)}
        </View>
      </View>
    )
  }
}
