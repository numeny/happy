import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup, Picker } from '@tarojs/components'
import './index.scss'

import { Log } from '@util/log'
import { Util } from '../../util/util'
import { sCalcClientDecider } from './cityclient/city_client_decider'
// FIXIME
// import TaroRegionPicker from '../../components/taro-region-picker/index'

import Toolbar from '../common/mytoolbar'
import CalcLoan from '../common/calc_loan'

import { connect } from '@tarojs/redux'

// import { setCommercialLoanTotal, setCommercialLoanMonthlyPayment, setProvidentFundLoanTotal, setProvidentFundLoanMonthlyPayment, setOtherLoanTotal, setOtherLoanMonthlyPayment, setAllLoanTotal, setAllLoanMonthlyPayment } from '../../actions/loan'
import { setLoanData } from '../../redux/actions/loan'
import { CommercialLoanTotal, CommercialLoanMonthlyPayment, ProvidentFundLoanTotal, ProvidentFundLoanMonthlyPayment, OtherLoanTotal, OtherLoanMonthlyPayment, AllLoanTotal, AllLoanMonthlyPayment, RadioValueCommercialLoanPaymentMethod, RadioValueProvidentFundLoanPaymentMethod, RadioValueOtherLoanPaymentMethod, DurationCommercialLoan, DurationProvidentFundLoan, DurationOtherLoan, RateCommercialLoan, RateProvidentFundLoan, RateOtherLoan, RateInputManualCommercialLoan, RateInputManualProvidentFundLoan, RateInputManualOtherLoan, RateDiscountIdxCommercialLoan, RateDiscountIdxProvidentFundLoan, RateDiscountIdxOtherLoan } from '../../redux/constants/loan'

import { DefaultValue, DefaultRateDiscountIdx, LoanType } from '../../constants/loan'

import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

let sCalcClient = null

@connect(({ loan }) => ({
  loan
}), (dispatch) => ({
  setLoanData (field, loan) {
    dispatch(setLoanData(field, loan))
  },
}))

