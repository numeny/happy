import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup, Picker } from '@tarojs/components'
import './calc_loan.scss'

import { connect } from '@tarojs/redux'
// import { setLoanData, setCommercialLoanTotal, setCommercialLoanMonthlyPayment, setProvidentFundLoanTotal, setProvidentFundLoanMonthlyPayment, setOtherLoanTotal, setOtherLoanMonthlyPayment, setAllLoanTotal, setAllLoanMonthlyPayment } from '../../redux/actions/loan'
import { setLoanData } from '../../redux/actions/loan'
import { CommercialLoanTotal, CommercialLoanMonthlyPayment, ProvidentFundLoanTotal, ProvidentFundLoanMonthlyPayment, OtherLoanTotal, OtherLoanMonthlyPayment, AllLoanTotal, AllLoanMonthlyPayment, RadioValueCommercialLoanPaymentMethod, RadioValueProvidentFundLoanPaymentMethod, RadioValueOtherLoanPaymentMethod, DurationCommercialLoan, DurationProvidentFundLoan, DurationOtherLoan, RateCommercialLoan, RateProvidentFundLoan, RateOtherLoan, RateInputManualCommercialLoan, RateInputManualProvidentFundLoan, RateInputManualOtherLoan, RateDiscountIdxCommercialLoan, RateDiscountIdxProvidentFundLoan, RateDiscountIdxOtherLoan } from '../../redux/constants/loan'
import { DefaultValue, LoanType, RepaymentType, DefaultRateDiscountIdx } from '../../constants/loan'

import { Log } from '@util/log'
import { Util } from '../../util/util'

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

