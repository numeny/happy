import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup, Picker } from '@tarojs/components'
import './index.scss'

import { Log } from '@util/log'
import { Util, LoanType } from '../../util/util'
import { sCalcClientDecider } from './cityclient/city_client_decider'
// FIXIME
// import TaroRegionPicker from '../../components/taro-region-picker/index'

import Toolbar from '../common/mytoolbar'
import CalcLoan from '../common/calc_loan'

import { connect } from '@tarojs/redux'
import { add, minus, asyncAdd } from '../../actions/counter'
import { setCommercialLoanTotal, setCommercialLoanMonthlyPayment, setProvidentFundLoanTotal, setProvidentFundLoanMonthlyPayment, setOtherLoanTotal, setOtherLoanMonthlyPayment, setAllLoanTotal, setAllLoanMonthlyPayment } from '../../actions/loan'

import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

let sCalcClient = null

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

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add () {
    dispatch(add())
  },
  dec () {
    dispatch(minus())
  },
  asyncAdd () {
    dispatch(asyncAdd())
  }
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
    navigationBarTitleText: '茜茜猫首付计算神器',
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
      mCurrPage: 1,

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

      mMonthlyRepaymentCommercialLoan: 0,
      mMonthlyRepaymentProvidentFundLoan: 0,
      mMonthlyRepaymentOtherLoan: 0,

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

    this.props.setCommercialLoanTotal(
        Util.getNumber(this.$router.params.cl))
    this.props.setProvidentFundLoanTotal(
        Util.getNumber(this.$router.params.pfl))
    this.props.setOtherLoanTotal(
        Util.getNumber(this.$router.params.ol))

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
    Log.log("-------------updateTotalLoan-"
        + ", " + this.props.loan.mCommercialLoanTotal
        + ", " + this.props.loan.mProvidentFundLoanTotal
        + ", " + this.props.loan.mOtherLoanTotal
        )
    let totalLoan = this.props.loan.mCommercialLoanTotal
          + this.props.loan.mProvidentFundLoanTotal
          + this.props.loan.mOtherLoanTotal

    this.props.setAllLoanTotal(totalLoan)

    /*
    this.setState({
        mTotalLoan: this.state.mCommercialLoan + this.state.mProvidentFundLoan
                      + this.state.mOtherLoan,
    }, () => {
      if (this.updateTotalLoan.prototype.postCallback != null) {
        this.updateTotalLoan.prototype.postCallback()
      }
    })
    */
    if (this.updateTotalLoan.prototype.postCallback != null) {
      this.updateTotalLoan.prototype.postCallback()
    }
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
    } catch(err) {
      Log.error("onInputLoan: ", err);
      Taro.showToast({title: "请输入正确的金额！"})
    }
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

  onToolBarItemChanged = (idx) => {
    Log.log('onToolBarItemChanged, idx: ' + idx);
    
    this.setState({
        mCurrPage: idx,
    })
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
        {this.state.mCurrPage == 0 &&
        <View className='idx-top-item-container'>
        <View className='idx-top-title-container'>
          <View className='idx-top-title-city' onClick={this.onSelectCity}>{this.state.mCurrCity}
          <View className='at-icon at-icon-map-pin' onClick={this.onSelectCity}></View>
          </View>
          <View className='idx-top-title-unit'>计算单位：万元</View>
        </View>
        <View className='idx-input-item-container'>
          <Text className='idx-input-title'>房屋名称</Text>
          <Input className='idx-input-text' type='text' placeholder='名称'
              disabled={!this.state.mEditable} value={this.state.mHouseName} onInput={this.onInputHouseName} />
          <Text className='idx-input-title2'>面积</Text>
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
          <Text className='idx-input-text-bold'>{this.state.mTotalFee.toFixed(4)}</Text>
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
          <Text className='idx-input-text-bold'>{this.state.mTotalTax.toFixed(4)}</Text>
        </View>

        <View className='idx-input-item-container'>
          <Text className='idx-input-title'>商贷</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.props.loan.mCommercialLoanTotal} maxLength='10' onInput={this.onInputLoan.bind(this, LoanType.CommercialLoan)} />
          <Text className='idx-input-title2'>公积金贷款</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.props.loan.mProvidentFundLoanTotal} maxLength='10' onInput={this.onInputLoan.bind(this, LoanType.ProvidentFundLoan)} />
        </View>
        <View className='idx-input-item-container-bold'>
          <Text className='idx-input-title'>其他贷款</Text>
          <Input className='idx-input-text' type='digit' placeholder='万元'
              disabled={!this.state.mEditable} value={this.props.loan.mOtherLoanTotal} maxLength='10' onInput={this.onInputLoan.bind(this, LoanType.OtherLoan)} />
          <View className='idx-input-title2-bold'>总贷款<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalLoan)}></View></View>
          <Text className='idx-input-text-bold'>{this.props.loan.mAllLoanTotal.toFixed(4)}</Text>
        </View>

        <View className='idx-input-item-container'>
          <View className='idx-input-title-bold'>总首付<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.FirstPayment)}></View></View>
          <Text className='idx-input-text-bold'>{this.state.mFirstPayment.toFixed(4)}</Text>
          <View className='idx-input-title2-bold'>总房款<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalPayment)}></View></View>
          <Text className='idx-input-text-bold'>{this.state.mTotalPayment.toFixed(4)}</Text>
        </View>

        <View className='idx-input-item-container-bold'>
          <View className='idx-input-title-bold'>税 + 费<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.TotalTaxAndFee)}></View></View>
          <Text className='idx-input-text-bold'>{(this.state.mTotalTax + this.state.mTotalFee).toFixed(4)}</Text>
          <View className='idx-input-title2-bold'>平均单价<View className='at-icon at-icon-help' onClick={this.onClickOpenTipBoxIcon.bind(this, Util.mTipBoxMessages.AverageUnitPrice)}></View></View>
          <Text className='idx-input-text-bold'>{(this.state.mHouseArea != 0 ? (this.state.mTotalPayment/this.state.mHouseArea) : 0).toFixed(4)}</Text>
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
        </View>}

        {this.state.mCurrPage == 1 &&
          <View className='idx-top-item-container'>
            <CalcLoan />
          </View>}

        <Toolbar onItemChanged={this.onToolBarItemChanged}
            initPage={this.state.mCurrPage} />
      </View>
    )
  }
}
