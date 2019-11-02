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
const BaseInterestRateCommercialLoan = 0.49
const BaseInterestRateProvidentFundLoan = 0.325

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
      // Start
      mTitleArray: ['商业贷款', '公积金贷款', '其他贷款'],
      mTotalLoanArray: [0, 0, 0],
      mLoanDurationArray: [25, 25, 25],
      mInterestRateArray: [
        BaseInterestRateCommercialLoan,
        BaseInterestRateProvidentFundLoan,
        BaseInterestRateCommercialLoan,
      ],
      mRateDiscountIdxArray: [3, 0, 3],
      mMonthlyRepaymentArray: [0, 0, 0],
      mRadioValuePaymentMethodArray: [
        RepaymentType.CapitalAndInterest,
        RepaymentType.CapitalAndInterest,
        RepaymentType.CapitalAndInterest,
      ],






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
      // END










      // sCalcClient: null,

      callLinkForUpdateAll : [
        this.updateAll,
        this.updateValueAddedTax, // 增值税可能影响个税计算
        this.updateDeedTax,
        this.updatePersonalIncomeTax,
        this.updateOtherTax,

        this.updateAgencyFee,
        this.updateLoanServiceFee,
        this.updateEvaluationFee,
        this.updateMortgageRegistrationFee,
        this.updateOtherFee,

        this.updateCommercialLoan,
        this.updateProvidentFundLoan,
        this.updateOtherLoan,

        this.updateTotalLoan,
        this.updateTotalFee,
        this.updateTotalTax,

        this.updateTotalPayment,
        this.updateFirstPayment,
      ],

      mEditable: true,

      mCurrProvince: (this.$router.params.currCity != null && this.$router.params.currCity != undefined) ? Util.getString(this.$router.params.currCity) : '北京市',
      mCurrCity: (this.$router.params.currCity != null && this.$router.params.currCity != undefined) ? Util.getString(this.$router.params.currCity) : '北京市',

      mFirstPayment: Util.getNumber(this.$router.params.fp),
      mTotalPayment: Util.getNumber(this.$router.params.tp),
      mTotalLoan: Util.getNumber(this.$router.params.tl),
      mTotalFee: Util.getNumber(this.$router.params.tf),
      mTotalTax: Util.getNumber(this.$router.params.tt),

      // input
      mHouseName: Util.getString(this.$router.params.hn),
      mHouseArea: Util.getNumber(this.$router.params.ha),

      mTotalPrice: Util.getNumber(this.$router.params.tpr),
      mOriginPrice: Util.getNumber(this.$router.params.opr),
      mWebSignPrice: Util.getNumber(this.$router.params.wspr),
      mOriginTaxSum: Util.getNumber(this.$router.params.ots),

      // Tax
      mDeedTax: Util.getNumber(this.$router.params.dt),
      mPersonalIncomeTax: Util.getNumber(this.$router.params.pit),
      mValueAddedTax: Util.getNumber(this.$router.params.vat),
      mOtherTax: Util.getNumber(this.$router.params.ot),

      // Fee
      mAgencyFee: Util.getNumber(this.$router.params.af),
      mLoanServiceFee: Util.getNumber(this.$router.params.lsf),
      mEvaluationFee: Util.getNumber(this.$router.params.ef),
      mMortgageRegistrationFee: Util.getNumber(this.$router.params.mrf),
      mOtherFee: Util.getNumber(this.$router.params.of),

      // Loan
      mCommercialLoan: Util.getNumber(this.$router.params.cl),
      mProvidentFundLoan: Util.getNumber(this.$router.params.pfl),
      mOtherLoan: Util.getNumber(this.$router.params.ol),

      mFirstHouseRadioValue: Util.getNumber(this.$router.params.fhrv),
      mAboveTwoYearsRadioValue: Util.getNumber(this.$router.params.atyrv),
      mOnlyHouseRadioValue: Util.getBoolean(this.$router.params.onhrv, true),
      mOrdinaryHouseRadioValue: Util.getBoolean(this.$router.params.orhrv, true),

      mWillInputDeedTaxManual: Util.getBoolean(this.$router.params.widtm),
      mWillInputPersonalIncomeTaxManual: Util.getBoolean(this.$router.params.wipitm),
      mWillInputValueAddedTaxManual: Util.getBoolean(this.$router.params.wivatm),

      mIsFirstHouseRadioList: [
        { value: 0, text: '首套', checked: true, },
        { value: 1, text: '二套', checked: false, },
        { value: 2, text: '三套及以上', checked: false, },
      ],
      mIsAboveTwoYearsRadioList: [
        { value: 0, text: '不满两年', checked: true, },
        { value: 1, text: '满两年', checked: false, },
        { value: 2, text: '满五年', checked: false, },
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

    this.initCallLink()

    // FIXME, default CityClient
    sCalcClient = sCalcClientDecider.changeCityClient(this.state)
  }

  componentWillMount () { }

  initCallLink = () => {
    for (var idx = 0; idx < this.state.callLinkForUpdateAll.length - 1; idx++) {
      let func = this.state.callLinkForUpdateAll[idx]
      let nextFunc = this.state.callLinkForUpdateAll[idx+1]
      func.prototype.postCallback = nextFunc
    }
    /*
    this.updateDeedTax.prototype.postCallback = this.updatePersonalIncomeTax
    this.updatePersonalIncomeTax.prototype.postCallback = this.updateValueAddedTax
    this.updateValueAddedTax.prototype.postCallback = this.updateOtherTax
    */
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  updateTaxRate = () => {
  }

  updateAll = () => {
    // FIXME, set every time?
    sCalcClient.setClientState(this.state)
    if (this.updateAll.prototype.postCallback != null) {
      this.updateAll.prototype.postCallback()
    }
  }

  updateFirstPayment = () => {
    this.setState({
        mFirstPayment: this.state.mTotalPayment - this.state.mTotalLoan,
    }, () => {
      if (this.updateFirstPayment.prototype.postCallback != null) {
        this.updateFirstPayment.prototype.postCallback()
      }
    })
  }

  updateTotalPayment = () => {
    this.setState({
      mTotalPayment: this.state.mTotalPrice + this.state.mTotalFee
                      + this.state.mTotalTax,
    }, () => {
      if (this.updateTotalPayment.prototype.postCallback != null) {
        this.updateTotalPayment.prototype.postCallback()
      }
    })
  }

  updateTotalLoan = () => {
    this.setState({
        mTotalLoan: this.state.mCommercialLoan + this.state.mProvidentFundLoan
                      + this.state.mOtherLoan,
    }, () => {
      if (this.updateTotalLoan.prototype.postCallback != null) {
        this.updateTotalLoan.prototype.postCallback()
      }
    })
  }

  updateTotalFee = () => {
    let totalFee = (this.state.mAgencyFee
        + this.state.mLoanServiceFee
        + this.state.mEvaluationFee
        + this.state.mMortgageRegistrationFee
        + this.state.mOtherFee)
    this.setState({
        mTotalFee: totalFee,
    }, () => {
      if (this.updateTotalFee.prototype.postCallback != null) {
        this.updateTotalFee.prototype.postCallback()
      }
    })
  }

  updateTotalTax = () => {
    const totalTax = (this.state.mDeedTax + this.state.mPersonalIncomeTax +
                      + this.state.mValueAddedTax + this.state.mOtherTax)
    this.setState({
        mTotalTax: totalTax,
    }, () => {
      if (this.updateTotalTax.prototype.postCallback != null) {
        this.updateTotalTax.prototype.postCallback()
      }
    })
  }

  updateAgencyFee = () => {
    if (this.updateAgencyFee.prototype.postCallback != null) {
      this.updateAgencyFee.prototype.postCallback()
    }
  }

  updateLoanServiceFee = () => {
    if (this.updateLoanServiceFee.prototype.postCallback != null) {
      this.updateLoanServiceFee.prototype.postCallback()
    }
  }

  updateEvaluationFee = () => {
    if (this.updateEvaluationFee.prototype.postCallback != null) {
      this.updateEvaluationFee.prototype.postCallback()
    }
  }

  updateMortgageRegistrationFee = () => {
    if (this.updateMortgageRegistrationFee.prototype.postCallback != null) {
      this.updateMortgageRegistrationFee.prototype.postCallback()
    }
  }

  updateOtherFee = () => {
    if (this.updateOtherFee.prototype.postCallback != null) {
      this.updateOtherFee.prototype.postCallback()
    }
  }

  updateCommercialLoan = () => {
    if (this.updateCommercialLoan.prototype.postCallback != null) {
      this.updateCommercialLoan.prototype.postCallback()
    }
  }

  updateProvidentFundLoan = () => {
    if (this.updateProvidentFundLoan.prototype.postCallback != null) {
      this.updateProvidentFundLoan.prototype.postCallback()
    }
  }

  updateOtherLoan = () => {
    if (this.updateOtherLoan.prototype.postCallback != null) {
      this.updateOtherLoan.prototype.postCallback()
    }
  }

  updateDeedTax = () => {
    if (this.state.mWillInputDeedTaxManual) {
      if (this.updateDeedTax.prototype.postCallback != null) {
        this.updateDeedTax.prototype.postCallback()
      }
      return
    }
    let deedTax = sCalcClient.getDeedTax()
    this.setState({
        mDeedTax: Number(deedTax.toFixed(4)),
    }, () => {
      if (this.updateDeedTax.prototype.postCallback != null) {
        this.updateDeedTax.prototype.postCallback()
      }
    })
  }

  updatePersonalIncomeTax = () => {
    if (this.state.mWillInputPersonalIncomeTaxManual) {
      if (this.updatePersonalIncomeTax.prototype.postCallback != null) {
        this.updatePersonalIncomeTax.prototype.postCallback()
      }
      return
    }
    let personalIncomeTax = sCalcClient.getPersonalIncomeTax()
    this.setState({
        mPersonalIncomeTax: Number(personalIncomeTax.toFixed(4)),
    }, () => {
      if (this.updatePersonalIncomeTax.prototype.postCallback != null) {
        this.updatePersonalIncomeTax.prototype.postCallback()
      }
    })
  }

  updateValueAddedTax = () => {
    if (this.state.mWillInputValueAddedTaxManual) {
      if (this.updateValueAddedTax.prototype.postCallback != null) {
        this.updateValueAddedTax.prototype.postCallback()
      }
      return
    }
    let valueAddedTax = sCalcClient.getValueAddedTax()
    this.setState({
        mValueAddedTax: Number(valueAddedTax.toFixed(4)),
    }, () => {
      // mValueAddedTax may influent the calc of other tax
      sCalcClient.setClientState(this.state)
      if (this.updateValueAddedTax.prototype.postCallback != null) {
        this.updateValueAddedTax.prototype.postCallback()
      }
    })
  }

  updateOtherTax = () => {
    if (this.updateOtherTax.prototype.postCallback != null) {
      this.updateOtherTax.prototype.postCallback()
    }
  }

  // FIXME
  lowestPersonalIncomeTax = () => {
    if (this.state.mOriginTaxSum == 0) {
      Taro.showToast({title: "请输入最低指导价！"})
      return
    }

    if (this.state.mOriginPrice == 0) {
      Taro.showToast({title: "请输入原值！"})
      return
    }
    // let personalIncomeTax = (webSignPrice * 0.9 - originPrice) * 0.2
    let webSignPrice = Math.max(this.state.mOriginPrice * 10 / 9,
        this.state.mOriginTaxSum)

    this.onWebSignPriceChanged(webSignPrice)
  }

  generateReport = (e) => {
    this.setState(
      prevState => ({
        mEditable: false,
      })
    )
  }

  clearData = (e) => {
    this.setState({
      mFirstPayment: 0,
      mTotalPayment: 0,
      mTotalLoan: 0,
      mTotalFee: 0,
      mTotalTax: 0,

      // input
      mHouseName: '',
      mHouseArea: 0,

      mTotalPrice: 0,
      mOriginPrice: 0,
      mWebSignPrice: 0,
      mOriginTaxSum: 0,

      // Tax
      mDeedTax: 0,
      mPersonalIncomeTax: 0,
      mValueAddedTax: 0,
      mOtherTax: 0,

      // Fee
      mAgencyFee: 0,
      mLoanServiceFee: 0,
      mEvaluationFee: 0,
      mMortgageRegistrationFee: 0,
      mOtherFee: 0,

      // Loan
      mCommercialLoan: 0,
      mProvidentFundLoan: 0,
      mOtherLoan: 0,

      mFirstHouseRadioValue: 0,
      mAboveTwoYearsRadioValue: 0,
      mOnlyHouseRadioValue: true,
      mOrdinaryHouseRadioValue: true,

      mWillInputDeedTaxManual: false,
      mWillInputPersonalIncomeTaxManual: false,
      mWillInputValueAddedTaxManual: false,
    })
  }

  recaculate = (e) => {
    this.setState(
      prevState => ({
        mEditable: true,
      })
    )
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
      }, () => {
        this.updateAll()
      })
    } catch(err) {
      Log.error("onInputHouseArea: ", err);
      Taro.showToast({title: "请输入正确的面积！"})
    }
  }

  onInputTotalPrice = (e) => {
    try {
      let totalPrice = Number(e.target.value)
      this.setState({
          mTotalPrice: totalPrice,
      }, () => {
        this.updateAll()
      })
  
    } catch(err) {
      Log.error("onInputTotalPrice: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputOriginPrice = (e) => {
    try {
      let originPrice = Number(e.target.value)
      // FIXME
      if (e.target.value.length != 0 && !Util.isNumber(originPrice)) {
        Log.error("onInputOriginPrice: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
        return
      }
      this.setState({
          mOriginPrice: originPrice,
      }, () => {
        this.updateAll()
      })
    } catch(err) {
      Log.error("onInputOriginPrice: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onWebSignPriceChanged = (webSignPrice) => {
    this.setState({
        mWebSignPrice: webSignPrice,
    }, () => {
      this.updateAll()
    })
  }

  onInputWebSignPrice = (e) => {
    try {
      let webSignPrice = Number(e.target.value)
      this.onWebSignPriceChanged(webSignPrice)
    } catch(err) {
      Log.error("onInputWebSignPrice: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputOriginTaxSum = (e) => {
    try {
      let originTaxSum = Number(e.target.value)
      this.setState({
          mOriginTaxSum: originTaxSum,
      }, () => {
        this.updateAll()
      })

    } catch(err) {
      Log.error("onInputOriginTaxSum: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputAgencyFee = (e) => {
    try {
      let agencyFee = Number(e.target.value)
      this.setState({
          mAgencyFee: agencyFee,
      }, () => {
        this.updateAll()
      })
    } catch(err) {
      Log.error("onInputAgencyFee: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputLoanServiceFee = (e) => {
    try {
      let loanServiceFee = Number(e.target.value)
      this.setState({
          mLoanServiceFee: loanServiceFee,
      }, () => {
        this.updateAll()
      })
    } catch(err) {
      Log.error("onInputLoanServiceFee: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputEvaluationFee = (e) => {
    try {
      let evaluationFee = Number(e.target.value)
      this.setState({
          mEvaluationFee: evaluationFee,
      }, () => {
        this.updateAll()
      })
    } catch(err) {
      Log.error("onInputEvaluationFee: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputMortgageRegistrationFee = (e) => {
    try {
      let mortgageRegistrationFee = Number(e.target.value)
      this.setState({
          mMortgageRegistrationFee: mortgageRegistrationFee,
      }, () => {
          this.updateAll()
      })
    } catch(err) {
      Log.error("onInputMortgageRegistrationFee: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputOtherFee = (e) => {
    try {
      let otherFee = Number(e.target.value)
      this.setState({
          mOtherFee: otherFee,
      }, () => {
          this.updateAll()
      })
    } catch(err) {
      Log.error("onInputOtherFee: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputProvidentFundLoan = (e) => {
    try {
      let providentFundLoan = Number(e.target.value)
      this.setState({
          mProvidentFundLoan: providentFundLoan,
      }, () => {
          this.updateAll()
      })
    } catch(err) {
      Log.error("onInputProvidentFundLoan: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputOtherLoan = (e) => {
    try {
      let otherLoan = Number(e.target.value)
      this.setState({
          mOtherLoan: otherLoan,
      }, () => {
          this.updateAll()
      })
    } catch(err) {
      Log.error("onInputOtherLoan: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputDeedTaxManual = (e) => {
    if (!this.state.mWillInputDeedTaxManual) {
      Log.error('Should not update deed tax manully, e.target.value:',
          e.target.value)
      return
    }
    try {
      let inputDeedTaxManual = Number(e.target.value)
      this.setState({
          mDeedTax: inputDeedTaxManual,
      }, () => {
          this.updateAll()
      })
    
    } catch(err) {
      Log.error("onInputDeedTaxManual: ", err);
      Taro.showToast({title: "请输入正确的契税金额！"})
    }
  }

  onInputPersonalIncomeTaxManual = (e) => {
    if (!this.state.mWillInputPersonalIncomeTaxManual) {
      Log.error('Should not update person income tax manully, e.target.value:',
          e.target.value)
      return
    }
    try {
      let inputPersonalIncomeTaxManual = Number(e.target.value)
      this.setState({
          mPersonalIncomeTax: inputPersonalIncomeTaxManual,
      }, () => {
          this.updateAll()
      })
    
    } catch(err) {
      Log.error("onInputPersonalIncomeTaxManual: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputValueAddedTaxManual = (e) => {
    if (!this.state.mWillInputValueAddedTaxManual) {
      Log.error('Should not update value added tax manully, e.target.value:',
          e.target.value)
      return
    }
    try {
      let inputValueAddedTaxManual = Number(e.target.value)
      this.setState({
          mValueAddedTax: inputValueAddedTaxManual,
      }, () => {
          this.updateAll()
      })
    } catch(err) {
      Log.error("onInputValueAddedTaxManual: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputOtherTax = (e) => {
    try {
      let otherTax = Number(e.target.value)
      this.setState({
          mOtherTax: otherTax,
      }, () => {
          this.updateAll()
      })
    } catch(err) {
      Log.error("onInputOtherTax: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  changeWillInputDeedTaxManualCheckbox = (e) => {
    this.setState(
      prevState => ({
        mWillInputDeedTaxManual: !prevState.mWillInputDeedTaxManual,
      }), () => {
          this.updateAll()
          Log.error("changeWillInputDeedTaxManualCheckbox: ",
              this.state.mWillInputDeedTaxManual);
      })
  }

  changeWillInputPersonalIncomeTaxManualCheckbox = (e) => {
    this.setState(
      prevState => ({
        mWillInputPersonalIncomeTaxManual: !prevState.mWillInputPersonalIncomeTaxManual,
      }), () => {
          this.updateAll()
      })
  }

  changeWillInputValueAddedTaxManualCheckbox = (e) => {
    this.setState(
      prevState => ({
        mWillInputValueAddedTaxManual: !prevState.mWillInputValueAddedTaxManual,
      }), () => {
          this.updateAll()
      })
  }

  onClickFirstHouseRadio = (value, e) => {
    this.setState({
        mFirstHouseRadioValue: value,
    }, () => {
        this.updateAll()
    })
  }

  onClickAboveTwoYearsRadio = (value, e) => {
    this.setState({
        mAboveTwoYearsRadioValue: value,
    }, () => {
        this.updateAll()
    })
  }

  onClickOnlyHouseRadio = (value, e) => {
    this.setState({
        mOnlyHouseRadioValue: value,
    }, () => {
        this.updateAll()
    })
  }

  onClickOrdinaryHouseRadio = (value, e) => {
    this.setState({
        mOrdinaryHouseRadioValue: value,
    }, () => {
        this.updateAll()
    })
  }

  onClickTipBox = (e) => {
    e.stopPropagation()
  }

  onClickOpenTipBoxIcon = (idx, e) => {
    if (idx == Util.mTipBoxMessages.DeedTax
        || idx == Util.mTipBoxMessages.PersonalIncomeTax
        || idx == Util.mTipBoxMessages.ValueAddedTax) {
      if (idx == Util.mTipBoxMessages.DeedTax) {
        idx = sCalcClient.getDeedTaxHelpIndex()
      } else if (idx == Util.mTipBoxMessages.PersonalIncomeTax) {
        idx = sCalcClient.getPersonalIncomeTaxHelpIndex()
      } else if (idx == Util.mTipBoxMessages.ValueAddedTax) {
        idx = sCalcClient.getValueAddedTaxHelpIndex()
      }
    }

    Taro.navigateTo({
      url: '/pages/tipbox/tipbox?idx=' + idx
              + '&city=' + this.state.mCurrCity
    })
  }

  onShareAppMessage = (share) => {
    let param = Util.getParamForGenerateReport(this.state);
    /*
    if (DEBUG)
      Log.log('onShareAppMessage, param: ' + param);
    */

    return {
      title: Util.appTitle,
      path: '/pages/index/index?' + param
    }
  }

  onInputCityName = (e) => {
    this.setState({
        mCurrCity: e.target.value,
    }, () => {
      this.onChangedCity()
    })
  }

  onSelectCity = (e) => {
    Taro.navigateTo({
      url: '/pages/citylist/citylist?prov='
          + this.state.mCurrProvince
          + '&' + 'city=' + this.state.mCurrCity
    })
  }

  componentDidShow = () => {
    let pages = getCurrentPages();
    let currPage = pages[pages.length-1];
    Log.log('index-componentDidShow, '
        + currPage.data.mCurrCity)
    this.setState({
        mCurrCity: currPage.data.mCurrCity,
    }, () => {
      this.onChangedCity()
    })
  }

  onChangedCity = (e) => {
    Log.log("onChangedCity-0, this.state.mCurrCity: "
        + this.state.mCurrCity);
    sCalcClient = sCalcClientDecider.changeCityClient(this.state)
    this.updateAll();
  }

  onGetRegion (region) {
    // 参数region为选择的省市区
    Log.log(region);
  }






  // Start
  updateLoanResult = (loanType) => {
      // this.updateCommercialLoanResult()
    let radioValuePaymentMethod =
          this.getRadioValuePaymentMethod(loanType)
    let loan = this.getLoan(loanType)
    let interestRate = this.getInterestRate(loanType)
    let loanDuration = this.getLoanDuration(loanType)
    let monthlyPayment = this.calcMonthlyRepayment(
                            radioValuePaymentMethod, loan,
                            interestRate, loanDuration)
    this.setState({
        mMonthlyRepaymentCommercialLoan: monthlyPayment,
    })
  }

  onClickPaymentMethodRadio = (value, loanType, e) => {
    console.error('onClickPaymentMethodRadio, value: '
        + value + ', loanType: ' + loanType)
    // FIXME
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
      console.error('onInputLoan, totalLoan: '
            + totalLoan + ', loanType: ' + loanType)
      /*
      this.setState({
          mTotalCommercialLoan: totalLoan,
      }, () => {
          this.updateLoanResult(loanType)
      })
      */

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

  onInputCommercialLoan = (e) => {
    try {
      let totalCommercialLoan = Number(e.target.value)
      this.setState({
          mTotalCommercialLoan: totalCommercialLoan,
      }, () => {
          this.updateCommercialLoanResult()
      })
    } catch(err) {
      Log.error("onInputCommercialLoan: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
  }

  onInputCommercialLoanRate = (e) => {
    try {
      let commercialLoanRate = Number(e.target.value)
      this.setState({
          mRateCommercialLoan: commercialLoanRate,
      }, () => {
          this.updateCommercialLoanResult()
      })
    } catch(err) {
      Log.error("onInputCommercialLoanRate: ", err);
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
          this.updateCommercialLoanResult()
      })
    } else if (LoanType.ProvidentFundLoan == loanType) {
      rateDiscount = this.state.mProvidentFundLoanRateSelectorValueArray[index]
      interestRate = rateDiscount * BaseInterestRateProvidentFundLoan
      this.setState({
          mRateProvidentFundLoan: interestRate,
          mRateDiscountIdxProvidentFundLoan: index,
      })
    } else if (LoanType.OtherLoan == loanType) {
      rateDiscount = this.state.mCommercialLoanRateSelectorValueArray[index]
      interestRate = rateDiscount * BaseInterestRateCommercialLoan
      this.setState({
          mRateOtherLoan: interestRate,
          mRateDiscountIdxOtherLoan: index,
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
    if (repaymentType == RepaymentType.CapitalAndInterest) {
      let firstMonthlyPayment = (totalLoan * interestRate) / 12
          + totalLoan / (years * 12)
      return firstMonthlyPayment
    }
    // 等额本息：
    // [贷款本金×月利率×（1+月利率）^还款月数]÷[（1+月利率）^还款月数－1]
    let monthlyRate = interestRate / 12
    let maxRate = 1.0
    // maxRate =（1+月利率）^还款月数
    for (let i = 0; i < (12 * years); i++) {
      maxRate = maxRate * (1 + monthlyRate)
    }
    let monthlyPayment = (totalLoan * monthlyRate * maxRate) / (maxRate -1)
    return monthlyPayment 
  }

  updateCommercialLoanResult = () => {
    let monthlyPayment = this.calcMonthlyRepayment(
        this.state.mRadioValueCommercialLoanPaymentMethod,
        this.state.mTotalCommercialLoan,
        // 基准利率 * 折扣率
        this.state.mRateCommercialLoan,
        // BaseInterestRateCommercialLoan * this.state.mCommercialLoanRateSelectorValueArray[this.state.mRateDiscountIdxCommercialLoan],
        this.state.mDurationCommercialLoan)
    this.setState({
        mMonthlyRepaymentCommercialLoan: monthlyPayment,
    })
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
    if (loanType == LoanType.CommercialLoan) {
      return this.state.mMonthlyRepaymentCommercialLoan
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.state.mMonthlyRepaymentProvidentFundLoan
    } else if (loanType == LoanType.OtherLoan) {
      return this.state.mMonthlyRepaymentOtherLoan
    }
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
  // END






  render () {
    let classNameForInputDeedTaxManual = this.state.mWillInputDeedTaxManual ?
            'cl-input-text' : 'cl-input-text-disable'

    let classNameForInputPersonalIncomeTaxManual = this.state.mWillInputPersonalIncomeTaxManual ?
            'cl-input-text' : 'cl-input-text-disable'

    let classNameForInputValueAddedTaxManual = this.state.mWillInputValueAddedTaxManual ?
            'cl-input-text' : 'cl-input-text-disable'
    const {mPaymentMethodRadioList} = this.state
    return (
      <View className='cl-top-container'>
        <View>
        <View className='cl-top-title-container'>
          <View className='cl-top-title-unit'>计算单位：万元</View>
        </View>
        <View className='cl-item-title'>商业贷款-1</View>
        <RadioGroup>
          <View className='cl-input-item-container'>
            <Text className='cl-radio-title'>还款方式：</Text>
            {this.state.mPaymentMethodRadioList.map((item, i) => {
              return (
                <View onClick={this.onClickPaymentMethodRadio.bind(this, item.value, LoanType.CommercialLoan)} >
                  <Radio value={item.value} disabled={!this.state.mEditable}
                    checked={item.value == this.state.mFirstHouseRadioValue}
                    style={{transform: 'scale(0.8)'}} color='#FF7464'>
                  </Radio>
                  <Text className='cl-radio-text'>{item.text}</Text>
                </View>)
            })}
          </View>
        </RadioGroup>
        <View className='cl-input-item-container'>
          <Text className='cl-input-title'>贷款额</Text>
          <Input className='cl-input-text' type='digit' placeholder='输入商贷'
              disabled={!this.state.mEditable} maxLength='10' onInput={this.onInputCommercialLoan} />
          <Text className='cl-input-title2'>贷款年限</Text>
          <View className='cl-input-text'>
            <Picker mode='selector' range={this.state.mDurationSelector} value='24'
                 onChange={this.onDurationChanged.bind(this, LoanType.CommercialLoan)} className='cl-duration-picker'>
              {this.state.mDurationSelector[
                  this.state.mDurationCommercialLoan-1]}
              <View className='at-icon at-icon-chevron-down'></View>
            </Picker>
          </View>
        </View>

        <View className='cl-input-item-container'>
          <Text className='cl-input-title'>商贷利率</Text>
          <Text className='cl-rate-discount-placehold'>{this.state.mCommercialLoanRateSelector[this.state.mRateDiscountIdxCommercialLoan]}</Text>
          <View className='cl-input-text-rate'>
            <Input className='cl-input-text-rate' type='digit' placeholder='输入商贷利率' value={this.state.mRateCommercialLoan}
                disabled={!this.state.mEditable} maxLength='6' onInput={this.onInputCommercialLoanRate} />
            <Picker mode='selector' value='3'
                range={this.state.mCommercialLoanRateSelector}
                onChange={this.onLoanRatePickerChanged.bind(this, LoanType.CommercialLoan)} className='cl-duration-picker'>
              %<View className='at-icon at-icon-chevron-down'></View>
            </Picker>
          </View>
        </View>
        <View className='cl-input-item-container-bold'>
          <Text className='cl-input-title'>每月还款</Text>
          <Text className='cl-input-title'>
          {this.state.mMonthlyRepaymentCommercialLoan}
          </Text>
        </View>








        {this.state.mTitleArray.map((item0, loanType) => {
          return (
          <View>
            <View className='cl-item-title'>{item0}</View>
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
              <Input className='cl-input-text' type='digit' placeholder='输入贷款额'
                  disabled={!this.state.mEditable} maxLength='10' onInput={this.onInputLoan.bind(this, loanType)} />
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
              <Text className='cl-input-title'>商贷利率</Text>
              <Text className='cl-rate-discount-placehold'>
                {this.getRateDiscountText(loanType)}
              </Text>
              <View className='cl-input-text-rate'>
                <Input className='cl-input-text-rate' type='digit' placeholder='输入贷款利率' value={this.getInterestRate(loanType)}
                    disabled={!this.state.mEditable} maxLength='6' onInput={this.onInputCommercialLoanRate} />
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
              <Text className='cl-input-title'>每月还款</Text>
              <Text className='cl-input-title'>
              {this.getMonthlyRepayment(loanType)}
              </Text>
            </View>
          </View>
        )})}






















        <View className='cl-input-item-container-bold'>
          <Text className='cl-input-title'>网签价</Text>
          <Input className='cl-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mWebSignPrice} maxLength='10' onInput={this.onInputWebSignPrice} />
          <View className='cl-input-title2'>原契税<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.OriginTaxSum)}></View></View>
          <Input className='cl-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mOriginTaxSum} maxLength='10' onInput={this.onInputOriginTaxSum} />
        </View>

        <RadioGroup>
          <View className='cl-input-item-container'>
            <Text className='cl-radio-title'>买方是否首套</Text>
            {this.state.mIsFirstHouseRadioList.map((item, i) => {
              return (
                <View onClick={this.onClickFirstHouseRadio.bind(this, item.value)} >
                  <Radio value={item.value} disabled={!this.state.mEditable}
                    checked={item.value == this.state.mFirstHouseRadioValue}
                    style={{transform: 'scale(0.8)'}} color='#FF7464'>
                  </Radio>
                  <Text className='cl-radio-text'>{item.text}</Text>
                </View>)
            })}
          </View>
        </RadioGroup>
        <RadioGroup>
          <View className='cl-input-item-container'>
            <Text className='cl-radio-title'>房本年限</Text>
            {this.state.mIsAboveTwoYearsRadioList.map((item, i) => {
              return (
                <View onClick={this.onClickAboveTwoYearsRadio.bind(this, item.value)}>
                  <Radio value={item.value} disabled={!this.state.mEditable}
                    checked={item.value == this.state.mAboveTwoYearsRadioValue}
                    style={{transform: 'scale(0.8)'}} color='#FF7464'>
                  </Radio>
                  <Text className='cl-radio-text'>{item.text}</Text>
                </View>)
            })}
          </View>
        </RadioGroup>
        <RadioGroup>
          <View className='cl-input-item-container'>
            <Text className='cl-radio-title'>卖方是否唯一住宅</Text>
            {this.state.mIsOnlyHouseRadioList.map((item, i) => {
              return (
                <View onClick={this.onClickOnlyHouseRadio.bind(this, item.value)} >
                  <Radio value={item.value} disabled={!this.state.mEditable}
                    checked={item.value == this.state.mOnlyHouseRadioValue}
                    style={{transform: 'scale(0.8)'}} color='#FF7464'>
                  </Radio>
                  <Text className='cl-radio-text'>{item.text}</Text>
                </View>)
            })}
          </View>
        </RadioGroup>

        <RadioGroup>
          <View className='cl-input-item-container'>
            <Text className='cl-radio-title'>是否普通住宅</Text>
            {this.state.mIsOrdinaryHouseRadioList.map((item, i) => {
              return (
                <View onClick={this.onClickOrdinaryHouseRadio.bind(this, item.value)}>
                  <Radio value={item.value} disabled={!this.state.mEditable}
                    checked={item.value == this.state.mOrdinaryHouseRadioValue}
                    style={{transform: 'scale(0.8)'}} color='#FF7464'>
                  </Radio>
                  <Text className='cl-radio-text'>{item.text}</Text>
                </View>)
            })}
          </View>
        </RadioGroup>

        <View className='cl-input-item-container'>
          <Text className='cl-input-title'>中介费</Text>
          <Input className='cl-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mAgencyFee} maxLength='10' onInput={this.onInputAgencyFee} />
          <Text className='cl-input-title2'>贷款服务费</Text>
          <Input className='cl-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mLoanServiceFee} maxLength='10' onInput={this.onInputLoanServiceFee} />
        </View>
        <View className='cl-input-item-container'>
          <Text className='cl-input-title'>评估费</Text>
          <Input className='cl-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mEvaluationFee} maxLength='10' onInput={this.onInputEvaluationFee} />
          <Text className='cl-input-title2'>其他费用</Text>
          <Input className='cl-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mOtherFee} maxLength='10' onInput={this.onInputOtherFee} />
        </View>
        <View className='cl-input-item-container-bold2'>
          <Text className='cl-input-title'></Text>
          <View className='cl-input-text'></View>
          <View className='cl-input-title-bold'>总费用<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalFee)}></View></View>
          <Text className='cl-input-text-bold'>{this.state.mTotalFee.toFixed(4)}</Text>
        </View>

        <View className='cl-input-item-container'>
          <View className='cl-input-title'>契税<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.DeedTax)}></View></View>
          <Input className={classNameForInputDeedTaxManual}
                value={this.state.mDeedTax} type='text'
                disabled={!this.state.mEditable || !this.state.mWillInputDeedTaxManual}
                placeholder='（万元）' maxLength='6'
                onInput={this.onInputDeedTaxManual} />
          <CheckboxGroup
              onChange={this.changeWillInputDeedTaxManualCheckbox}>
            <View className='cl-input-title'>
              <Checkbox checked={this.state.mWillInputDeedTaxManual}
                disabled={!this.state.mEditable} />
                <Text>手动输入</Text>
            </View>
          </CheckboxGroup>
        </View>

        <View className='cl-input-item-container'>
          <View className='cl-input-title'>个人所得税<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.PersonalIncomeTax)}></View></View>
            <Input className={classNameForInputPersonalIncomeTaxManual}
                value={this.state.mPersonalIncomeTax} type='text'
                disabled={!this.state.mEditable || !this.state.mWillInputPersonalIncomeTaxManual}
                placeholder='（万元）' maxLength='6'
                onInput={this.onInputPersonalIncomeTaxManual} />
            <CheckboxGroup onChange={this.changeWillInputPersonalIncomeTaxManualCheckbox}>
              <View className='cl-input-title'>
                <Checkbox checked={this.state.mWillInputPersonalIncomeTaxManual}
                  disabled={!this.state.mEditable} />
                <Text>手动输入</Text>
              </View>
            </CheckboxGroup>
        </View>

        <View className='cl-input-item-container'>
          <View className='cl-input-title'>增值税<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.ValueAddedTax)}></View></View>
            <Input className={classNameForInputValueAddedTaxManual}
                value={this.state.mValueAddedTax} type='text'
                disabled={!this.state.mEditable || !this.state.mWillInputValueAddedTaxManual}
                placeholder='（万元）' maxLength='6'
                onInput={this.onInputValueAddedTaxManual} />
            <CheckboxGroup onChange={this.changeWillInputValueAddedTaxManualCheckbox}>
              <View className='cl-input-title'>
                <Checkbox checked={this.state.mWillInputValueAddedTaxManual}
                  disabled={!this.state.mEditable} />
                <Text>手动输入</Text>
              </View>
            </CheckboxGroup>
        </View>

        <View className='cl-input-item-container-bold2'>
          <Text className='cl-input-title'>其他税</Text>
          <Input className='cl-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mOtherTax} maxLength='10' onInput={this.onInputOtherTax} />
          <View className='cl-input-title2-bold'>总税款<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalTax)}></View></View>
          <Text className='cl-input-text-bold'>{this.state.mTotalTax.toFixed(4)}</Text>
        </View>

        <View className='cl-input-item-container-bold'>
          <Text className='cl-input-title'>其他贷款</Text>
          <Input className='cl-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mOtherLoan} maxLength='10' onInput={this.onInputOtherLoan} />
          <View className='cl-input-title2-bold'>总贷款<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalLoan)}></View></View>
          <Text className='cl-input-text-bold'>{this.state.mTotalLoan.toFixed(4)}</Text>
        </View>

        <View className='cl-input-item-container'>
          <View className='cl-input-title-bold'>总首付<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.FirstPayment)}></View></View>
          <Text className='cl-input-text-bold'>{this.state.mFirstPayment.toFixed(4)}</Text>
          <View className='cl-input-title2-bold'>总房款<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalPayment)}></View></View>
          <Text className='cl-input-text-bold'>{this.state.mTotalPayment.toFixed(4)}</Text>
        </View>

        <View className='cl-input-item-container-bold'>
          <View className='cl-input-title-bold'>税 + 费<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalTaxAndFee)}></View></View>
          <Text className='cl-input-text-bold'>{(this.state.mTotalTax + this.state.mTotalFee).toFixed(4)}</Text>
          <View className='cl-input-title2-bold'>平均单价<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.AverageUnitPrice)}></View></View>
          <Text className='cl-input-text-bold'>{(this.state.mHouseArea != 0 ? (this.state.mTotalPayment/this.state.mHouseArea) : 0).toFixed(4)}</Text>
        </View>
        {this.state.mEditable ?
           (<View className='cl-button-container'>
              <Button className='cl-button-item' type='primary' onClick={this.clearData}>清空数据</Button>
              <Button className='cl-button-item' type='primary' open-type='share'>分享结果</Button>
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
