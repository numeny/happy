import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup, ScrollView } from '@tarojs/components'
import './tipbox.scss'

import { Util } from '../../util/util'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

const sPersonalIncomeInfo = '1. 卖方家庭首套住房，并且购买时间超过5年，免征个人所得税。'
const sPersonalIncomeInfo2 = '2. 其他情况，征收个人所得税。（原值输入为零时，代表没有提供原值）'

export default class Tipbox extends Component {

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
      // refer to definition of Utils.mTipBoxMessages
      mIsShowingTipBoxIdx: Number(this.$router.params.idx),
      mTipBoxMessages : {
        properties: {
          // DeedTax
          1: {title: '关于契税',
              contents: [
                '本计算器按照下列方式计算契税，如果不是此计算方法，请计算并手动输入契税额。',
                '1. 契税率：家庭首套住房，90平米以下1%，90平米以上1.5%；二套房一律为3%。',
                '2. 契税 = （网签价 - 增值税）x 契税率。',
          ]},
          // PersonalIncomeTax
          2: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                sPersonalIncomeInfo,
                sPersonalIncomeInfo2,
                '   1) 没有提供原值（原值输入为零）：个人所得税 =（网签价 - 本次增值税）x 1%。',
                '   2) 有原值：个人所得税 =（网签价 - 本次增值税 - 原值 - 原契税）x 20%',
          ]},
          // ValueAddedTax
          3: {title: '关于增值税及附加',
              contents: [
                '本计算器按照下列方式计算增值税及附加，如果不是此计算方法，请计算并手动输入增值税额。',
                '使用的增值税税率 = 5.6% ÷ 1.05 = 5.33%',
                '1. 购买不满2年的住房，增值税 = 网签价 x 增值税税率；',
                '2. 购买2年以上（含2年）的非普通住房，增值税 = （网签价 - 原值）x 增值税税率；',
                '3. 购买2年以上（含2年）的普通住房，增值税 = 0。',
          ]},
          // FirstPayment
          4: {title: '关于总首付',
              contents: [
                '本计算器按以下公式计算总首付：',
                '总首付 = 总房款 - 总贷款',
                '总房款 = 价格 + 总费用 + 总税款',
                '总费用 = 中介费 + 贷款费用 + 评估费 + 其他费用',
                '总税款 = 契税 + 个人所得税 + 增值税 + 其他税',
          ]},
          // TotalPayment
          5: {title: '关于总房款',
              contents: [
                '本计算器按以下公式计算总房款：',
                '总房款 = 价格 + 总费用 + 总税款',
                '总费用 = 中介费 + 贷款费用 + 评估费 + 其他费用',
                '总税款 = 契税 + 个人所得税 + 增值税 + 其他税',
          ]},
          // TotalFee
          6: {title: '关于总费用',
              contents: [
                '本计算器按以下公式计算总费用：',
                '总费用 = 中介费 + 贷款费用 + 评估费 + 其他费用',
          ]},
          // TotalTax
          7: {title: '关于总税款',
              contents: [
                '本计算器按以下公式计算总税款：',
                '总税款 = 契税 + 个人所得税 + 增值税 + 其他税',
          ]},
          // TotalLoan
          8: {title: '关于总贷款',
              contents: [
                '本计算器按以下公式计算总贷款：',
                '总贷款 = 商贷 + 公积金贷款 + 其他贷款',
          ]},
          // TotalTaxAndFee
          9: {title: '关于税+费',
              contents: [
                '本计算器按以下公式计算 税+费：',
                '税+费 = 总费用 + 总税款',
                '总费用 = 中介费 + 贷款费用 + 评估费 + 其他费用',
                '总税款 = 契税 + 个人所得税 + 增值税 + 其他税',
          ]},
          // AverageUnitPrice
          10: {title: '关于平均单价',
              contents: [
                '本计算器按以下公式计算平均单价：',
                '平均单价 = 总房款 ÷ 房屋面积',
                '总房款 = 价格 + 总费用 + 总税款',
                '总费用 = 中介费 + 贷款费用 + 评估费 + 其他费用',
                '总税款 = 契税 + 个人所得税 + 增值税 + 其他税',
          ]},
          // OriginTaxSum
          11: {title: '关于原契税',
              contents: [
                '原契税为卖方原购房时的契税，可以用于抵扣个人所得税。默认为零。',
          ]},
          // ValueAddedTax_Shenzhen
          12: {title: '关于增值税',
              contents: [
                '本计算器按照下列方式计算增值税，如果不是此计算方法，请计算并手动输入增值税额。',
                '使用的增值税税率 = 5% ÷ 1.05 = 4.76%',
                '1. 购买不满2年的住房，增值税 = 网签价 x 增值税税率；',
                '2. 购买2年以上（含2年）的非普通住房，增值税 = （网签价 - 原值）x 增值税税率；',
                '3. 购买2年以上（含2年）的普通住房，增值税 = 0。',
          ]},
          // DeedTax_NonFirstTierCityClient
          13: {title: '关于契税',
              contents: [
                '本计算器按照下列方式计算契税，如果不是此计算方法，请计算并手动输入契税额。',
                '1. 契税率：购买首套住房或者二套住房，90平米（含）以下1%; 购买首套住房，90平米以上，为1.5%; 购买第二套住房，90平米以上，为2%；购买第三套及以上住房，不论面积，为3%',
                '2. 契税 = 网签价 x 契税率。',
          ]},
          // ValueAddedTax_NonFirstTierCityClient
          14: {title: '关于增值税',
              contents: [
                '本计算器按照下列方式计算增值税，如果不是此计算方法，请计算并手动输入增值税额。',
                '使用的增值税税率 = 5.6%',
                '1. 购买不满2年的住房，增值税 = 网签价 x 增值税税率；',
                '2. 购买2年以上（含2年）的住房，增值税 = 0。',
          ]},
          // DeedTax_ForTianjin
          15: {title: '关于契税',
              contents: [
                '本计算器按照下列方式计算契税，如果不是此计算方法，请计算并手动输入契税额。',
                '1. 契税率：购买首套或者二套私产房，90平米（含）以下1%; 购买首套私产房，90平米以上，为1.5%; 购买二套私产房，90平米以上，为2%；购买三套及以上私产房，为3%（目前限购, 无法购买第三套）。',
                '2. 契税 = 去税后的网签价 x 契税率。',
                '3. 去税后的网签价: 不满两年的私产房去税后的网签价 = 网签价 ÷ 1.05，满两年的，去税后的网签价 = 实际网签价;',
          ]},
          // PersonalIncomeTax_Chengdu
          16: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                sPersonalIncomeInfo,
                '2. 其他情况，征收个人所得税。个人所得税 = 网签价 x 1% ÷ 1.05。',
          ]},
          // PersonalIncomeTax_Beijing
          17: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                sPersonalIncomeInfo,
                sPersonalIncomeInfo2,
                '  (1) 不能提供原值的，个人所得税 = （网签价 - 增值税）x 1%；',
                '  (2) 能提供原值的，个人所得税 = （网签价 - 网签价 x 10% - 增值税及附加 - 原值 - 原契税）x 20%。',
          ]},
          // PersonalIncomeTax_Shanghai
          18: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                sPersonalIncomeInfo,
                sPersonalIncomeInfo2,
                '   (1) 不能提供原值的（原值输入为零），个人所得税 = （网签价-增值税）x 税率；税率的为普通住宅1%，非普住宅为2%。',
                 '  (2) 能提供原值的，个人所得税 = （网签价 - 增值税及附加 - 原值 - 原契税）x 20%。',
          ]},
          // PersonalIncomeTax_Shenzhen
          19: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                sPersonalIncomeInfo,
                sPersonalIncomeInfo2,
                 '  (1) 个人所得税 = 按核定计算的个税和按核实计算的个税中较小的一个。',
                '   (2) 按核定计算的个税 = （网签价 - 增值税）x 税率；税率, 普通住宅为1%，非普住宅为1.5%。',
                 '  (3) 按核实计算的个税 = （网签价 - 增值税 - 原值）x 20%。',
          ]},
          // DeedTax_Guangzhou
          20: {title: '关于契税',
              contents: [
                '本计算器按照下列方式计算契税，如果不是此计算方法，请计算并手动输入契税额。',
                '1. 契税率：家庭首套住房，90平米以下1%，90平米以上1.5%；二套房一律为3%。',
                '2. 契税： ',
                '   (1) 普通住宅契税 = 网签价 x 契税率',
                '   (2) 非普通住宅契税 = (去税后的网签价 - 增值税) x 契税率。',
                '   (3) 去税后的网签价: 不满两年的住房，去税后的网签价 = 网签价 ÷ 1.05，满两年的，去税后的网签价 = 实际网签价;',
          ]},
          // PersonalIncomeTax_Guangzhou
          21: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                sPersonalIncomeInfo,
                sPersonalIncomeInfo2,
                '  (1) 满五不唯一，个人所得税 = 网签价 x 1%',
                '  (2) 不满五年的: 如果没有提供原值，个人所得税 = 去税后的网签价 x 1%， 如果提供原值，那么个人所得税 =（去税后的网签价-原值-原契税）x 20%。',
                '  (3) 去税后的网签价: 不满两年的住房，去税后的网签价 = 网签价 ÷ 1.05，满两年的，去税后的网签价 = 实际网签价;',
          ]},
          // ValueAddedTax_Guangzhou
          22: {title: '关于增值税及附加',
              contents: [
                '本计算器按照下列方式计算增值税及附加，如果不是此计算方法，请计算并手动输入增值税额。',
                '使用的增值税税率 = 5.3% ÷ 1.05 = 5.33%',
                '1. 购买不满2年的住房，增值税 = 网签价 x 增值税税率；',
                '2. 购买2年以上（含2年）的非普通住房，增值税 = （网签价 - 原值）x 增值税税率；',
                '3. 购买2年以上（含2年）的普通住房，增值税 = 0。',
          ]},
          // ValueAddedTax_Tianjin
          23: {title: '关于增值税及附加',
              contents: [
                '本计算器按照下列方式计算增值税及附加，如果不是此计算方法，请计算并手动输入增值税额。',
                '使用的增值税税率 = 5% ÷ 1.05 = 4.76%',
                '1. 购买不满2年的私产房，增值税 = 网签价 x 增值税税率；',
                '2. 购买2年以上（含2年）的私产房，免交增值税。',
          ]},
          // PersonalIncomeTax_Tianjin
          24: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                sPersonalIncomeInfo,
                sPersonalIncomeInfo2,
                '  (1) 个人所得税 = 去税后的网签价 x 1%。',
                '  (2) 去税后的网签价: 不满两年的私产房, 去税后的网签价 = 网签价 ÷ 1.05，满两年的住房，去税后的网签价 = 实际网签价;',
          ]},
          // DeedTax_Wuhan
          25: {title: '关于契税',
              contents: [
                '本计算器按照下列方式计算契税，如果不是此计算方法，请计算并手动输入契税额。',
                '1. 契税率：购买首套住房或者二套住房，90平米（含）以下1%; 购买首套住房，90平米以上，为1.5%; 购买第二套住房，90平米以上，为2%；购买第三套及以上住房，不论面积，为3%',
                '2. 契税 = ( 网签价 - 增值税 ) x 契税率。',
          ]},
          // PersonalIncomeTax_Wuhan
          26: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                sPersonalIncomeInfo,
                sPersonalIncomeInfo2,
                '  (1) 个人所得税 = 去税后的网签价 x 1%。',
                '  (2) 去税后的网签价: 去税后的网签价 = 网签价 - 增值税。',
          ]},
          // ValueAddedTax_Wuhan
          27: {title: '关于增值税及附加',
              contents: [
                '本计算器按照下列方式计算增值税及附加，如果不是此计算方法，请计算并手动输入增值税额。',
                '1. 使用的增值税税率 = 5.6% ÷ 1.05 = 5.33%；',
                '2. 增值税 = 网签价 x 增值税税率。',
          ]},
          // PersonalIncomeTax_Qingdao
          28: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                sPersonalIncomeInfo,
                '2. 其他情况，征收个人所得税。个人所得税 = 网签价 x 2%。',
          ]},
          // ValueAddedTax_Qingdao
          29: {title: '关于增值税及附加',
              contents: [
                '本计算器按照下列方式计算增值税及附加，如果不是此计算方法，请计算并手动输入增值税额。',
                '1. 使用的增值税税率 = 5.6% ÷ 1.05 = 5.33%；',
                '2. 增值税 = 网签价 x 增值税税率。',
          ]},
          // DeedTax_Suzhou
          30: {title: '关于契税',
              contents: [
                '本计算器按照下列方式计算契税，如果不是此计算方法，请计算并手动输入契税额。',
                '1. 契税率：家庭首套住房，90平米以下1%，90平米以上1.5%；二套房及以上为3%。',
                '2. 契税 = 网签价 x 契税率。',
          ]},
          // PersonalIncomeTax_Suzhou
          31: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                sPersonalIncomeInfo,
                sPersonalIncomeInfo2,
                '  (1) 如果提供原值，那么个人所得税 =（网签价格-增值税-原值-原契税）x 20%。',
                '  (2) 如果不提供原值，那么个人所得税 = 税基 x 税率，其中不满两年住宅的税基为（网签价-增值税)，满两年住宅的税基为网签价；普通住宅税率为1%，非普通住宅税率为2%。',
          ]},
          // ValueAddedTax_Suzhou
          32: {title: '关于增值税及附加',
              contents: [
                '本计算器按照下列方式计算增值税及附加，如果不是此计算方法，请计算并手动输入增值税额。',
                '使用的增值税税率 = 5% ÷ 1.05 = 4.76%',
                '1. 购买不满2年的住房，增值税 = 网签价 x 增值税税率；',
                '2. 购买2年以上（含2年）的非普通住房，增值税 = （网签价 - 原值）x 增值税税率；',
                '3. 购买2年以上（含2年）的普通住房，增值税 = 0。',
          ]},
          // DeedTax_Chengdu
          33: {title: '关于契税',
              contents: [
                '本计算器按照下列方式计算契税，如果不是此计算方法，请计算并手动输入契税额。',
                '1. 契税率：购买首套住房或者二套住房，90平米（含）以下1%; 购买首套住房，90平米以上，为1.5%; 购买第二套住房，90平米以上，为2%；购买第三套及以上住房，不论面积，为3%',
                '2. 契税 = 去税后网签价 x 契税率 ÷ 1.05。',
          ]},
          // ValueAddedTax_Chengdu
          34: {title: '关于增值税及附加',
              contents: [
                '本计算器按照下列方式计算增值税及附加，如果不是此计算方法，请计算并手动输入增值税额。',
                '使用的增值税税率 = 5.6% ÷ 1.05 = 5.33%',
                '1. 购买不满2年的住房，增值税 = 网签价 x 增值税税率；',
                '2. 购买2年以上（含2年）的住房，免交增值税。',
          ]},
          // AllLoanMonthlyPayment
          35: {title: '关于每月还款',
              contents: [
                '本计算器按照下列方式计算每月还款:',
                '请点击工具栏上的\"计算房贷\"进行计算，计算后会自动同步到主页面。',
                '每月还款 = 商贷每月还款 + 公积金每月还款 + 其他贷款每月还款；',
          ]},
        },
      },
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onClickCloseTipBoxIcon = (e) => {
    Taro.navigateBack();
  }

  render () {
    return (
      <View className='idx-top-container-1'>
        <View className='at-icon at-icon-close idx-tip-box-icon-close'
          onClick={this.onClickCloseTipBoxIcon}></View>
        <View className='idx-tip-box'>
          <View className='idx-tip-box-title'>
            {this.state.mTipBoxMessages.properties[
                      this.state.mIsShowingTipBoxIdx].title}-{this.$router.params.city}
          </View>
          <View className='idx-tip-box-content'>
            {this.state.mTipBoxMessages.properties[
              this.state.mIsShowingTipBoxIdx].contents.map(
                  (item, i) => {
              return (
                <View className='idx-tip-box-content'>
                  {item}
                </View>)
            })}
          </View>
        </View>
      </View>
    )
  }
}