export default class Index extends Component {
  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '房鱼首付计算',
  }

  constructor(props) {
    super(props)

    this.state = {
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

        this.updateTotalLoan,
        this.updateTotalFee,
        this.updateTotalTax,

        this.updateTotalPayment,
        this.updateFirstPayment,
      ],

      mEditable: true,

      mCurrProvince: Util.getString(this.$router.params.currProv, '北京市'),
      mCurrCity: Util.getString(this.$router.params.currCity, '北京市'),

      mFirstPayment: Util.getNumber3default0(this.$router.params.fp),
      mTotalPayment: Util.getNumber3default0(this.$router.params.tp),
      mTotalFee: Util.getNumber3default0(this.$router.params.tf),
      mTotalTax: Util.getNumber3default0(this.$router.params.tt),

      // input
      mHouseName: Util.getString(this.$router.params.hn),
      mHouseArea: Util.getNumber4(this.$router.params.ha),

      mTotalPrice: Util.getNumber4(this.$router.params.tpr),
      mOriginPrice: Util.getNumber4(this.$router.params.opr),
      mWebSignPrice: Util.getNumber4(this.$router.params.wspr),
      mOriginTaxSum: Util.getNumber4(this.$router.params.ots),

      // Tax
      mDeedTax: Util.getBoolean(this.$router.params.widtm) ? Util.getNumber4(this.$router.params.dt) : Util.getNumber3default0(this.$router.params.dt),
      mPersonalIncomeTax: Util.getBoolean(this.$router.params.wipitm) ? Util.getNumber4(this.$router.params.pit) : Util.getNumber3default0(this.$router.params.pit),
      mValueAddedTax: Util.getBoolean(this.$router.params.wivatm) ? Util.getNumber4(this.$router.params.vat) : Util.getNumber3default0(this.$router.params.vat),
      mOtherTax: Util.getNumber4(this.$router.params.ot),

      // Fee
      mAgencyFee: Util.getNumber4(this.$router.params.af),
      mLoanServiceFee: Util.getNumber4(this.$router.params.lsf),
      mEvaluationFee: Util.getNumber4(this.$router.params.ef),
      mMortgageRegistrationFee: Util.getNumber4(this.$router.params.mrf),
      mOtherFee: Util.getNumber4(this.$router.params.of),

      mFirstHouseRadioValue: Util.getNumber3default0(this.$router.params.fhrv),
      mAboveTwoYearsRadioValue: Util.getNumber3default0(this.$router.params.atyrv),
      mOnlyHouseRadioValue: Util.getBoolean(this.$router.params.ohrv, true),
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

    this.props.setLoanData(CommercialLoanTotal,
        Util.getNumber4(this.$router.params.clt))
    this.props.setLoanData(CommercialLoanMonthlyPayment,
        Util.getNumber3default0(this.$router.params.clmp))

    this.props.setLoanData(ProvidentFundLoanTotal,
        Util.getNumber4(this.$router.params.pflt))
    this.props.setLoanData(ProvidentFundLoanMonthlyPayment,
        Util.getNumber3default0(this.$router.params.pflmp))

    this.props.setLoanData(OtherLoanTotal,
        Util.getNumber4(this.$router.params.olt))
    this.props.setLoanData(OtherLoanMonthlyPayment,
        Util.getNumber3default0(this.$router.params.olmp))

    this.props.setLoanData(AllLoanTotal,
        Util.getNumber3default0(this.$router.params.alt))
    this.props.setLoanData(AllLoanMonthlyPayment,
        Util.getNumber3default0(this.$router.params.amp))

    this.props.setLoanData(RadioValueCommercialLoanPaymentMethod,
        Util.getNumber3default0(this.$router.params.rvclpm))
    this.props.setLoanData(RadioValueProvidentFundLoanPaymentMethod,
        Util.getNumber3default0(this.$router.params.rvpflpm))
    this.props.setLoanData(RadioValueOtherLoanPaymentMethod,
        Util.getNumber3default0(this.$router.params.rvolpm))

    this.props.setLoanData(DurationCommercialLoan,
        Util.getNumber3(this.$router.params.dcl,
          DefaultValue.LoanDuration))
    this.props.setLoanData(DurationProvidentFundLoan,
        Util.getNumber3(this.$router.params.dpf,
          DefaultValue.LoanDuration))
    this.props.setLoanData(DurationOtherLoan,
        Util.getNumber3(this.$router.params.dol,
          DefaultValue.LoanDuration))

    this.props.setLoanData(RateCommercialLoan,
        Util.getNumber3(this.$router.params.rcl,
          DefaultValue.BaseInterestRateCommercialLoan))
    this.props.setLoanData(RateProvidentFundLoan,
        Util.getNumber3(this.$router.params.rpf,
          DefaultValue.BaseInterestRateProvidentFundLoan))
    this.props.setLoanData(RateOtherLoan,
        Util.getNumber3(this.$router.params.rol,
          DefaultValue.BaseInterestRateOtherLoan))

    this.props.setLoanData(RateInputManualCommercialLoan,
        Util.getBoolean(this.$router.params.rimcl))
    this.props.setLoanData(RateInputManualProvidentFundLoan,
        Util.getBoolean(this.$router.params.rimpfl))
    this.props.setLoanData(RateInputManualOtherLoan,
        Util.getBoolean(this.$router.params.rimol))

    this.props.setLoanData(RateDiscountIdxCommercialLoan,
        Util.getNumber3(this.$router.params.rdicl,
          DefaultRateDiscountIdx.CommercialLoan))
    this.props.setLoanData(RateDiscountIdxProvidentFundLoan,
        Util.getNumber3(this.$router.params.rdipfl,
          DefaultRateDiscountIdx.ProvidentFundLoan))
    this.props.setLoanData(RateDiscountIdxOtherLoan,
        Util.getNumber3(this.$router.params.rdiol,
          DefaultRateDiscountIdx.OtherLoan))
  }

  componentWillMount () { }

  initCallLink = () => {
    for (var idx = 0; idx < this.state.callLinkForUpdateAll.length - 1; idx++) {
      let func = this.state.callLinkForUpdateAll[idx]
      let nextFunc = this.state.callLinkForUpdateAll[idx+1]
      func.prototype.postCallback = nextFunc
    }
  }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  updateTaxRate = () => {
  }

  setClientState = () => {
    let calculatableState = this.getCalcStateForTax();
    sCalcClient.setClientState(calculatableState)
  }

  updateAll = () => {
    // FIXME, set every time?
    this.setClientState()
    if (this.updateAll.prototype.postCallback != null) {
      this.updateAll.prototype.postCallback()
    }
  }

  updateFirstPayment = () => {
    this.setState({
        mFirstPayment: this.state.mTotalPayment - this.props.loan.mLoanData[AllLoanTotal],
    }, () => {
      if (this.updateFirstPayment.prototype.postCallback != null) {
        this.updateFirstPayment.prototype.postCallback()
      }
    })
  }

  updateTotalPayment = () => {
    this.setState({
      mTotalPayment: Util.getNumber3default0(this.state.mTotalPrice) + this.state.mTotalFee
                      + this.state.mTotalTax,
    }, () => {
      if (this.updateTotalPayment.prototype.postCallback != null) {
        this.updateTotalPayment.prototype.postCallback()
      }
    })
  }

  updateTotalLoan = () => {
    Log.log("-------------updateTotalLoan-"
        + ", " + this.props.loan.mLoanData[CommercialLoanTotal]
        + ", " + this.props.loan.mLoanData[ProvidentFundLoanTotal]
        + ", " + this.props.loan.mLoanData[OtherLoanTotal]
        )
    let totalLoan = Util.getNumber3default0(this.props.loan.mLoanData[CommercialLoanTotal])
          + Util.getNumber3default0(this.props.loan.mLoanData[ProvidentFundLoanTotal])
          + Util.getNumber3default0(this.props.loan.mLoanData[OtherLoanTotal])

    this.props.setLoanData(AllLoanTotal, totalLoan)

    if (this.updateTotalLoan.prototype.postCallback != null) {
      this.updateTotalLoan.prototype.postCallback()
    }
  }

  updateTotalFee = () => {
    let totalFee = (Util.getNumber3default0(this.state.mAgencyFee)
        + Util.getNumber3default0(this.state.mLoanServiceFee)
        + Util.getNumber3default0(this.state.mEvaluationFee)
        + Util.getNumber3default0(this.state.mMortgageRegistrationFee)
        + Util.getNumber3default0(this.state.mOtherFee))
    this.setState({
        mTotalFee: totalFee,
    }, () => {
      if (this.updateTotalFee.prototype.postCallback != null) {
        this.updateTotalFee.prototype.postCallback()
      }
    })
  }

  updateTotalTax = () => {
    const totalTax =
      Util.getNumber3default0(this.state.mDeedTax)
        + Util.getNumber3default0(this.state.mPersonalIncomeTax)
        + Util.getNumber3default0(this.state.mValueAddedTax)
        + Util.getNumber3default0(this.state.mOtherTax)
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
      this.setClientState()
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
    let webSignPrice = Math.max(Util.getNumber3default0(this.state.mOriginPrice) * 10 / 9,
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

  getCalcStateForTax = () => {
    return {
      // input
      mHouseArea: Util.getNumber3default0(this.state.mHouseArea),

      mTotalPrice: Util.getNumber3default0(this.state.mTotalPrice),
      mOriginPrice: Util.getNumber3default0(this.state.mOriginPrice),
      mWebSignPrice: Util.getNumber3default0(this.state.mWebSignPrice),
      mOriginTaxSum: Util.getNumber3default0(this.state.mOriginTaxSum),

      /*
      // Tax
      mDeedTax: undefined,
      mPersonalIncomeTax: undefined,
      mValueAddedTax: undefined,
      mOtherTax: undefined,

      // Fee
      mAgencyFee: undefined,
      mLoanServiceFee: undefined,
      mEvaluationFee: undefined,
      mMortgageRegistrationFee: undefined,
      mOtherFee: undefined,
      */
      mValueAddedTax: this.state.mValueAddedTax,

      mFirstHouseRadioValue: this.state.mFirstHouseRadioValue,
      mAboveTwoYearsRadioValue: this.state.mAboveTwoYearsRadioValue,
      mOnlyHouseRadioValue: this.state.mOnlyHouseRadioValue,
      mOrdinaryHouseRadioValue: this.state.mOrdinaryHouseRadioValue,

      mWillInputDeedTaxManual: this.state.mWillInputDeedTaxManual,
      mWillInputPersonalIncomeTaxManual: this.state.mWillInputPersonalIncomeTaxManual,
      mWillInputValueAddedTaxManual: this.state.mWillInputValueAddedTaxManual,
    }
  }

  clearData = (e) => {
    this.setState({
      mFirstPayment: 0,
      mTotalPayment: 0,
      mTotalFee: 0,
      mTotalTax: 0,

      // input
      mHouseName: '',
      mHouseArea: null,

      mTotalPrice: null,
      mOriginPrice: null,
      mWebSignPrice: null,
      mOriginTaxSum: null,

      // Tax
      mDeedTax: null,
      mPersonalIncomeTax: null,
      mValueAddedTax: null,
      mOtherTax: null,

      // Fee
      mAgencyFee: null,
      mLoanServiceFee: null,
      mEvaluationFee: null,
      mMortgageRegistrationFee: null,
      mOtherFee: null,

      mFirstHouseRadioValue: 0,
      mAboveTwoYearsRadioValue: 0,
      mOnlyHouseRadioValue: true,
      mOrdinaryHouseRadioValue: true,

      mWillInputDeedTaxManual: false,
      mWillInputPersonalIncomeTaxManual: false,
      mWillInputValueAddedTaxManual: false,
    })

    this.props.setLoanData(CommercialLoanTotal, null)
    this.props.setLoanData(ProvidentFundLoanTotal, null)
    this.props.setLoanData(OtherLoanTotal, null)
    this.props.setLoanData(AllLoanTotal, 0)
    this.props.setLoanData(AllLoanMonthlyPayment, 0)
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
    } catch(err) {
      Log.error("onInputLoan: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
    this.props.setLoanData(AllLoanMonthlyPayment, 0)
    this.updateAll()
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
    let param = Util.getParamForGenerateReport(this.state, this.props.loan.mLoanData);
    Log.log('onShareAppMessage, param: ' + param);

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
    if (!Util.isH5()) {
      let pages = getCurrentPages();
      let currPage = pages[pages.length-1];
      Log.log('index-componentDidShow, '
          + currPage.data.mCurrCity)
      this.setState({
          mCurrCity: currPage.data.mCurrCity,
      }, () => {
        this.onChangedCity()
      })
    } else {
      // TODO
    }
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

  getLoan = (loanType) => {
    if (loanType == LoanType.CommercialLoan) {
      return this.props.loan.mLoanData[CommercialLoanTotal]
    } else if (loanType == LoanType.ProvidentFundLoan) {
      return this.props.loan.mLoanData[ProvidentFundLoanTotal]
    } else if (loanType == LoanType.OtherLoan) {
      return this.props.loan.mLoanData[OtherLoanTotal]
    }
  }

  render () {
    let classNameForInputDeedTaxManual = this.state.mWillInputDeedTaxManual ?
            'idx-input-text' : 'idx-input-text-disable'

    let classNameForInputPersonalIncomeTaxManual = this.state.mWillInputPersonalIncomeTaxManual ?
            'idx-input-text' : 'idx-input-text-disable'

    let classNameForInputValueAddedTaxManual = this.state.mWillInputValueAddedTaxManual ?
            'idx-input-text' : 'idx-input-text-disable'

    return (
      <View className='idx-top-container'>
        <View className='idx-top-item-container'>
        <View className='idx-top-title-container'>
          <View className='idx-top-title-city' onClick={this.onSelectCity}>{this.state.mCurrCity}
          <View className='at-icon at-icon-map-pin' onClick={this.onSelectCity}></View>
          </View>
          <View className='idx-top-title-unit'>计算单位（万元）</View>
        </View>
        <View className='idx-input-item-container'>
          <Text className='idx-input-title-hn'>房屋名称</Text>
          <Input className='idx-input-text-hn' type='text' placeholder='名称'
              disabled={!this.state.mEditable} value={this.state.mHouseName} onInput={this.onInputHouseName} />
          <Text className='idx-input-title2'>面积(m2)</Text>
          <Input className='idx-input-text' type='digit' placeholder='m2'
              disabled={!this.state.mEditable} value={this.state.mHouseArea} maxLength='10' onInput={this.onInputHouseArea} />
        </View>
        <View className='idx-input-item-container'>
          <Text className='idx-input-title'>价格</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mTotalPrice} maxLength='10' onInput={this.onInputTotalPrice} />
          <Text className='idx-input-title2'>原值</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mOriginPrice} maxLength='10' onInput={this.onInputOriginPrice} />
        </View>
        <View className='idx-input-item-container-bold'>
          <Text className='idx-input-title'>网签价</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mWebSignPrice} maxLength='10' onInput={this.onInputWebSignPrice} />
          <View className='idx-input-title2'>原契税<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.OriginTaxSum)}></View></View>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mOriginTaxSum} maxLength='10' onInput={this.onInputOriginTaxSum} />
        </View>

        <RadioGroup>
          <View className='idx-input-item-container'>
            <Text className='idx-radio-title'>买方是否首套</Text>
            {this.state.mIsFirstHouseRadioList.map((item, i) => {
              return (
                <View onClick={this.onClickFirstHouseRadio.bind(this, item.value)} >
                  <Radio value={item.value} disabled={!this.state.mEditable}
                    checked={item.value == this.state.mFirstHouseRadioValue}
                    style={{transform: 'scale(0.8)'}} color='#FF7464'>
                  </Radio>
                  <Text className='idx-radio-text'>{item.text}</Text>
                </View>)
            })}
          </View>
        </RadioGroup>
        <RadioGroup>
          <View className='idx-input-item-container'>
            <Text className='idx-radio-title'>房本年限</Text>
            {this.state.mIsAboveTwoYearsRadioList.map((item, i) => {
              return (
                <View onClick={this.onClickAboveTwoYearsRadio.bind(this, item.value)}>
                  <Radio value={item.value} disabled={!this.state.mEditable}
                    checked={item.value == this.state.mAboveTwoYearsRadioValue}
                    style={{transform: 'scale(0.8)'}} color='#FF7464'>
                  </Radio>
                  <Text className='idx-radio-text'>{item.text}</Text>
                </View>)
            })}
          </View>
        </RadioGroup>
        <RadioGroup>
          <View className='idx-input-item-container'>
            <Text className='idx-radio-title'>卖方是否唯一住宅</Text>
            {this.state.mIsOnlyHouseRadioList.map((item, i) => {
              return (
                <View onClick={this.onClickOnlyHouseRadio.bind(this, item.value)} >
                  <Radio value={item.value} disabled={!this.state.mEditable}
                    checked={item.value == this.state.mOnlyHouseRadioValue}
                    style={{transform: 'scale(0.8)'}} color='#FF7464'>
                  </Radio>
                  <Text className='idx-radio-text'>{item.text}</Text>
                </View>)
            })}
          </View>
        </RadioGroup>

        <RadioGroup>
          <View className='idx-input-item-container'>
            <Text className='idx-radio-title'>是否普通住宅</Text>
            {this.state.mIsOrdinaryHouseRadioList.map((item, i) => {
              return (
                <View onClick={this.onClickOrdinaryHouseRadio.bind(this, item.value)}>
                  <Radio value={item.value} disabled={!this.state.mEditable}
                    checked={item.value == this.state.mOrdinaryHouseRadioValue}
                    style={{transform: 'scale(0.8)'}} color='#FF7464'>
                  </Radio>
                  <Text className='idx-radio-text'>{item.text}</Text>
                </View>)
            })}
          </View>
        </RadioGroup>

        <View className='idx-input-item-container'>
          <Text className='idx-input-title'>中介费</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mAgencyFee} maxLength='10' onInput={this.onInputAgencyFee} />
          <Text className='idx-input-title2'>贷款服务费</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mLoanServiceFee} maxLength='10' onInput={this.onInputLoanServiceFee} />
        </View>
        <View className='idx-input-item-container'>
          <Text className='idx-input-title'>评估费</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mEvaluationFee} maxLength='10' onInput={this.onInputEvaluationFee} />
          <Text className='idx-input-title2'>其他费用</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mOtherFee} maxLength='10' onInput={this.onInputOtherFee} />
        </View>
        <View className='idx-input-item-container-bold2'>
          <Text className='idx-input-title'></Text>
          <View className='idx-input-text'></View>
          <View className='idx-input-title-bold'>总费用<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalFee)}></View></View>
          <Text className='idx-input-text-bold'>{Util.getNumber3default0(this.state.mTotalFee).toFixed(2)}</Text>
        </View>

        <View className='idx-input-item-container'>
          <View className='idx-input-title'>契税<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.DeedTax)}></View></View>
          <Input className={classNameForInputDeedTaxManual}
                value={this.state.mDeedTax} type='text'
                disabled={!this.state.mEditable || !this.state.mWillInputDeedTaxManual}
                placeholder='（万元）' maxLength='6'
                onInput={this.onInputDeedTaxManual} />
          <CheckboxGroup
              onChange={this.changeWillInputDeedTaxManualCheckbox}>
            <View className='idx-input-title'>
              <Checkbox checked={this.state.mWillInputDeedTaxManual}
                disabled={!this.state.mEditable} />
                <Text>手动输入</Text>
            </View>
          </CheckboxGroup>
        </View>

        <View className='idx-input-item-container'>
          <View className='idx-input-title'>个人所得税<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.PersonalIncomeTax)}></View></View>
            <Input className={classNameForInputPersonalIncomeTaxManual}
                value={this.state.mPersonalIncomeTax} type='text'
                disabled={!this.state.mEditable || !this.state.mWillInputPersonalIncomeTaxManual}
                placeholder='（万元）' maxLength='6'
                onInput={this.onInputPersonalIncomeTaxManual} />
            <CheckboxGroup onChange={this.changeWillInputPersonalIncomeTaxManualCheckbox}>
              <View className='idx-input-title'>
                <Checkbox checked={this.state.mWillInputPersonalIncomeTaxManual}
                  disabled={!this.state.mEditable} />
                <Text>手动输入</Text>
              </View>
            </CheckboxGroup>
        </View>

        <View className='idx-input-item-container'>
          <View className='idx-input-title'>增值税<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.ValueAddedTax)}></View></View>
            <Input className={classNameForInputValueAddedTaxManual}
                value={this.state.mValueAddedTax} type='text'
                disabled={!this.state.mEditable || !this.state.mWillInputValueAddedTaxManual}
                placeholder='（万元）' maxLength='6'
                onInput={this.onInputValueAddedTaxManual} />
            <CheckboxGroup onChange={this.changeWillInputValueAddedTaxManualCheckbox}>
              <View className='idx-input-title'>
                <Checkbox checked={this.state.mWillInputValueAddedTaxManual}
                  disabled={!this.state.mEditable} />
                <Text>手动输入</Text>
              </View>
            </CheckboxGroup>
        </View>

        <View className='idx-input-item-container-bold2'>
          <Text className='idx-input-title'>其他税</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.state.mOtherTax} maxLength='10' onInput={this.onInputOtherTax} />
          <View className='idx-input-title2-bold'>总税款<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalTax)}></View></View>
          <Text className='idx-input-text-bold'>{Util.getNumber3default0(this.state.mTotalTax).toFixed(2)}</Text>
        </View>

        <View className='idx-input-item-container'>
          <Text className='idx-input-title'>商贷</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.getLoan(LoanType.CommercialLoan)} maxLength='10' onInput={this.onInputLoan.bind(this, LoanType.CommercialLoan)} />
          <Text className='idx-input-title2'>公积金贷款</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.getLoan(LoanType.ProvidentFundLoan)} maxLength='10' onInput={this.onInputLoan.bind(this, LoanType.ProvidentFundLoan)} />
        </View>
        <View className='idx-input-item-container-bold'>
          <Text className='idx-input-title'>其他贷款</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.getLoan(LoanType.OtherLoan)} maxLength='10' onInput={this.onInputLoan.bind(this, LoanType.OtherLoan)} />
          <View className='idx-input-title2-bold'>总贷款<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalLoan)}></View></View>
          <Text className='idx-input-text-bold'>{Util.getNumber3default0(this.props.loan.mLoanData[AllLoanTotal]).toFixed(2)}</Text>
        </View>

        <View className='idx-input-item-container'>
          <View className='idx-input-title-bold'>总首付<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.FirstPayment)}></View></View>
          <Text className='idx-input-text-bold'>{(Util.getNumber3default0(this.state.mTotalPayment) - Util.getNumber3default0(this.props.loan.mLoanData[AllLoanTotal])).toFixed(2)}</Text>
          <View className='idx-input-title2-bold'>总房款<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalPayment)}></View></View>
          <Text className='idx-input-text-bold'>{Util.getNumber3default0(this.state.mTotalPayment).toFixed(2)}</Text>
        </View>

        <View className='idx-input-item-container-bold'>
          <View className='idx-input-title-bold'>税 + 费<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalTaxAndFee)}></View></View>
          <Text className='idx-input-text-bold'>{(Util.getNumber3default0(this.state.mTotalTax) + Util.getNumber3default0(this.state.mTotalFee)).toFixed(2)}</Text>
          <View className='idx-input-title2-bold'>平均单价<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.AverageUnitPrice)}></View></View>
          <Text className='idx-input-text-bold'>{((Util.getNumber3default0(this.state.mHouseArea) != 0 ) ? (Util.getNumber3default0(this.state.mTotalPayment)/Util.getNumber3default0(this.state.mHouseArea)) : 0).toFixed(2)}</Text>
        </View>
        <View className='idx-input-item-container-bold'>
          <View className='idx-input-title-bold'>每月还款(元)
            <View className='at-icon at-icon-help'
                onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.AllLoanMonthlyPayment)}></View>
          </View>
          <Text className='idx-input-text-bold'>{(Util.getNumber3default0(this.props.loan.mLoanData[AllLoanMonthlyPayment]) * 10000).toFixed(0)}</Text>
          <View className='idx-input-title2-bold'></View>
          <Text className='idx-input-text-bold'></Text>
        </View>
        {this.state.mEditable ?
           (<View className='idx-button-container'>
              <Button className='idx-button-item' type='primary' onClick={this.clearData}>清空数据</Button>
              <Button className='idx-button-item' type='primary' open-type='share'>分享结果</Button>
            </View>)
              : (<View className='idx-button-container'>
                    <Button className='idx-button-item' type='primary' onClick={this.recaculate}>重新计算</Button>
                    <Button className='idx-button-item' type='primary' open-type='share'>分享结果</Button>
                  </View>)}
        </View>

      </View>
    )
  }
}
