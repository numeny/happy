import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup } from '@tarojs/components'
import './index.scss'

import { Util } from '../../util/util'

import namedPng from '@images/index/1.jpeg'
import namedVideo from '@res/video/1.mp4'

function FirstTierCitieCalcClient(state) {
  console.log('FirstTierCitieCalcClient')
  this.mState = state
  this.setClientState = function(state) {
    this.mState = state
  }
  // 北上广深圳: 普通住宅并且家庭首套住房90平米以下1%, 90平米以上1.5%, 140平米以上3%,
  //             非普通住宅以及二套房不管大小一律3%
  // FIXME 其他城市，家庭首套住房90平米以下1%, 90平米以上2%, 二套房不管大小一律3%
  this.getDeedTaxRate = function() {
    let deedTaxRate = 0
    if (this.mState.mOrdinaryHouseRadioValue
        && this.mState.mFirstHouseRadioValue == 1) {
      deedTaxRate = (this.mState.mHouseArea <= 90) ? 0.01
        : ((this.mState.mHouseArea <= 140) ? 0.015 : 0.03)
    } else {
      deedTaxRate = 0.03
    }
    // console.log('getDeedTaxRate, deedTaxRate: ' + deedTaxRate)
    return deedTaxRate
  }

  this.getDeedTax = function() {
    let deedTaxRate = this.getDeedTaxRate()
    let deedTax = this.mState.mWebSignPrice * deedTaxRate
    if (deedTax <= 0) {
      deedTax = 0
    }
    /*
    console.log('getDeedTax, deedTaxRate: ' + deedTaxRate
        + ", deedTax: " + deedTax)
    */
    return deedTax
  }

  this.getPersonalIncomeTax = function() {
    let personalIncomeTax = 0
    if (this.mState.mAboveTwoYearsRadioValue != 3 || !this.mState.mOnlyHouseRadioValue) {
      personalIncomeTax = (this.mState.mWebSignPrice * 0.9 - this.mState.mOriginPrice) * 0.2
    }
    if (personalIncomeTax <= 0) {
      personalIncomeTax = 0
    }
    return personalIncomeTax
  }

  // 对于非一线城市，个人购买不足2年的住房对外销售，按照5%的征收率全额缴纳增值税;个人将购买2年以上(含2年)的住房对外销售的，免征增值税。
  // 北、上、广、深四个一线城市，个人购买不足2年的住房对外销售的，按照5%的征收率全额缴纳增值税;个人将购买2年以上(含2年)的非普通住房对外销售的，以销售收入减去购买住房价款后的差额按照5%的征收率缴纳增值税;个人将购买2年以上(含2年)的普通住房对外销售的，免征增值税。
  this.getValueAddedTax = function() {
    const valueAddedTaxRate = 0.05 * 1.13 / 1.05
    let valueAddedTax = 0
    
    if (this.mState.mAboveTwoYearsRadioValue == 1) { // 所有的普通住宅和非普通住宅，只要不满两年
      valueAddedTax = this.mState.mWebSignPrice * valueAddedTaxRate
    } else if (!this.mState.mOrdinaryHouseRadioValue) {
      valueAddedTax = (this.mState.mWebSignPrice - this.mState.mOriginPrice) * valueAddedTaxRate
    }
    if (valueAddedTax <= 0) {
      valueAddedTax = 0
    }
    console.log('getValueAddedTax, valueAddedTaxRate: ' + valueAddedTaxRate
        + ', valueAddedTax: ' + valueAddedTax)
    return valueAddedTax
  }
}

