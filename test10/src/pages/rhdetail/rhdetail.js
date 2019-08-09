import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator, ScrollView } from '@tarojs/components'

import './rhdetail.scss'

import namedVideo from '@res/video/1.mp4'
import namedPng from '@images/index/1.jpeg'
import { SERVER_HOST, DEFAULT_IMG, IMGS_ROOT_PATH, NUM_TRANSFORM_RH_ID } from '../common/const'

import FixedTitle from '../common/fixedtitle'
import PageFooter from '../common/pagefooter'

export default class Rhdetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      rhId : this.$router.params.rh_id,
      rhRecord : {},
      rhRecordHandled: {
        inst_charge_handled: [],
        transportation_handled: [],
        inst_intro_handled: [],
        special_services_handled: [],
        facilities_handled: [],
        service_content_handled: [],
        inst_notes_handled: [],
        images_handled: [],
      },

      // about to-top button
      windowHeight: Taro.getSystemInfoSync().windowHeight,
      showIconOfToTop: false,
      scrollTop: 0,
    }
  }

  handleAllContent = (res) => {
    var rhRecordHandled_2 = {
      inst_charge_handled: [],
      transportation_handled: [],
      inst_intro_handled: [],
      special_services_handled: [],
      facilities_handled: [],
      service_content_handled: [],
      inst_notes_handled: [],
      images_handled: [],
    }
    this.handleContent(res.data.record.inst_charge, rhRecordHandled_2.inst_charge_handled)
    this.handleContent(res.data.record.transportation, rhRecordHandled_2.transportation_handled)
    // console.error("1111111- inst_intro_handled: " + res.data.record.inst_intro);
    this.handleContent(res.data.record.inst_intro, rhRecordHandled_2.inst_intro_handled)
    // console.error("2222222- inst_intro_handled: " + rhRecordHandled_2.inst_intro_handled);
    this.handleContent(res.data.record.special_services, rhRecordHandled_2.special_services_handled)
    this.handleContent(res.data.record.facilities, rhRecordHandled_2.facilities_handled)
    this.handleContent(res.data.record.service_content, rhRecordHandled_2.service_content_handled)
    this.handleContent(res.data.record.inst_notes, rhRecordHandled_2.inst_notes_handled)

    this.handleImages(res.data.record.images, rhRecordHandled_2.images_handled)

    // handle title image
    res.data.record.title_image = res.data.record.title_image.length > 0 ? res.data.record.title_image : DEFAULT_IMG
    return rhRecordHandled_2
  }

  handleImages = (images, images_handled) => {
    let images_handled_tmp = String(images).split(",")

    try {
      const rhId = parseInt(this.state.rhId) - NUM_TRANSFORM_RH_ID
      images_handled_tmp.forEach(
          function(value, index, array) {
          if (value != "") {
              images_handled.push(IMGS_ROOT_PATH + "/" + rhId + "/" + value)
          }
      })
    } catch(err) {
    }
  }

  handleContent = (content, content_handled) => {
    let content_handled_tmp = []
    content = content.replace(/<\/b>/g, "")
    content = content.replace(/<\/strong>/g, "")
    // FIXME, delete image first
    content = content.replace(/<img.*>/g, "")

    // content_handled_tmp = String(content).split(/< *\/p *>|<br *>|< *\/div *>/)
    // </tr> -- yh id = 10016299
    content_handled_tmp = String(content).split(/< *\/p *>|<br *>|< *\/div *>|< *\/tr *>/)
    if (content_handled_tmp.length == 1 && content_handled_tmp[0] == "") {
      content_handled_tmp.pop()
    }
    content_handled_tmp.forEach(
        function(value, index, array) {
          var class_style = "";
          var text_intent_2_regex = /< *p|span *style *= *\" *text-indent *: *2em;* *\" *>/
          if (value.indexOf("<p style=\"text-indent:2em\"><strong>") >= 0
              || value.indexOf("<p style=\"text-indent:2em\"><b>") >=0) {
            class_style = "bold_font_two_space"
          } else if (text_intent_2_regex.test(value)
              /*value.indexOf("<p style=\"text-indent:2em\">") >= 0 || value.indexOf("<p style=\"text-indent:2em;\">") >= 0
                || value.indexOf("<p style=\"text-indent: 2em;\">") >= 0*/) {
            class_style = "two_space"
          } else if (value.indexOf("<p align=\"center\">") >= 0) {
            class_style = "text_center"
          }
          content_handled_tmp[index] = content_handled_tmp[index].replace(/< *p *style *= *\" *text-indent *: *2em;* *\" *>/g, "") // text_intent_2_regex
          // text_intent_2_regex
          content_handled_tmp[index] = content_handled_tmp[index].replace(/< *span *style *= *\" *text-indent *: *2em;* *\" *>/g, "") // yh id = 10016431

          // yh id = 10015395, <p class="p0" ...>
          content_handled_tmp[index] = content_handled_tmp[index].replace(/< *p.*>/g, "")
          // FIXME
          // content_handled_tmp[index] = content_handled_tmp[index].replace(/<.*>/g, "")
          content_handled_tmp[index] = content_handled_tmp[index].replace(/<b>/g, "")
          content_handled_tmp[index] = content_handled_tmp[index].replace(/<div>/g, "")
          content_handled_tmp[index] = content_handled_tmp[index].replace(/<strong>/g, "")
          content_handled_tmp[index] = content_handled_tmp[index].replace(/<\/span>/g, "") // yl id=10016431 inst_charge_handled
          content_handled_tmp[index] = content_handled_tmp[index].replace(/<p align=\"center\">/g, "")
          if (content_handled_tmp[index].length > 0) { // content is null
            content_handled.push([content_handled_tmp[index], class_style])
          }
          // console.info("content-2-4-0: content_handled: " + class_style)
          // console.info("content-2-4-0-1: content_handled: " + content_handled[index])
    })
  }

  componentDidMount () {
    Taro.showToast({title: String(this.state.rhId)})
    Taro.request({
      url: SERVER_HOST + '/get_rh_detail?rhid=' + String(this.state.rhId),
      success: (res) => {
        console.log(res.data.record)
        Taro.showToast({title: res.data.record.name})

        var rhRecordHandled = this.handleAllContent(res)

        this.setState({
            message: 'success',
            rhRecord: res.data.record,
            rhRecordHandled: rhRecordHandled,
        })
      },
      fail: (error) => {
        console.error('bdg-error')
        Taro.showToast({title: 'fail'})
      },
      complete: () => {
        // Taro.showToast({title: "complete"})
      },
    })//.then(res => Taro.showToast({title: "1111"}))
  }

  makePhoneCall (phoneNum, e) {
    let phone = String(phoneNum).split("/")
    if (phone.length > 0) {
      Taro.makePhoneCall({
          phoneNumber: phone[0],
      })
    }
  }

  openWebsite (url, e) {
    Taro.navigateTo({
      url: '/pages/common/mywebview?url=' + url,
    })
  }

  scrollToTop = (e) => {
    this.setState({
      scrollTop: 0,
    })
    console.log('scrollToTop-2')
  }

  onScroll = e => {
    this.setState({
      showIconOfToTop: e.detail.scrollTop > this.state.windowHeight * 2,
      scrollTop: e.detail.scrollTop, // remain this scrollTop
    })
  }

  render () {
    const transportation_handled = (
        <View>
          { this.state.rhRecordHandled.transportation_handled.map((par) =>
              <View className={par[1]}>
                {par[0]}
              </View>
            )
          }
        </View>
        )
    const inst_intro_handled = (
        <View>
          { this.state.rhRecordHandled.inst_intro_handled.map((par) =>
              <View className={par[1]}>
                {par[0]}
              </View>
            )
          }
        </View>
        )
    const inst_charge_handled = (
        <View>
          { this.state.rhRecordHandled.inst_charge_handled.map((par) =>
              <View className={par[1]}>
                {par[0]}
              </View>
            )
          }
        </View>
        )
    const special_services_handled = (
        <View>
          { this.state.rhRecordHandled.special_services_handled.map((par) =>
              <View className={par[1]}>
                {par[0]}
              </View>
            )
          }
        </View>
        )
    const facilities_handled = (
        <View>
          { this.state.rhRecordHandled.facilities_handled.map((par) =>
              <View className={par[1]}>
                {par[0]}
              </View>
            )
          }
        </View>
        )
    const service_content_handled = (
        <View>
          { this.state.rhRecordHandled.service_content_handled.map((par) =>
              <View className={par[1]}>
                {par[0]}
              </View>
            )
          }
        </View>
        )
    const inst_notes_handled = (
        <View>
          { this.state.rhRecordHandled.inst_notes_handled.map((par) =>
              <View className={par[1]}>
                {par[0]}
              </View>
            )
          }
        </View>
        )

    const images_handled = (
        <View>
          { this.state.rhRecordHandled.images_handled.map((image) =>
              <View>
                <Image src={image} width="100%" />
              </View>
            )
          }
        </View>
        )

    const images_swiper = (
        <Swiper indicatorColor='#999' indicatorActiveColor='#333'
                indicatorDots autoplay className="swiper-view">
          <SwiperItem className="swiper-view-item">
            <Image src={this.state.rhRecord.title_image} />
          </SwiperItem>
          { this.state.rhRecordHandled.images_handled.map((image) =>
              <SwiperItem className="swiper-view-item">
                <Image src={image} />
              </SwiperItem>
            )
          }
        </Swiper>
        )

    const scrollStyle = {
      height: this.state.windowHeight,
    }

    return (
      <ScrollView scrollY scrollTop={this.state.scrollTop} style={scrollStyle} onScroll={this.onScroll.bind(this)}>
      <Video width='150px' height='190px' src={namedVideo} />
      <Image src={namedPng} />
      <FixedTitle title="养老院详情" />
      <View className="rhdetail-top-view-1">
        {images_swiper}
        <View className="rh-name">
        {this.state.rhRecord.name}
        </View>
        <View className="important-container">
          <View className="important-item">
            {this.state.rhRecord.charges_extent != "" ?
              <View className="important-item-content">{this.state.rhRecord.charges_extent}</View> : <View> -- </View>
            }
            <View className="important-item-label">价格</View>
          </View>
          <View className="important-item-1">
            {this.state.rhRecord.bednum != "" ?
              <View className="important-item-content">{this.state.rhRecord.bednum}张</View> : <View> -- </View>
            }
            <View className="important-item-label">床位数</View>
          </View>
          <View className="important-item">
            {this.state.rhRecord.factory_property != "" ?
              <View className="important-item-content"> {this.state.rhRecord.factory_property}</View> : <View> -- </View>
            }
            <View className="important-item-label">性质</View>
          </View>
        </View>
        <View className="brief-info">
          <View className="content-title">
            基本信息
          </View>
          <View className="brief-info-content">
            {this.state.rhRecord.ylw_id != "" &&
            <View className="show-part-text">
              ylw_id: {this.state.rhRecord.ylw_id}
            </View>}
            <View className="show-part-text">
              id: {this.state.rhRecord.id}
            </View>
            {this.state.rhRecord.location_id != "" &&
            <View className="show-part-text">
              位置： {this.state.rhRecord.location_id}
            </View>}
            {this.state.rhRecord.phone != "" &&
            <View className="show-part-text" onClick={this.makePhoneCall.bind(this, this.state.rhRecord.phone)}>
              电话： <Text className="info-underline">{this.state.rhRecord.phone}</Text>
            </View>}
            {this.state.rhRecord.type != "" &&
            <View className="show-part-text">
              类型： {this.state.rhRecord.type}
            </View>}
            {this.state.rhRecord.factory_property != "" &&
            <View className="show-part-text">
              性质： {this.state.rhRecord.factory_property}
            </View>}
            {this.state.rhRecord.charges_extent != "" &&
            <View className="show-part-text">
              收费范围： {this.state.rhRecord.charges_extent}
            </View>}
            {this.state.rhRecord.establishment_time != "" &&
            <View className="show-part-text">
              建成时间： {this.state.rhRecord.establishment_time}
            </View>}
            {this.state.rhRecord.floor_surface != "" &&
            <View className="show-part-text">
              占地面积： {this.state.rhRecord.floor_surface}
            </View>}
            {this.state.rhRecord.building_area != "" &&
            <View className="show-part-text">
              建筑面积： {this.state.rhRecord.building_area}
            </View>}
            {this.state.rhRecord.staff_num != "" &&
            <View className="show-part-text">
              员工数： {this.state.rhRecord.staff_num}
            </View>}
            {this.state.rhRecord.bednum_int != "" &&
            <View className="show-part-text">
              床位数： {this.state.rhRecord.bednum_int}
            </View>}
            {this.state.rhRecord.for_persons != "" &&
            <View className="show-part-text">
              服务人群： {this.state.rhRecord.for_persons}
            </View>}
            {this.state.rhRecord.contact_person != "" &&
            <View className="show-part-text">
              联系人： {this.state.rhRecord.contact_person}
            </View>}
            {this.state.rhRecord.mobile != "" &&
            <View className="show-part-text" onClick={this.makePhoneCall.bind(this, this.state.rhRecord.mobile)}>
              手机： <Text className="info-underline">{this.state.rhRecord.mobile}</Text>
            </View>}
            {this.state.rhRecord.email != "" &&
            <View className="show-part-text">
              E-Mail： {this.state.rhRecord.email}
            </View>}
            {this.state.rhRecord.person_in_charge != "" &&
            <View className="show-part-text">
              负责人： {this.state.rhRecord.person_in_charge}
            </View>}
            {this.state.rhRecord.address != "" &&
            <View className="rh-address">
              地址：{this.state.rhRecord.address}
            </View>}
            {this.state.rhRecord.postcode != "" &&
            <View className="show-part-text">
              邮编： {this.state.rhRecord.postcode}
            </View>}
            {this.state.rhRecord.url != "" &&
            <View className="show-part-text" onClick={this.openWebsite.bind(this, this.state.rhRecord.url)}>
              网址： <Text className="info-underline">{this.state.rhRecord.url}</Text>
            </View>}
          </View>
        </View>
        {this.state.rhRecordHandled.special_services_handled.length > 0 &&
        <View>
          <View className="content-title">特殊服务</View>
          <View className="content-info">{special_services_handled}</View>
        </View>}
        {this.state.rhRecordHandled.inst_intro_handled.length > 0 &&
        <View>
          <View className="content-title">机构介绍</View>
          <View className="content-info">{inst_intro_handled}</View>
        </View>}
        {this.state.rhRecordHandled.inst_charge_handled.length > 0 &&
        <View>
          <View className="content-title">收费详情</View>
          <View className="content-info">{inst_charge_handled}</View>
        </View>}
        {this.state.rhRecordHandled.facilities_handled.length > 0 &&
        <View>
          <View className="content-title">环境设施</View>
          <View className="content-info">{facilities_handled}</View>
        </View>}
        {this.state.rhRecordHandled.service_content_handled.length > 0 &&
        <View>
          <View className="content-title">服务内容</View>
          <View className="content-info">{service_content_handled}</View>
        </View>}
        {this.state.rhRecordHandled.inst_notes_handled.length > 0 &&
        <View>
          <View className="content-title">入住须知</View>
          <View className="content-info">{inst_notes_handled}</View>
        </View>}
        {this.state.rhRecordHandled.transportation_handled.length > 0 &&
        <View>
          <View className="content-title">交通信息</View>
          <View className="content-info">{transportation_handled}</View>
        </View>}
        {this.state.rhRecordHandled.images_handled.length > 0 &&
        <View>
          <View className="content-title">图片信息</View>
          <View className="images-handled">{images_handled}</View>
        </View>}
      </View>
      <PageFooter />
      {this.state.showIconOfToTop &&
      <View onClick={this.scrollToTop} className='fixed-to-top'>
          <View className='at-icon at-icon-chevron-up'>
          </View>
      </View>}
      </ScrollView>
    )
  }
}
