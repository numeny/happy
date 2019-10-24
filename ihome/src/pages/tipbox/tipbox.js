import Taro, { Component, Config } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, RadioGroup, Radio, Checkbox, CheckboxGroup } from '@tarojs/components'
import './tipbox.scss'

import { Util } from '../../util/util'
import "../../../node_modules/taro-ui/dist/style/components/icon.scss";

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
                '1. 契税率：家庭首套住房，90平米以下1%，90平米以上1.5%；',
                '           二套房一律为3%。',
                '2. 契税 = （网签价 - 增值税）x 契税率。',
          ]},
          // PersonalIncomeTax
          2: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                '1. 卖方家庭首套住房，并且购买时间超过5年，免征个人所得税。',
                '2. 其他情况，征收个人所得税。',
                '   1) 有原值价格：个人所得税 =（网签价格 - 本次增值税 - 住房原值 - 原税费合计）x 20%',
                '   2) 没有原值价格：个人所得税 =（网签价格 - 本次增值税）x 1%。',
          ]},
          // ValueAddedTax
          3: {title: '关于增值税',
              contents: [
                '本计算器按照下列方式计算增值税，如果不是此计算方法，请计算并手动输入增值税额。',
                '使用的增值税税率 = 5% x 1.13 / 1.05 = 5.28%',
                '1. 购买不足2年的住房，增值税 = 网签价格 x 增值税税率；',
                '2. 购买2年以上（含2年）的非普通住房，增值税 = （网签价格 - 原值）x 增值税税率；',
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
                '平均单价 = 总房款 / 房屋面积',
                '总房款 = 价格 + 总费用 + 总税款',
                '总费用 = 中介费 + 贷款费用 + 评估费 + 其他费用',
                '总税款 = 契税 + 个人所得税 + 增值税 + 其他税',
          ]},
          // OriginTaxSum
          11: {title: '关于原税费合计',
              contents: [
                '原税费合计为卖方原购房时的各种税费，可以用于抵扣个人所得税。默认为零。',
          ]},
          // ValueAddedTax_ForShenzhen
          12: {title: '关于增值税',
              contents: [
                '本计算器按照下列方式计算增值税，如果不是此计算方法，请计算并手动输入增值税额。',
                '使用的增值税税率 = 5% / 1.05 = 4.76%',
                '1. 购买不足2年的住房，增值税 = 网签价格 x 增值税税率；',
                '2. 购买2年以上（含2年）的非普通住房，增值税 = （网签价格 - 原值）x 增值税税率；',
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
                '使用的增值税税率 = 5.6% / 1.05 = 5.33%',
                '1. 购买不足2年的住房，增值税 = 网签价格 x 增值税税率；',
                '3. 购买2年以上（含2年）的住房，增值税 = 0。',
          ]},

          // DeedTax_ForTianjin
          15: {title: '关于契税',
              contents: [
                '本计算器按照下列方式计算契税，如果不是此计算方法，请计算并手动输入契税额。',
                '1. 契税率：购买首套住房或者非首套住房，90平米（含）以下1%; 购买首套住房，90平米以上，为1.5%; 购买非首套住房，90平米以上，为2%；',
                '2. 契税 = （网签价 - 增值税）x 契税率。',
          ]},
          // PersonalIncomeTax_Chengdu
          16: {title: '关于个人所得税',
              contents: [
                '本计算器按照下列方式计算个人所得税，如果不是此计算方法，请计算并手动输入个人所得税额。',
                '1. 卖方家庭首套住房，并且购买时间超过5年，免征个人所得税。',
                '2. 其他情况，征收个人所得税。个人所得税 = 网签价格 x 0.01。',
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
                      this.state.mIsShowingTipBoxIdx].title}
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