let sCalcClient = new FirstTierCitieCalcClient()

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
      sCalcClient: null,

      callLinkForUpdateAll : [
        this.updateAll,
        this.updateDeedTax,
        this.updatePersonalIncomeTax,
        this.updateValueAddedTax,
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
      mLowestGuidePrice: 0,

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
      mInputPersonalIncomeTaxManual: 0,
      mWillInputValueAddedTaxManual: false,
      mInputValueAddedTaxManual: 0,


      mFirstHouseRadioValue: 1,
      mAboveTwoYearsRadioValue: 1,
      mOnlyHouseRadioValue: true,
      mOrdinaryHouseRadioValue: true,

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

    this.initCallLink()
    sCalcClient.setClientState(this.state)
  }

  componentWillMount () {
  }

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
    let deedTax = 0
    if (this.state.mWillInputDeedTaxManual) {
      deedTax = this.state.mInputDeedTaxManual
    } else {
      deedTax = sCalcClient.getDeedTax()
    }
    this.setState({
        mDeedTax: deedTax,
    }, () => {
      if (this.updateDeedTax.prototype.postCallback != null) {
        this.updateDeedTax.prototype.postCallback()
      }
    })
  }

  updatePersonalIncomeTax = () => {
    let personalIncomeTax = 0
    if (this.state.mWillInputPersonalIncomeTaxManual) {
      personalIncomeTax = this.state.mInputPersonalIncomeTaxManual
    } else {
      personalIncomeTax = sCalcClient.getPersonalIncomeTax()
    }
    this.setState({
        mPersonalIncomeTax: personalIncomeTax,
    }, () => {
      if (this.updatePersonalIncomeTax.prototype.postCallback != null) {
        this.updatePersonalIncomeTax.prototype.postCallback()
      }
    })
  }

  updateValueAddedTax = () => {
    let valueAddedTax = 0
    if (this.state.mWillInputValueAddedTaxManual) {
      valueAddedTax = this.state.mInputValueAddedTaxManual
    } else {
      valueAddedTax = sCalcClient.getValueAddedTax()
    }
    this.setState({
        mValueAddedTax: valueAddedTax,
    }, () => {
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
    Util.setInterval(() => {
      this.setState({
          mHouseName: e.target.value,
      })
    })
  }

  onInputHouseArea = (e) => {
    Util.setInterval(() => {
      try {
        let houseArea = Number(e.target.value)
        this.setState({
            mHouseArea: houseArea,
        }, () => {
          this.updateAll()
        })
      } catch(err) {
        console.log("onInputHouseArea: ", err);
        Taro.showToast({title: "请输入正确的面积！"})
      }
    })
  }

  onInputTotalPrice = (e) => {
    Util.setInterval(() => {
      try {
        let totalPrice = Number(e.target.value)
        this.setState({
            mTotalPrice: totalPrice,
        }, () => {
          this.updateAll()
        })
    
      } catch(err) {
        console.log("onInputTotalPrice: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputOriginPrice = (e) => {
    Util.setInterval(() => {
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
        }, () => {
          this.updateAll()
        })
    
      } catch(err) {
        console.log("onInputOriginPrice: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onWebSignPriceChanged = (webSignPrice) => {
    Util.setInterval(() => {
      this.setState({
          mWebSignPrice: webSignPrice,
      }, () => {
        this.updateAll()
      })
    })
  }

  onInputWebSignPrice = (e) => {
    Util.setInterval(() => {
      try {
        let webSignPrice = Number(e.target.value)
        this.onWebSignPriceChanged(webSignPrice)
      } catch(err) {
        console.log("onInputWebSignPrice: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputLowestGuidePrice = (e) => {
    console.log("onInputLowestGuidePrice: ", e.target.value);
    Util.setInterval(() => {
      try {
        let lowestGuidePrice = Number(e.target.value)
        this.setState({
            mLowestGuidePrice: lowestGuidePrice,
        }, () => {
          this.updateAll()
        })
    
      } catch(err) {
        console.log("onInputLowestGuidePrice: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputAgencyFee = (e) => {
    Util.setInterval(() => {
      try {
        let agencyFee = Number(e.target.value)
        this.setState({
            mAgencyFee: agencyFee,
        }, () => {
          this.updateAll()
        })
      } catch(err) {
        console.log("onInputAgencyFee: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputLoanServiceFee = (e) => {
    Util.setInterval(() => {
      try {
        let loanServiceFee = Number(e.target.value)
        this.setState({
            mLoanServiceFee: loanServiceFee,
        }, () => {
          this.updateAll()
        })
      } catch(err) {
        console.log("onInputLoanServiceFee: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputEvaluationFee = (e) => {
    Util.setInterval(() => {
      try {
        let evaluationFee = Number(e.target.value)
        this.setState({
            mEvaluationFee: evaluationFee,
        }, () => {
          this.updateAll()
        })
      } catch(err) {
        console.log("onInputEvaluationFee: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputMortgageRegistrationFee = (e) => {
    Util.setInterval(() => {
      try {
        let mortgageRegistrationFee = Number(e.target.value)
        this.setState({
            mMortgageRegistrationFee: mortgageRegistrationFee,
        }, () => {
            this.updateAll()
        })
      } catch(err) {
        console.log("onInputMortgageRegistrationFee: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputOtherFee = (e) => {
    Util.setInterval(() => {
      try {
        let otherFee = Number(e.target.value)
        this.setState({
            mOtherFee: otherFee,
        }, () => {
            this.updateAll()
        })
      } catch(err) {
        console.log("onInputOtherFee: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputCommercialLoan = (e) => {
    Util.setInterval(() => {
      try {
        let commercialLoan = Number(e.target.value)
        this.setState({
            mCommercialLoan: commercialLoan,
        }, () => {
            this.updateAll()
        })
      } catch(err) {
        console.log("onInputCommercialLoan: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputProvidentFundLoan = (e) => {
    Util.setInterval(() => {
      try {
        let providentFundLoan = Number(e.target.value)
        this.setState({
            mProvidentFundLoan: providentFundLoan,
        }, () => {
            this.updateAll()
        })
      } catch(err) {
        console.log("onInputProvidentFundLoan: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputOtherLoan = (e) => {
    Util.setInterval(() => {
      try {
        let otherLoan = Number(e.target.value)
        this.setState({
            mOtherLoan: otherLoan,
        }, () => {
            this.updateAll()
        })
      } catch(err) {
        console.log("onInputOtherLoan: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputDeedTaxManual = (e) => {
    if (!this.state.mWillInputDeedTaxManual) {
      console.error('Should not update deed tax manully, e.target.value:',
          e.target.value)
      return
    }
    Util.setInterval(() => {
      try {
        let inputDeedTaxManual = Number(e.target.value)
        this.setState({
            mInputDeedTaxManual: inputDeedTaxManual,
        }, () => {
            this.updateAll()
        })
    
      } catch(err) {
        console.log("onInputDeedTaxManual: ", err);
        Taro.showToast({title: "请输入正确的契税金额！"})
      }
    })
  }

  onInputPersonalIncomeTaxManual = (e) => {
    if (!this.state.mWillInputPersonalIncomeTaxManual) {
      console.error('Should not update person income tax manully, e.target.value:',
          e.target.value)
      return
    }
    Util.setInterval(() => {
      try {
        let inputPersonalIncomeTaxManual = Number(e.target.value)
        this.setState({
            mInputPersonalIncomeTaxManual: inputPersonalIncomeTaxManual,
        }, () => {
            this.updateAll()
        })
    
      } catch(err) {
        console.log("onInputPersonalIncomeTaxManual: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  onInputValueAddedTaxManual = (e) => {
    if (!this.state.mWillInputValueAddedTaxManual) {
      console.error('Should not update value added tax manully, e.target.value:',
          e.target.value)
      return
    }
    Util.setInterval(() => {
      try {
        let inputValueAddedTaxManual = Number(e.target.value)
        console.log("onInputValueAddedTaxManual: " + inputValueAddedTaxManual
            + " , e.target.value: " + e.target.value);
        this.setState({
            mInputValueAddedTaxManual: inputValueAddedTaxManual,
        }, () => {
            this.updateAll()
        })
      } catch(err) {
        console.log("onInputValueAddedTaxManual: ", err);
        Taro.showToast({title: "请输入正确的金额！"})
      }
    })
  }

  clickWillInputDeedTaxManualCheckbox = (e) => {
    Util.setInterval(() => {
      console.log('clickWillInputDeedTaxManualCheckbox, e.detail:', e.detail)
      this.setState(
        prevState => ({
          mWillInputDeedTaxManual: !prevState.mWillInputDeedTaxManual,
        }), () => {
            this.updateAll()
        })
    })
  }

  clickWillInputPersonalIncomeTaxManualCheckbox = (e) => {
    Util.setInterval(() => {
      console.log('clickWillInputPersonalIncomeTaxManualCheckbox, e.detail:', e.detail)
      this.setState(
        prevState => ({
          mWillInputPersonalIncomeTaxManual: !prevState.mWillInputPersonalIncomeTaxManual,
        }), () => {
            this.updateAll()
        })
    })
  }

  clickWillInputValueAddedTaxManualCheckbox = (e) => {
    Util.setInterval(() => {
      console.log('clickWillInputValueAddedTaxManualCheckbox, e.detail:', e.detail)
      this.setState(
        prevState => ({
          mWillInputValueAddedTaxManual: !prevState.mWillInputValueAddedTaxManual,
        }), () => {
            this.updateAll()
        })
    })
  }

  onClickFirstHouseRadio = (value, e) => {
    Util.setInterval(() => {
      console.log('onClickFirstHouseRadio, idx:', value)
      this.setState({
          mFirstHouseRadioValue: value,
      }, () => {
          this.updateAll()
      })
    })
  }

  onClickAboveTwoYearsRadio = (value, e) => {
    Util.setInterval(() => {
      console.log('onClickAboveTwoYearsRadio, value:', value)
      this.setState({
          mAboveTwoYearsRadioValue: value,
      }, () => {
          this.updateAll()
      })
    })
  }

  onClickOnlyHouseRadio = (value, e) => {
    Util.setInterval(() => {
      console.log('onClickOnlyHouseRadio, value:', value)
      this.setState({
          mOnlyHouseRadioValue: value,
      }, () => {
          this.updateAll()
      })
    })
  }

  onClickOrdinaryHouseRadio = (value, e) => {
    Util.setInterval(() => {
      console.log('onClickOrdinaryHouseRadio, value:', value)
      this.setState({
          mOrdinaryHouseRadioValue: value,
      }, () => {
          this.updateAll()
      })
    })
  }

  onShareAppMessage = (share) => {
    console.error('onShareAppMessage: from: ' + share.from
        + ', target: ' + share.target
        + ', webViewUrl: ' + share.webViewUrl);
    return {
      title: '自定义转发标题',
      path: '/pages/index/index?id=123'
    }
  }

  render () {
    let classNameForInputDeedTaxManual = this.state.mWillInputDeedTaxManual ?
            'idx-input-text idx-input-text-deedtax' : 'idx-input-text-disable idx-input-text-deedtax'

    let classNameForInputPersonalIncomeTaxManual = this.state.mWillInputPersonalIncomeTaxManual ?
            'idx-input-text idx-input-text-deedtax' : 'idx-input-text-disable idx-input-text-deedtax'

    let classNameForInputValueAddedTaxManual = this.state.mWillInputValueAddedTaxManual ?
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
              placeholder='（万元）' maxLength='10'
              onInput={this.onInputDeedTaxManual} />
            <CheckboxGroup>
              <View className='idx-input-title'>
                <Checkbox checked={this.state.mWillInputDeedTaxManual}
                  onClick={this.clickWillInputDeedTaxManualCheckbox}>
                      手动输入契税</Checkbox>
              </View>
            </CheckboxGroup>
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>个税</Text>
            <Input className={classNameForInputPersonalIncomeTaxManual}
              disabled={!this.state.mWillInputPersonalIncomeTaxManual} type='text'
              placeholder='（万元）' maxLength='10'
              onInput={this.onInputPersonalIncomeTaxManual} />
            <CheckboxGroup>
              <View className='idx-input-title'>
                <Checkbox checked={this.state.mWillInputPersonalIncomeTaxManual}
                  onClick={this.clickWillInputPersonalIncomeTaxManualCheckbox}>
                      手动输入个税</Checkbox>
              </View>
            </CheckboxGroup>
          </View>

          <View className='idx-input-item-container'>
            <Text className='idx-input-title'>增值税</Text>
            <Input className={classNameForInputValueAddedTaxManual}
              disabled={!this.state.mWillInputValueAddedTaxManual} type='text'
              placeholder='（万元）' maxLength='10'
              onInput={this.onInputValueAddedTaxManual} />
            <CheckboxGroup>
              <View className='idx-input-title'>
                <Checkbox checked={this.state.mWillInputValueAddedTaxManual}
                  onClick={this.clickWillInputValueAddedTaxManualCheckbox}>
                      手动输入增值税</Checkbox>
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
                  <View>
                    <Radio value={item.value}
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
                    <Radio value={item.value}
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
                    <Radio value={item.value}
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

          <View>实际网签价：{this.state.mWebSignPrice.toFixed(2)}</View>
          <View>实际契税税率：{sCalcClient.getDeedTaxRate()}</View>
          <View>id：{this.$router.params.id}</View>
          <Button type='primary' onClick={this.lowestPersonalIncomeTax}>
            个税为零计算</Button>
          <Button type='primary'>开始计算</Button>
          <Button type='primary' open-type='share'>转发给朋友</Button>
        </View>
      </View>
    )
  }
}