@connect(({ loan }) => ({
  loan
}), (dispatch) => ({
  setLoanData (field, loan) {
    dispatch(setLoanData(field, loan))
  },
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
    navigationBarTitleText: '房鱼房贷计算',
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

      mTotalRepaymentCommercialLoan: 0,
      mTotalRepaymentProvidentFundLoan: 0,
      mTotalRepaymentOtherLoan: 0,
      mTotalRepaymentAllLoan: 0,

      mTotalInterestCommercialLoan: 0,
      mTotalInterestProvidentFundLoan: 0,
      mTotalInterestOtherLoan: 0,
      mTotalInterestAllLoan: 0,

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
        '基准利率(' + DefaultValue.BaseInterestRateCommercialLoan + '%)', '基准利率1.05倍', '基准利率1.1倍',
        '基准利率1.15倍', '基准利率1.2倍', '基准利率1.25倍',
      ],
      mCommercialLoanRateSelectorValueArray: [
        0.85, 0.9, 0.95,
        1.0, 1.05, 1.1,
        1.15, 1.2, 1.25,
      ],
      mOtherLoanRateSelector: [
        '基准利率8.5折', '基准利率9折', '基准利率9.5折',
        '基准利率(' + DefaultValue.BaseInterestRateOtherLoan + '%)', '基准利率1.05倍', '基准利率1.1倍',
        '基准利率1.15倍', '基准利率1.2倍', '基准利率1.25倍',
      ],
      mOtherLoanRateSelectorValueArray: [
        0.85, 0.9, 0.95,
        1.0, 1.05, 1.1,
        1.15, 1.2, 1.25,
      ],
      mProvidentFundLoanRateSelector: [
        '基准利率(' + DefaultValue.BaseInterestRateProvidentFundLoan + '%)', '基准利率1.05倍', '基准利率1.1倍',
        '基准利率1.15倍', '基准利率1.2倍', '基准利率1.25倍',
      ],
      mProvidentFundLoanRateSelectorValueArray: [
        1.0, 1.05, 1.1,
        1.15, 1.2, 1.25,
      ],
    }
  }

  componentDidShow() {
    Log.log('calc_loan, componentDidShow--------: 1')
    this.startCalc()
  }

  componentWillMount () {
    Log.log('calc_loan, componentDidMount--------: 1')
    this.startCalc()
  }

  componentDidMount() {
    Log.log('calc_loan, componentDidMount--------: 1')

    this.startCalc()
  }

  isPropsChanged (nextProps) {
    return this.props.loan.mLoanData[CommercialLoanTotal] != nextProps.loan.mLoanData[CommercialLoanTotal]
        || this.props.loan.mLoanData[CommercialLoanMonthlyPayment] != nextProps.loan.mLoanData[CommercialLoanMonthlyPayment]
        || this.props.loan.mLoanData[ProvidentFundLoanTotal] != nextProps.loan.mLoanData[ProvidentFundLoanTotal]
        || this.props.loan.mLoanData[ProvidentFundLoanMonthlyPayment] != nextProps.loan.mLoanData[ProvidentFundLoanMonthlyPayment]
        || this.props.loan.mLoanData[OtherLoanTotal] != nextProps.loan.mLoanData[OtherLoanTotal]
        || this.props.loan.mLoanData[OtherLoanMonthlyPayment] != nextProps.loan.mLoanData[OtherLoanMonthlyPayment]

        || this.props.loan.mLoanData[RadioValueCommercialLoanPaymentMethod] != nextProps.loan.mLoanData[RadioValueCommercialLoanPaymentMethod]
        || this.props.loan.mLoanData[RadioValueProvidentFundLoanPaymentMethod] != nextProps.loan.mLoanData[RadioValueProvidentFundLoanPaymentMethod]
        || this.props.loan.mLoanData[RadioValueOtherLoanPaymentMethod] != nextProps.loan.mLoanData[RadioValueOtherLoanPaymentMethod]
        || this.props.loan.mLoanData[DurationCommercialLoan] != nextProps.loan.mLoanData[DurationCommercialLoan]
        || this.props.loan.mLoanData[DurationProvidentFundLoan] != nextProps.loan.mLoanData[DurationProvidentFundLoan]
        || this.props.loan.mLoanData[DurationOtherLoan] != nextProps.loan.mLoanData[DurationOtherLoan]
        || this.props.loan.mLoanData[RateCommercialLoan] != nextProps.loan.mLoanData[RateCommercialLoan]
        || this.props.loan.mLoanData[RateProvidentFundLoan] != nextProps.loan.mLoanData[RateProvidentFundLoan]
        || this.props.loan.mLoanData[RateOtherLoan] != nextProps.loan.mLoanData[RateOtherLoan]
        || this.props.loan.mLoanData[RateInputManualCommercialLoan] != nextProps.loan.mLoanData[RateInputManualCommercialLoan]
        || this.props.loan.mLoanData[RateInputManualProvidentFundLoan] != nextProps.loan.mLoanData[RateInputManualProvidentFundLoan]
        || this.props.loan.mLoanData[RateInputManualOtherLoan] != nextProps.loan.mLoanData[RateInputManualOtherLoan]
        || this.props.loan.mLoanData[RateDiscountIdxCommercialLoan] != nextProps.loan.mLoanData[RateDiscountIdxCommercialLoan]
        || this.props.loan.mLoanData[RateDiscountIdxProvidentFundLoan] != nextProps.loan.mLoanData[RateDiscountIdxProvidentFundLoan]
        || this.props.loan.mLoanData[RateDiscountIdxOtherLoan] != nextProps.loan.mLoanData[RateDiscountIdxOtherLoan]
  }

  componentWillReceiveProps(nextProps) {
    Log.log('calc_loan, componentWillReceiveProps--------: 1,'
        + this.props.loan.mLoanData[CommercialLoanTotal]
        + ', ' + nextProps.loan.mLoanData[CommercialLoanTotal]
        )

    Log.log('calc_loan, componentWillReceiveProps--------: 1-1,'
        + ', CommercialLoanTotal: ' + this.props.loan.mLoanData[CommercialLoanTotal]
        + ', CommercialLoanMonthlyPayment: ' + this.props.loan.mLoanData[CommercialLoanMonthlyPayment]
        + ', ProvidentFundLoanTotal: ' + this.props.loan.mLoanData[ProvidentFundLoanTotal]
        + ', ProvidentFundLoanMonthlyPayment: ' + this.props.loan.mLoanData[ProvidentFundLoanMonthlyPayment]
        + ', OtherLoanTotal: ' + this.props.loan.mLoanData[OtherLoanTotal]
        + ', OtherLoanMonthlyPayment: ' + this.props.loan.mLoanData[OtherLoanMonthlyPayment]
        + ', AllLoanTotal: ' + this.props.loan.mLoanData[AllLoanTotal]
        + ', AllLoanMonthlyPayment: ' + this.props.loan.mLoanData[AllLoanMonthlyPayment]
        + ', RadioValueCommercialLoanPaymentMethod: ' + this.props.loan.mLoanData[RadioValueCommercialLoanPaymentMethod]
        + ', RadioValueProvidentFundLoanPaymentMethod: ' + this.props.loan.mLoanData[RadioValueProvidentFundLoanPaymentMethod]
        + ', RadioValueOtherLoanPaymentMethod: ' + this.props.loan.mLoanData[RadioValueOtherLoanPaymentMethod]
        + ', DurationCommercialLoan: ' + this.props.loan.mLoanData[DurationCommercialLoan]
        + ', DurationProvidentFundLoan: ' + this.props.loan.mLoanData[DurationProvidentFundLoan]
        + ', DurationOtherLoan: ' + this.props.loan.mLoanData[DurationOtherLoan]
        + ', RateCommercialLoan: ' + this.props.loan.mLoanData[RateCommercialLoan]
        + ', RateProvidentFundLoan: ' + this.props.loan.mLoanData[RateProvidentFundLoan]
        + ', RateOtherLoan: ' + this.props.loan.mLoanData[RateOtherLoan]
        + ', RateInputManualCommercialLoan: ' + this.props.loan.mLoanData[RateInputManualCommercialLoan]
        + ', RateInputManualProvidentFundLoan: ' + this.props.loan.mLoanData[RateInputManualProvidentFundLoan]
        + ', RateInputManualOtherLoan: ' + this.props.loan.mLoanData[RateInputManualOtherLoan]
        + ', RateDiscountIdxCommercialLoan: ' + this.props.loan.mLoanData[RateDiscountIdxCommercialLoan]
        + ', RateDiscountIdxProvidentFundLoan: ' + this.props.loan.mLoanData[RateDiscountIdxProvidentFundLoan]
        + ', RateDiscountIdxOtherLoan: ' + this.props.loan.mLoanData[RateDiscountIdxOtherLoan]
        )
    /*
    */


    if (!this.isPropsChanged(nextProps)) {
      return
    }

    // Log.log('calc_loan, componentWillReceiveProps--------: 2')
    this.startCalc()
    // this.updateLoanTotalResultForProps(nextProps)
  }

  onShareAppMessage = (share) => {
    return {
      title: Util.appTitle,
      path: '/pages/index/index?' + param
    }
  }

  updateLoanTotalResult(props) {
    this.updateLoanTotalResultForProps(props)
    this.updateLoanTotalResultForState()
  }

  updateLoanTotalResultForProps = (nextProps) => {
    Log.log('updateLoanTotalResultForProps--------: '
        + ', ' + nextProps.loan.mLoanData[CommercialLoanMonthlyPayment]
        + ', ' + nextProps.loan.mLoanData[ProvidentFundLoanMonthlyPayment]
        + ', ' + nextProps.loan.mLoanData[OtherLoanMonthlyPayment])
      this.props.setLoanData(AllLoanMonthlyPayment,
            nextProps.loan.mLoanData[CommercialLoanMonthlyPayment]
          + nextProps.loan.mLoanData[ProvidentFundLoanMonthlyPayment]
          + nextProps.loan.mLoanData[OtherLoanMonthlyPayment])
      this.props.setLoanData(AllLoanTotal,
            Util.getNumber3default0(nextProps.loan.mLoanData[CommercialLoanTotal])
          + Util.getNumber3default0(nextProps.loan.mLoanData[ProvidentFundLoanTotal])
          + Util.getNumber3default0(nextProps.loan.mLoanData[OtherLoanTotal]))
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
    let loan = Util.getNumber3default0(this.getLoan(loanType))
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
      this.props.setLoanData(CommercialLoanMonthlyPayment,
          result.monthlyPayment)
      this.setState({
        // FIXME, call updateLoanResult() continuely will lead
        // to updateLoanTotalResult() Error because state
        // did not change in time
        mTotalRepaymentCommercialLoan: result.totalPayment,
      }, this.updateLoanTotalResult(this.props))
    } else if (LoanType.ProvidentFundLoan == loanType) {
      this.props.setLoanData(ProvidentFundLoanMonthlyPayment,
          result.monthlyPayment)
      this.setState({
      // FIXME, call updateLoanResult() continuely will lead
      // to updateLoanTotalResult() Error because state
      // did not change in time
        mTotalRepaymentProvidentFundLoan: result.totalPayment,
      }, this.updateLoanTotalResult(this.props))
    } else if (LoanType.OtherLoan == loanType) {
      this.props.setLoanData(OtherLoanMonthlyPayment,
          result.monthlyPayment)
      this.setState({
        mTotalRepaymentOtherLoan: result.totalPayment,
      }, this.updateLoanTotalResult(this.props))
    }

    Log.log('updateLoanResult--------: '
        + ', ' + this.props.loan.mLoanData[CommercialLoanMonthlyPayment]
        + ', ' + this.props.loan.mLoanData[ProvidentFundLoanMonthlyPayment]
        + ', ' + this.props.loan.mLoanData[OtherLoanMonthlyPayment])
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
      this.props.setLoanData(RadioValueCommercialLoanPaymentMethod, value)
    } else if (LoanType.ProvidentFundLoan == loanType) {
      this.props.setLoanData(RadioValueProvidentFundLoanPaymentMethod, value)
    } else if (LoanType.OtherLoan == loanType) {
      this.props.setLoanData(RadioValueOtherLoanPaymentMethod, value)
    }
    this.startCalc()
  }

  onInputLoan = (loanType, e) => {
    try {
      let loan = Number(e.target.value)
      Log.log('onInputLoan, loan: '
            + loan + ', loanType: ' + loanType)
      if (LoanType.CommercialLoan == loanType) {
        this.props.setLoanData(CommercialLoanTotal, loan)
      } else if (LoanType.ProvidentFundLoan == loanType) {
        this.props.setLoanData(ProvidentFundLoanTotal, loan)
      } else if (LoanType.OtherLoan == loanType) {
        this.props.setLoanData(OtherLoanTotal, loan)
      }
      this.startCalc()
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
        this.props.setLoanData(RateCommercialLoan, interestRate)
        this.props.setLoanData(RateInputManualCommercialLoan, true)
      } else if (LoanType.ProvidentFundLoan == loanType) {
        this.props.setLoanData(RateProvidentFundLoan, interestRate)
        this.props.setLoanData(RateInputManualProvidentFundLoan, true)
      } else if (LoanType.OtherLoan == loanType) {
        this.props.setLoanData(RateOtherLoan, interestRate)
        this.props.setLoanData(RateInputManualOtherLoan, true)
      }
      this.startCalc()
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
      this.props.setLoanData(DurationCommercialLoan, duration)
    } else if (LoanType.ProvidentFundLoan == loanType) {
      this.props.setLoanData(DurationProvidentFundLoan, duration)
    } else if (LoanType.OtherLoan == loanType) {
      this.props.setLoanData(DurationOtherLoan, duration)
    }
    this.startCalc()
  }

  onLoanRatePickerChanged = (loanType, e) => {
    let index = Number(e.detail.value)
    let rateDiscount = 1.0 
    let interestRate = DefaultValue.BaseInterestRateCommercialLoan
    if (LoanType.CommercialLoan == loanType) {
      rateDiscount = this.state.mCommercialLoanRateSelectorValueArray[index]
      interestRate = rateDiscount * DefaultValue.BaseInterestRateCommercialLoan
      this.props.setLoanData(RateCommercialLoan, interestRate)
      this.props.setLoanData(RateInputManualCommercialLoan, false)
      this.props.setLoanData(RateDiscountIdxCommercialLoan, index)
    } else if (LoanType.ProvidentFundLoan == loanType) {
      rateDiscount = this.state.mProvidentFundLoanRateSelectorValueArray[index]
      interestRate = rateDiscount * DefaultValue.BaseInterestRateProvidentFundLoan
      this.props.setLoanData(RateProvidentFundLoan, interestRate)
      this.props.setLoanData(RateInputManualProvidentFundLoan, false)
      this.props.setLoanData(RateDiscountIdxProvidentFundLoan, index)
    } else if (LoanType.OtherLoan == loanType) {
      rateDiscount = this.state.mOtherLoanRateSelectorValueArray[index]
      interestRate = rateDiscount * DefaultValue.BaseInterestRateOtherLoan
      this.props.setLoanData(RateOtherLoan, interestRate)
      this.props.setLoanData(RateInputManualOtherLoan, false)
      this.props.setLoanData(RateDiscountIdxOtherLoan, index)
    } else {
      console.error('[Error] No this loan type!')
    }
    this.startCalc()
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
    // this.props.setLoanData(LoanData(1, 100)
    this.updateAllLoanResult()
  }

  clearResult = () => {
    /*
    this.startCalc()
      */
      this.props.setLoanData(CommercialLoanMonthlyPayment, 0)
      this.props.setLoanData(ProvidentFundLoanMonthlyPayment, 0)
      this.props.setLoanData(OtherLoanMonthlyPayment, 0)
      this.props.setLoanData(AllLoanMonthlyPayment, 0)

      this.props.setLoanData(AllLoanTotal, 0)

      this.setState({
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
      })
  }

  clearData = (e) => {
    this.clearResult()

    this.props.setLoanData(CommercialLoanTotal, null)
    this.props.setLoanData(ProvidentFundLoanTotal, null)
    this.props.setLoanData(OtherLoanTotal, null)

    this.props.setLoanData(DurationCommercialLoan, DefaultValue.LoanDuration)
    this.props.setLoanData(DurationProvidentFundLoan, DefaultValue.LoanDuration)
    this.props.setLoanData(DurationOtherLoan, DefaultValue.LoanDuration)

    this.props.setLoanData(RateCommercialLoan, DefaultValue.BaseInterestRateCommercialLoan)
    this.props.setLoanData(RateProvidentFundLoan, DefaultValue.BaseInterestRateProvidentFundLoan)
    this.props.setLoanData(RateOtherLoan, DefaultValue.BaseInterestRateOtherLoan)

    this.props.setLoanData(RateInputManualCommercialLoan, false)
    this.props.setLoanData(RateInputManualProvidentFundLoan, false)
    this.props.setLoanData(RateInputManualOtherLoan, false)

    this.props.setLoanData(RateDiscountIdxCommercialLoan,
        DefaultRateDiscountIdx.CommercialLoan)
    this.props.setLoanData(RateDiscountIdxProvidentFundLoan,
        DefaultRateDiscountIdx.ProvidentFundLoan)
    this.props.setLoanData(RateDiscountIdxOtherLoan,
        DefaultRateDiscountIdx.OtherLoan)

    this.props.setLoanData(RadioValueCommercialLoanPaymentMethod,
        RepaymentType.CapitalAndInterest)
    this.props.setLoanData(RadioValueProvidentFundLoanPaymentMethod,
        RepaymentType.CapitalAndInterest)
    this.props.setLoanData(RadioValueOtherLoanPaymentMethod,
        RepaymentType.CapitalAndInterest)
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
                  || Util.isNonZeroNumber(this.props.loan.mLoanData[CommercialLoanTotal]))
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mHasClickedShowingLoanViewProvidentFundLoan
            ? this.state.mIsShowingLoanViewProvidentFundLoan
              : (this.state.mIsShowingLoanViewProvidentFundLoan
                  || Util.isNonZeroNumber(this.props.loan.mLoanData[ProvidentFundLoanTotal]))
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mHasClickedShowingLoanViewOtherLoan
            ? this.state.mIsShowingLoanViewOtherLoan
              : (this.state.mIsShowingLoanViewOtherLoan
                  || Util.isNonZeroNumber(this.props.loan.mLoanData[OtherLoanTotal]))
    } else {
      return true
    }
  }

  getLoan = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.props.loan.mLoanData[CommercialLoanTotal]
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.props.loan.mLoanData[ProvidentFundLoanTotal]
    } else if (loanType == LoanType.OtherLoan) {
      return this.props.loan.mLoanData[OtherLoanTotal]
    }
  }

  getInterestRate = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.props.loan.mLoanData[RateCommercialLoan]
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.props.loan.mLoanData[RateProvidentFundLoan]
    } else if (loanType == LoanType.OtherLoan) {
      return this.props.loan.mLoanData[RateOtherLoan]
    }
  }

  getRateSelectorArray = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.state.mCommercialLoanRateSelector
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mProvidentFundLoanRateSelector
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mOtherLoanRateSelector
    }
  }

  getRateDiscountText = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.state.mCommercialLoanRateSelector[
              this.props.loan.mLoanData[RateDiscountIdxCommercialLoan]]
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mProvidentFundLoanRateSelector[
              this.props.loan.mLoanData[RateDiscountIdxProvidentFundLoan]]
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mOtherLoanRateSelector[
              this.props.loan.mLoanData[RateDiscountIdxOtherLoan]]
    }
  }

  getRateDiscountIdx = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.props.loan.mLoanData[RateDiscountIdxCommercialLoan]
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.props.loan.mLoanData[RateDiscountIdxProvidentFundLoan]
    } else if (loanType == LoanType.OtherLoan) {
      return this.props.loan.mLoanData[RateDiscountIdxOtherLoan]
    }
  }

  getMonthlyRepayment = (loanType) => {
    let loan = 0
    if (loanType == LoanType.CommercialLoan) {
      loan = this.props.loan.mLoanData[CommercialLoanMonthlyPayment]
    } else if (loanType == LoanType.ProvidentFundLoan) {
      loan = this.props.loan.mLoanData[ProvidentFundLoanMonthlyPayment]
    } else if (loanType == LoanType.OtherLoan) {
      loan = this.props.loan.mLoanData[OtherLoanMonthlyPayment]
    }
    return loan * 10000
  }

  getMonthlyIncreasement = (loanType) => {
    let loan = 0
    if (loanType == LoanType.CommercialLoan) {
      loan = Util.getNumber3default0(this.props.loan.mLoanData[CommercialLoanTotal])
        * this.props.loan.mLoanData[RateCommercialLoan]
        / (this.props.loan.mLoanData[DurationCommercialLoan] * 1200)
    } else if (loanType == LoanType.ProvidentFundLoan) {
      loan = Util.getNumber3default0(this.props.loan.mLoanData[ProvidentFundLoanTotal])
        * this.props.loan.mLoanData[RateProvidentFundLoan]
        / (this.props.loan.mLoanData[DurationProvidentFundLoan] * 1200)
    } else if (loanType == LoanType.OtherLoan) {
      loan = Util.getNumber3default0(this.props.loan.mLoanData[OtherLoanTotal])
        * this.props.loan.mLoanData[RateOtherLoan]
        / (this.props.loan.mLoanData[DurationOtherLoan] * 1200)
    }
    return loan * 10000
  }

  getRadioValuePaymentMethod = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.props.loan.mLoanData[RadioValueCommercialLoanPaymentMethod]
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.props.loan.mLoanData[RadioValueProvidentFundLoanPaymentMethod]
    } else if (loanType == LoanType.OtherLoan) {
      return this.props.loan.mLoanData[RadioValueOtherLoanPaymentMethod]
    } else {
      console.error('[Error] getRadioValuePaymentMethod, no loanTyp!')
      return 0
    }
  }

  getLoanDuration = (loanType) => {
    let duration = 0
    if (loanType == LoanType.CommercialLoan) {
      duration = this.props.loan.mLoanData[DurationCommercialLoan]
    } else if (loanType == LoanType.ProvidentFundLoan) {
      duration = this.props.loan.mLoanData[DurationProvidentFundLoan]
    } else if (loanType == LoanType.OtherLoan) {
      duration = this.props.loan.mLoanData[DurationOtherLoan]
    } else {
      console.error('[Error] getLoanDuration, no loanType!')
      duration = DefaultValue.LoanDuration
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
      manual = this.props.loan.mLoanData[RateInputManualCommercialLoan]
    } else if (loanType == LoanType.ProvidentFundLoan) {
      manual = this.props.loan.mLoanData[RateInputManualProvidentFundLoan]
    } else if (loanType == LoanType.OtherLoan) {
      manual = this.props.loan.mLoanData[RateInputManualOtherLoan]
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
            <View className='cl-top-title-unit'>计算单位（万元）</View>
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
                <Picker mode='selector' range={this.state.mDurationSelector} value={DefaultValue.LoanDuration - 1}
                     onChange={this.onDurationChanged.bind(this, loanType)} className='cl-duration-picker'>
                  <View>{this.getLoanDurationText(loanType)}
                     <View className='at-icon at-icon-chevron-down'></View>
                  </View>
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
                <Picker mode='selector' value={this.getRateDiscountIdx(loanType)}
                    range={this.getRateSelectorArray(loanType)}
                    onChange={this.onLoanRatePickerChanged.bind(this, loanType)} className='cl-duration-picker'>
                  <View>%
                    <View className='at-icon at-icon-chevron-down'></View>
                  </View>
                </Picker>
              </View>
            </View>
            </View>}
          </View>
        )})}
        <View className='cl-input-item-container-bold-top'>
          <Text className='cl-input-title-bold'>贷款总额（万元）</Text>
          <Text className='cl-input-text-bold'>
            {this.props.loan.mLoanData[AllLoanTotal].toFixed(2)}
          </Text>
        </View>
        <View className='cl-input-item-container-bold-top'>
          <Text className='cl-input-title-bold'>每月还款额（元）</Text>
          <Text className='cl-input-text-bold'>
            {(this.props.loan.mLoanData[AllLoanMonthlyPayment] * 10000).toFixed(0)}
          </Text>
        </View>
        {this.state.mTitleArray.map((item0, loanType) => {
          return (<View>
            {(this.getMonthlyRepayment(loanType) == 0) ? (<View></View>) :
              (<View className='cl-input-item-container'>
                <Text className='cl-input-title'>{item0}</Text>
                {(this.getRadioValuePaymentMethod(loanType) == RepaymentType.Capital) &&
                <Text className='cl-rate-discount-placehold'>
                  {'每月递减' + this.getMonthlyIncreasement(loanType).toFixed(0) + '(元)'}
                </Text>}
                <Text className='cl-input-text-bold'>
                  {this.getMonthlyRepayment(loanType).toFixed(0)}
                </Text>
              </View>)}
            </View>)
        })}

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
