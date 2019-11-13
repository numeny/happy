import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup, Picker } from '@tarojs/components'
import './calc_loan.scss'

import { connect } from '@tarojs/redux'
import { setCommercialLoanTotal, setCommercialLoanMonthlyPayment, setProvidentFundLoanTotal, setProvidentFundLoanMonthlyPayment, setOtherLoanTotal, setOtherLoanMonthlyPayment, setAllLoanTotal, setAllLoanMonthlyPayment } from '../../actions/loan'

import { Log } from '@util/log'
import { Util, LoanType, RepaymentType } from '../../util/util'
import { sCalcClientDecider } from '../index/cityclient/city_client_decider'
// FIXIME
// import TaroRegionPicker from '../../components/taro-region-picker/index'

import { Toolbar } from '../common/mytoolbar'

import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

const ClickShowingLoanView = {
  ClickShowingLoanViewFalse: false,
  ClickShowingLoanViewTrue: true,
  NotClickShowingLoanView: 3,
}

const DefaultRateDiscountIdx = {
  CommercialLoan: '3',
  ProvidentFundLoan: '0',
  OtherLoan: '3',
}

// FIXME
const BaseInterestRateCommercialLoan = 4.9
const BaseInterestRateProvidentFundLoan = 3.25

@connect(({ loan }) => ({
  loan
}), (dispatch) => ({
  setCommercialLoanTotal (loan) {
    dispatch(setCommercialLoanTotal(loan))
  },
  setCommercialLoanMonthlyPayment (loan) {
    dispatch(setCommercialLoanMonthlyPayment(loan))
  },
  setProvidentFundLoanTotal (loan) {
    dispatch(setProvidentFundLoanTotal(loan))
  },
  setProvidentFundLoanMonthlyPayment (loan) {
    dispatch(setProvidentFundLoanMonthlyPayment(loan))
  },
  setOtherLoanTotal (loan) {
    dispatch(setOtherLoanTotal(loan))
  },
  setOtherLoanMonthlyPayment (loan) {
    dispatch(setOtherLoanMonthlyPayment(loan))
  },
  setAllLoanTotal (loan) {
    dispatch(setAllLoanTotal(loan))
  },
  setAllLoanMonthlyPayment (loan) {
    dispatch(setAllLoanMonthlyPayment(loan))
  }
}))

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

      mHasClickedShowingLoanViewCommercialLoan: false,
      mHasClickedShowingLoanViewProvidentFundLoan: false,
      mHasClickedShowingLoanViewOtherLoan: false,

      mIsShowingLoanViewCommercialLoan: false,
      mIsShowingLoanViewProvidentFundLoan: false,
      mIsShowingLoanViewOtherLoan: false,

      mDurationCommercialLoan: 25,
      mDurationProvidentFundLoan: 25,
      mDurationOtherLoan: 25,

      mRateCommercialLoan: BaseInterestRateCommercialLoan,
      mRateProvidentFundLoan: BaseInterestRateProvidentFundLoan,
      mRateOtherLoan: BaseInterestRateCommercialLoan,

      mRateInputManualCommercialLoan: false,
      mRateInputManualProvidentFundLoan: false,
      mRateInputManualOtherLoan: false,

      mRateDiscountIdxCommercialLoan: Number(DefaultRateDiscountIdx.CommercialLoan),
      mRateDiscountIdxProvidentFundLoan: Number(DefaultRateDiscountIdx.ProvidentFundLoan),
      mRateDiscountIdxOtherLoan: Number(DefaultRateDiscountIdx.OtherLoan),

      mTotalRepaymentCommercialLoan: 0,
      mTotalRepaymentProvidentFundLoan: 0,
      mTotalRepaymentOtherLoan: 0,
      mTotalRepaymentAllLoan: 0,

      mTotalInterestCommercialLoan: 0,
      mTotalInterestProvidentFundLoan: 0,
      mTotalInterestOtherLoan: 0,
      mTotalInterestAllLoan: 0,

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

  isPropsChanged (nextProps) {
    return this.props.loan.mCommercialLoanTotal != nextProps.loan.mCommercialLoanTotal
        || this.props.loan.mCommercialLoanMonthlyPayment != nextProps.loan.mCommercialLoanMonthlyPayment
        || this.props.loan.mProvidentFundLoanTotal != nextProps.loan.mProvidentFundLoanTotal
        || this.props.loan.mProvidentFundLoanMonthlyPayment != nextProps.loan.mProvidentFundLoanMonthlyPayment
        || this.props.loan.mOtherLoanTotal != nextProps.loan.mOtherLoanTotal
        || this.props.loan.mOtherLoanMonthlyPayment != nextProps.loan.mOtherLoanMonthlyPayment
  }

  componentWillReceiveProps(nextProps) {
    Log.log('componentWillReceiveProps--------: 1')
    if (!this.isPropsChanged(nextProps)) {
      return
    }

    Log.log('componentWillReceiveProps--------: 2')
    this.updateLoanTotalResultForProps(nextProps)
  }

  onShareAppMessage = (share) => {
    return {
      title: Util.appTitle,
      path: '/pages/index/index?' + param
    }
  }

  updateLoanTotalResultForProps = (nextProps) => {
    Log.log('updateLoanTotalResultForProps--------: '
        + ', ' + nextProps.loan.mCommercialLoanMonthlyPayment
        + ', ' + nextProps.loan.mProvidentFundLoanMonthlyPayment
        + ', ' + nextProps.loan.mOtherLoanMonthlyPayment)
      nextProps.setAllLoanMonthlyPayment(
            nextProps.loan.mCommercialLoanMonthlyPayment
          + nextProps.loan.mProvidentFundLoanMonthlyPayment
          + nextProps.loan.mOtherLoanMonthlyPayment)
      nextProps.setAllLoanTotal(
            nextProps.loan.mCommercialLoanTotal
          + nextProps.loan.mProvidentFundLoanTotal
          + nextProps.loan.mOtherLoanTotal)
  }

  updateLoanTotalResultForState = () => {
      this.setState({
        mTotalRepaymentAllLoan:
            this.state.mTotalRepaymentCommercialLoan
          + this.state.mTotalRepaymentProvidentFundLoan
          + this.state.mTotalRepaymentOtherLoan,
        mTotalInterestAllLoan:
            this.state.mTotalInterestCommercialLoan
          + this.state.mTotalInterestProvidentFundLoan
          + this.state.mTotalInterestOtherLoan,
      })
  }

  calcLoanResult = (loanType) => {
    let radioValuePaymentMethod =
          this.getRadioValuePaymentMethod(loanType)
    let loan = this.getLoan(loanType)
    let interestRate = this.getInterestRate(loanType)
    let loanDuration = this.getLoanDuration(loanType)

    let monthlyPayment = this.calcMonthlyRepayment(
                            radioValuePaymentMethod, loan,
                            interestRate, loanDuration)

    let totalPayment = this.calcTotalRepayment(
                            radioValuePaymentMethod, loan,
                            interestRate, loanDuration,
                            monthlyPayment)
    return {
      loanType: loanType,
      monthlyPayment: monthlyPayment,
      totalPayment: totalPayment,
    }
  }

  updateLoanResult = (loanType) => {
    let result = this.calcLoanResult(loanType)

    Log.log('updateLoanResult--------: '
        + ', loanType: ' + loanType
        + ', monthlyPayment: ' + result.monthlyPayment
        + ', totalPayment: ' + result.totalPayment)
    if (LoanType.CommercialLoan == loanType) {
      this.props.setCommercialLoanMonthlyPayment(
          result.monthlyPayment)
      this.setState({
        // FIXME, call updateLoanResult() continuely will lead
        // to updateLoanTotalResultForState() Error because state
        // did not change in time
        mTotalRepaymentCommercialLoan: result.totalPayment,
      }, this.updateLoanTotalResultForState())
    } else if (LoanType.ProvidentFundLoan == loanType) {
      this.props.setProvidentFundLoanMonthlyPayment(
          result.monthlyPayment)
      this.setState({
      // FIXME, call updateLoanResult() continuely will lead
      // to updateLoanTotalResultForState() Error because state
      // did not change in time
        mTotalRepaymentProvidentFundLoan: result.totalPayment,
      }, this.updateLoanTotalResultForState())
    } else if (LoanType.OtherLoan == loanType) {
      this.props.setOtherLoanMonthlyPayment(
          result.monthlyPayment)
      this.setState({
        mTotalRepaymentOtherLoan: result.totalPayment,
      }, this.updateLoanTotalResultForState())
    }

    Log.log('updateLoanResult--------: '
        + ', ' + this.props.loan.mCommercialLoanMonthlyPayment
        + ', ' + this.props.loan.mProvidentFundLoanMonthlyPayment
        + ', ' + this.props.loan.mOtherLoanMonthlyPayment)
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
          // this.updateLoanResult(loanType)
      })
    } else if (LoanType.ProvidentFundLoan == loanType) {
      this.setState({
          mRadioValueProvidentFundLoanPaymentMethod: value,
      }, () => {
          // this.updateLoanResult(loanType)
      })
    } else if (LoanType.OtherLoan == loanType) {
      this.setState({
          mRadioValueOtherLoanPaymentMethod: value,
      }, () => {
          // this.updateLoanResult(loanType)
      })
    }
    this.clearResult()
  }

  onInputLoan = (loanType, e) => {
    try {
      let loan = Number(e.target.value)
      Log.log('onInputLoan, loan: '
            + loan + ', loanType: ' + loanType)
      if (LoanType.CommercialLoan == loanType) {
        this.props.setCommercialLoanTotal(loan)
      } else if (LoanType.ProvidentFundLoan == loanType) {
        this.props.setProvidentFundLoanTotal(loan)
      } else if (LoanType.OtherLoan == loanType) {
        this.props.setOtherLoanTotal(loan)
      }
      this.clearResult()
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
            mRateInputManualCommercialLoan: true,
        }, () => {
            // this.updateLoanResult(loanType)
        })
      } else if (LoanType.ProvidentFundLoan == loanType) {
        this.setState({
            mRateProvidentFundLoan: interestRate,
            mRateInputManualProvidentFundLoan: true,
        }, () => {
            // this.updateLoanResult(loanType)
        })
      } else if (LoanType.OtherLoan == loanType) {
        this.setState({
            mRateOtherLoan: interestRate,
            mRateInputManualOtherLoan: true,
        }, () => {
            // this.updateLoanResult(loanType)
        })
      }
      this.clearResult()
    } catch(err) {
      Log.error("onInputLoanRate: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onDurationChanged = (loanType, e) => {
    Log.log('picker发送选择改变，携带值为', e.detail.value)
    let durationIdx = Number(e.detail.value)
    let duration = durationIdx + 1
    if (LoanType.CommercialLoan == loanType) {
      this.setState({
          mDurationCommercialLoan: duration,
      }, () => {
          // this.updateLoanResult(loanType)
      })
    } else if (LoanType.ProvidentFundLoan == loanType) {
      this.setState({
          mDurationProvidentFundLoan: duration,
      }, () => {
          // this.updateLoanResult(loanType)
      })
    } else if (LoanType.OtherLoan == loanType) {
      this.setState({
          mDurationOtherLoan: duration,
      }, () => {
          // this.updateLoanResult(loanType)
      })
    }
    this.clearResult()
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
          mRateInputManualCommercialLoan: false,
          mRateDiscountIdxCommercialLoan: index,
      }, () => {
          // this.updateLoanResult(loanType)
      })
    } else if (LoanType.ProvidentFundLoan == loanType) {
      rateDiscount = this.state.mProvidentFundLoanRateSelectorValueArray[index]
      interestRate = rateDiscount * BaseInterestRateProvidentFundLoan
      this.setState({
          mRateProvidentFundLoan: interestRate,
          mRateInputManualProvidentFundLoan: false,
          mRateDiscountIdxProvidentFundLoan: index,
      }, () => {
          // this.updateLoanResult(loanType)
      })
    } else if (LoanType.OtherLoan == loanType) {
      rateDiscount = this.state.mCommercialLoanRateSelectorValueArray[index]
      interestRate = rateDiscount * BaseInterestRateCommercialLoan
      this.setState({
          mRateOtherLoan: interestRate,
          mRateInputManualOtherLoan: false,
          mRateDiscountIdxOtherLoan: index,
      }, () => {
          // this.updateLoanResult(loanType)
      })
    } else {
      console.error('[Error] No this loan type!')
    }
    console.log('picker发送选择改变，携带值为' , e.detail.value
        + ', rateDiscount: ' + rateDiscount
        + ', interestRate: ' + interestRate)
  }

  // interestRate 是4.9%百分号表示的数值。
  calcMonthlyRepayment = (repaymentType, totalLoan,
      interestRate, years) => {
    Log.log('calcMonthlyRepayment()'
        + ', repaymentType: ' + repaymentType
        + ', totalLoan: ' + totalLoan
        + ', interestRate: ' + interestRate
        + ', years: ' + years)
    // interestRate 是4.9%百分号表示的数值。
    let monthlyRate = interestRate / 1200
    // 等额本金: 首月还款
    //（贷款本金 * 月利率）+ 贷款本金 / 贷款期数
    if (repaymentType == RepaymentType.Capital) {
      let firstMonthlyPayment = totalLoan * monthlyRate
          + totalLoan / (years * 12)
      return firstMonthlyPayment
    }
    // 等额本息：
    // [贷款本金×月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数－1]
    let maxRate = 1.0
    // maxRate =（1+月利率）^还款月数
    for (let i = 0; i < (12 * years); i++) {
      maxRate = maxRate * (1 + monthlyRate)
    }
    let monthlyPayment = 0
    if ((maxRate - 1) != 0) {
      monthlyPayment = (totalLoan * monthlyRate * maxRate) / (maxRate - 1)
    }
    Log.log('calcMonthlyRepayment()'
        + ', monthlyRate: ' + monthlyRate
        + ', maxRate: ' + maxRate
        + ', 12 * years: ' + (12 * years)
        + ', monthlyPayment: ' + monthlyPayment)
    return monthlyPayment
  }

  // interestRate 是4.9%百分号表示的数值。
  calcTotalRepayment = (repaymentType, totalLoan,
      interestRate, years, monthlyPayment) => {
    Log.log('calcTotalRepayment()'
        + ', repaymentType: ' + repaymentType
        + ', totalLoan: ' + totalLoan
        + ', interestRate: ' + interestRate
        + ', years: ' + years
        + ', monthlyPayment: ' + monthlyPayment)
    // interestRate 是4.9%百分号表示的数值。
    let monthlyRate = interestRate / 1200
    // 等额本金：
    // 贷款本金×月利率×（还款次数＋1）÷2 + 贷款本金
    if (repaymentType == RepaymentType.Capital) {
      let totalRepayment = totalLoan * monthlyRate * (years * 12 + 1) / 2
      return totalRepayment
    }
    // 等额本息：
    // 每月还款额 x 还款月数
    return monthlyPayment * (years * 12)
  }

  startCalc = (e) => {
    this.updateAllLoanResult()
  }

  clearResult = () => {
      this.props.setCommercialLoanMonthlyPayment(0)
      this.props.setProvidentFundLoanMonthlyPayment(0)
      this.props.setOtherLoanMonthlyPayment(0)
      this.props.setAllLoanMonthlyPayment(0)

      this.props.setAllLoanTotal(0)

      this.setState({
        mTotalRepaymentCommercialLoan: 0,
        mTotalRepaymentProvidentFundLoan: 0,
        mTotalRepaymentOtherLoan: 0,

        mTotalRepaymentAllLoan: 0,
        mTotalInterestAllLoan: 0,
      })
  }

  clearData = (e) => {
    this.clearResult()

    this.props.setCommercialLoanTotal(0)
    this.props.setProvidentFundLoanTotal(0)
    this.props.setOtherLoanTotal(0)

    this.setState({
      mDurationCommercialLoan: 25,
      mDurationProvidentFundLoan: 25,
      mDurationOtherLoan: 25,

      mRateCommercialLoan: BaseInterestRateCommercialLoan,
      mRateProvidentFundLoan: BaseInterestRateProvidentFundLoan,
      mRateOtherLoan: BaseInterestRateCommercialLoan,

      mRateInputManualCommercialLoan: false,
      mRateInputManualProvidentFundLoan: false,
      mRateInputManualOtherLoan: false,

      mRateDiscountIdxCommercialLoan: Number(DefaultRateDiscountIdx.CommercialLoan),
      mRateDiscountIdxProvidentFundLoan: Number(DefaultRateDiscountIdx.ProvidentFundLoan),
      mRateDiscountIdxOtherLoan: Number(DefaultRateDiscountIdx.OtherLoan),

      // FIXME, TODO
      // FIXME, call updateLoanResult() continuely will lead
      // to updateLoanTotalResult() Error because state
      // did not change in time
      mTotalRepaymentCommercialLoan: 0,
      mTotalRepaymentProvidentFundLoan: 0,
      mTotalRepaymentOtherLoan: 0,
      mTotalRepaymentAllLoan: 0,

      // FIXME, TODO
      mTotalInterestCommercialLoan: 0,
      mTotalInterestProvidentFundLoan: 0,
      mTotalInterestOtherLoan: 0,
      mTotalInterestAllLoan: 0,

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
      this.setState({
        mHasClickedShowingLoanViewCommercialLoan: true,
      }, () => {
        this.setState({
          mIsShowingLoanViewCommercialLoan: !this.isShowingLoanView(loanType),
        })
      })
    } else if (loanType == LoanType.ProvidentFundLoan) {
      this.setState({
        mHasClickedShowingLoanViewProvidentFundLoan: true,
      }, () => {
        this.setState({
          mIsShowingLoanViewProvidentFundLoan: !this.isShowingLoanView(loanType),
        })
      })
    } else if (loanType == LoanType.OtherLoan) {
      this.setState({
        mHasClickedShowingLoanViewOtherLoan: true,
      }, () => {
        this.setState({
          mIsShowingLoanViewOtherLoan: !this.isShowingLoanView(loanType),
        })
      })
    } else {
      return true
    }
    // this.updateLoanResult(loanType)
  }

  isShowingLoanView = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.state.mHasClickedShowingLoanViewCommercialLoan
            ? this.state.mIsShowingLoanViewCommercialLoan
              : (this.state.mIsShowingLoanViewCommercialLoan
                  || (this.props.loan.mCommercialLoanTotal != undefined
                      && this.props.loan.mCommercialLoanTotal != null 
                      && this.props.loan.mCommercialLoanTotal != 0))
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mHasClickedShowingLoanViewProvidentFundLoan
            ? this.state.mIsShowingLoanViewProvidentFundLoan
              : (this.state.mIsShowingLoanViewProvidentFundLoan
                  || (this.props.loan.mProvidentFundLoanTotal != undefined
                      && this.props.loan.mProvidentFundLoanTotal != null 
                      && this.props.loan.mProvidentFundLoanTotal != 0))
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mHasClickedShowingLoanViewOtherLoan
            ? this.state.mIsShowingLoanViewOtherLoan
              : (this.state.mIsShowingLoanViewOtherLoan
                  || (this.props.loan.mOtherLoanTotal != undefined
                      && this.props.loan.mOtherLoanTotal != null 
                      && this.props.loan.mOtherLoanTotal != 0))
    } else {
      return true
    }
  }

  getLoan = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.props.loan.mCommercialLoanTotal
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.props.loan.mProvidentFundLoanTotal
    } else if (loanType == LoanType.OtherLoan) {
      return this.props.loan.mOtherLoanTotal
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
      loan = this.props.loan.mCommercialLoanMonthlyPayment
    } else if (loanType == LoanType.ProvidentFundLoan) {
      loan = this.props.loan.mProvidentFundLoanMonthlyPayment
    } else if (loanType == LoanType.OtherLoan) {
      loan = this.props.loan.mOtherLoanMonthlyPayment
    }
    return loan * 10000
  }

  getMonthlyIncreasement = (loanType) => {
    let loan = 0
    if (loanType == LoanType.CommercialLoan) {
      loan = this.props.loan.mCommercialLoanTotal
        * this.state.mRateCommercialLoan
        / (this.state.mDurationCommercialLoan * 1200)
    } else if (loanType == LoanType.ProvidentFundLoan) {
      loan = this.props.loan.mProvidentFundLoanTotal
        * this.state.mRateProvidentFundLoan
        / (this.state.mDurationProvidentFundLoan * 1200)
    } else if (loanType == LoanType.OtherLoan) {
      loan = this.props.loan.mOtherLoanTotal
        * this.state.mRateOtherLoan
        / (this.state.mDurationOtherLoan * 1200)
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
      duration = this.state.mDurationCommercialLoan
    } else if (loanType == LoanType.ProvidentFundLoan) {
      duration = this.state.mDurationProvidentFundLoan
    } else if (loanType == LoanType.OtherLoan) {
      duration = this.state.mDurationOtherLoan
    } else {
      console.error('[Error] getLoanDuration, no loanType!')
      duration = 25
    }
    return duration
  }

  getLoanDurationText = (loanType) => {
    return this.state.mDurationSelector[
            this.getLoanDuration(loanType)-1]
  }

  getRateInputManual = (loanType) => {
    let manual = false
    if (loanType == LoanType.CommercialLoan) {
      manual = this.state.mRateInputManualCommercialLoan
    } else if (loanType == LoanType.ProvidentFundLoan) {
      manual = this.state.mRateInputManualProvidentFundLoan
    } else if (loanType == LoanType.OtherLoan) {
      manual = this.state.mRateInputManualOtherLoan
    } else {
      console.error('[Error] getRateInputManual, no loanType!')
    }
    return manual
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
              <View className='cl-input-item-container-top-bottom-border'>
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
          
            <View className='cl-input-item-container-no-border'>
              <Text className='cl-input-title'>利率</Text>
              <Text className='cl-rate-discount-placehold'>
                {this.getRateInputManual(loanType) ? "" : this.getRateDiscountText(loanType)}
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
            </View>}
          </View>
        )})}
        <View className='cl-input-item-container-bold-top'>
          <Text className='cl-input-title-bold'>贷款总额（万元）</Text>
          <Text className='cl-input-text-bold'>
            {this.props.loan.mAllLoanTotal.toFixed(2)}
          </Text>
        </View>
        <View className='cl-input-item-container-bold-top'>
          <Text className='cl-input-title-bold'>每月还款额（元）</Text>
          <Text className='cl-input-text-bold'>
            {(this.props.loan.mAllLoanMonthlyPayment * 10000).toFixed(0)}
          </Text>
        </View>
        {this.state.mTitleArray.map((item0, loanType) => {
          return (<View>
            {(this.getMonthlyRepayment(loanType) == 0) ? (<View></View>) :
              (<View className='cl-input-item-container'>
                <Text className='cl-input-title'>{item0}</Text>
                {(this.getRadioValuePaymentMethod(loanType) == RepaymentType.Capital) &&
                <Text className='cl-rate-discount-placehold'>
                  {'每月递增' + this.getMonthlyIncreasement(loanType).toFixed(0) + '(元)'}
                </Text>}
                <Text className='cl-input-text-bold'>
                  {this.getMonthlyRepayment(loanType).toFixed(0)}
                </Text>
              </View>)}
            </View>)
        })}

        <View className='cl-input-item-container-bold-top'>
          <Text className='cl-input-title-bold'>利息本金总额</Text>
          <Text className='cl-input-text-bold'>
            {this.state.mTotalRepaymentAllLoan.toFixed(2)}
          </Text>
          <Text className='cl-input-title2-bold'>利息总额</Text>
          <Text className='cl-input-text-bold'>
            {this.state.mTotalInterestAllLoan.toFixed(2)}
          </Text>
        </View>

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
