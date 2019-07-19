import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import './rhdetail.scss'

import namedVideo from '@res/video/1.mp4'
import { SERVER_HOST } from '../common/const'
import { DEFAULT_IMG } from '../common/const'
import { IMGS_ROOT_PATH } from '../common/const'
import { NUM_TRANSFORM_RH_ID } from '../common/const'

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
    this.handleContent(res.data.record.inst_intro, rhRecordHandled_2.inst_intro_handled)
    this.handleContent(res.data.record.special_services, rhRecordHandled_2.special_services_handled)
    this.handleContent(res.data.record.facilities, rhRecordHandled_2.facilities_handled)
    this.handleContent(res.data.record.service_content, rhRecordHandled_2.service_content_handled)
    this.handleContent(res.data.record.inst_notes, rhRecordHandled_2.inst_notes_handled)



    this.handleImages(res.data.record.images, rhRecordHandled_2.images_handled)

    // handle title image
    res.data.record.title_image = res.data.record.title_image != "" ? res.data.record.title_image : DEFAULT_IMG;

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
    let inst_charge_handled_tmp = []
    content = content.replace(/<\/b>/g, "")
    content = content.replace(/<\/strong>/g, "")
    // FIXME, delete image first
    content = content.replace(/<img.*>/g, "")

    inst_charge_handled_tmp = String(content).split("</p>")
    if (inst_charge_handled_tmp.length == 1 && inst_charge_handled_tmp[0] == "") {
      inst_charge_handled_tmp.pop()
    }
    inst_charge_handled_tmp.forEach(
        function(value, index, array) {
          var class_style = "";
          if (value.indexOf("<p style=\"text-indent:2em\"><strong>") >= 0
              || value.indexOf("<p style=\"text-indent:2em\"><b>") >=0) {
            class_style = "bold_font_two_space"
          } else if (value.indexOf("<p style=\"text-indent:2em\">") >= 0) {
            class_style = "two_space"
          } else if (value.indexOf("<p align=\"center\">") >= 0) {
            class_style = "text_center"
          }
          inst_charge_handled_tmp[index] = inst_charge_handled_tmp[index].replace(/<p style=\"text-indent:2em\">/g, "")
          inst_charge_handled_tmp[index] = inst_charge_handled_tmp[index].replace(/<p>/g, "")
          inst_charge_handled_tmp[index] = inst_charge_handled_tmp[index].replace(/<b>/g, "")
          inst_charge_handled_tmp[index] = inst_charge_handled_tmp[index].replace(/<strong>/g, "")
          inst_charge_handled_tmp[index] = inst_charge_handled_tmp[index].replace(/<p align=\"center\">/g, "")
          content_handled.push([inst_charge_handled_tmp[index], class_style])
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

    return (
      <View className="top-view">
        <Video width='150px' height='190px' src={namedVideo} />
        <Image src={DEFAULT_IMG} width="100%" />
        <Swiper indicatorColor='#999' indicatorActiveColor='#333'
                circular indicatorDots autoplay>
          <SwiperItem>
            <Image src={this.state.rhRecord.title_image} width="100%" />
          </SwiperItem>
          <SwiperItem>
            <Image src={this.state.rhRecord.title_image} width="100%" />
          </SwiperItem>
          <SwiperItem>
            <Image src={this.state.rhRecord.title_image} width="100%" />
          </SwiperItem>
        </Swiper>
        <Text className="show-part-text-1">This is some long text that will not fit in the boxThis is some long text that will not fit in the boxThis is some long text that will not fit in the boxThis is some long text that will not fit in the boxThis is some long text that will not fit in the boxThis is some long text that will not fit in the box</Text>
        <View className="show-part-text">
          rh_id: {this.state.rhRecord.id}
        </View>
        <View className="show-part-text">
          id: {this.state.rhRecord.id}
        </View>
        <View className="show-part-text">
          name: {this.state.rhRecord.name}
        </View>
        {this.state.rhRecord.phone != "" &&
        <View className="show-part-text">
          phone: {this.state.rhRecord.phone}
        </View>}
        {this.state.rhRecord.mobile != "" &&
        <View className="show-part-text">
          mobile: {this.state.rhRecord.mobile}
        </View>}
        {this.state.rhRecord.email != "" &&
        <View className="show-part-text">
          email: {this.state.rhRecord.email}
        </View>}
        {this.state.rhRecord.postcode != "" &&
        <View className="show-part-text">
          postcode: {this.state.rhRecord.postcode}
        </View>}
        {this.state.rhRecord.location_id != "" &&
        <View className="show-part-text">
          location_id: {this.state.rhRecord.location_id}
        </View>}
        {this.state.rhRecord.type != "" &&
        <View className="show-part-text">
          type: {this.state.rhRecord.type}
        </View>}
        {this.state.rhRecord.factory_property != "" &&
        <View className="show-part-text">
          factory_property: {this.state.rhRecord.factory_property}
        </View>}
        {this.state.rhRecord.person_in_charge != "" &&
        <View className="show-part-text">
          person_in_charge: {this.state.rhRecord.person_in_charge}
        </View>}
        {this.state.rhRecord.establishment_time != "" &&
        <View className="show-part-text">
          establishment_time: {this.state.rhRecord.establishment_time}
        </View>}
        {this.state.rhRecord.floor_surface != "" &&
        <View className="show-part-text">
          floor_surface: {this.state.rhRecord.floor_surface}
        </View>}
        {this.state.rhRecord.building_area != "" &&
        <View className="show-part-text">
          building_area: {this.state.rhRecord.building_area}
        </View>}
        {this.state.rhRecord.bednum != "" &&
        <View className="show-part-text">
          bednum: {this.state.rhRecord.bednum}
        </View>}
        {this.state.rhRecord.staff_num != "" &&
        <View className="show-part-text">
          staff_num: {this.state.rhRecord.staff_num}
        </View>}
        {this.state.rhRecord.for_persons != "" &&
        <View className="show-part-text">
          for_persons: {this.state.rhRecord.for_persons}
        </View>}
        {this.state.rhRecord.charges_extent != "" &&
        <View className="show-part-text">
          charges_extent: {this.state.rhRecord.charges_extent}
        </View>}
        {this.state.rhRecordHandled.special_services_handled.length > 0 &&
        <View className="show-part-text">
          special_services_1: {special_services_handled}
        </View>}
        {this.state.rhRecord.contact_person != "" &&
        <View className="show-part-text">
          contact_person: {this.state.rhRecord.contact_person}
        </View>}
        {this.state.rhRecord.address != "" &&
        <View className="show-part-text">
          address: {this.state.rhRecord.address}
        </View>}
        {this.state.rhRecord.url != "" &&
        <View className="show-part-text">
          url: {this.state.rhRecord.url}
        </View>}
        {this.state.rhRecordHandled.transportation_handled.length > 0 &&
        <View className="show-part-text">
          transportation_1: {transportation_handled}
        </View>}
        {this.state.rhRecordHandled.inst_intro_handled.length > 0 &&
        <View className="show-part-text">
          inst_intro_1: {inst_intro_handled}
        </View>}
        {this.state.rhRecordHandled.inst_charge_handled.length > 0 &&
        <View className="show-part-text">
          inst_charge_1: { inst_charge_handled }
        </View>}
        {this.state.rhRecordHandled.facilities_handled.length > 0 &&
        <View className="show-part-text">
          facilities_1: {facilities_handled}
        </View>}
        {this.state.rhRecordHandled.service_content_handled.length > 0 &&
        <View className="show-part-text">
          service_content_1: {service_content_handled}
        </View>}
        {this.state.rhRecordHandled.inst_notes_handled.length > 0 &&
        <View className="show-part-text">
          inst_notes_1: {inst_notes_handled}
        </View>}
        {this.state.rhRecord.ylw_id != "" &&
        <View className="show-part-text">
          ylw_id: {this.state.rhRecord.ylw_id}
        </View>}
        {this.state.rhRecord.privince != "" &&
        <View className="show-part-text">
          province: {this.state.rhRecord.privince}
        </View>}
        {this.state.rhRecord.city != "" &&
        <View className="show-part-text">
          city: {this.state.rhRecord.city}
        </View>}
        {this.state.rhRecord.area != "" &&
        <View className="show-part-text">
          area: {this.state.rhRecord.area}
        </View>}
        {this.state.rhRecord.images != "" &&
        <View className="show-part-text">
          images: {this.state.rhRecord.images}
        </View>}
        {this.state.rhRecord.charges_min != "" &&
        <View className="show-part-text">
          charges_min: {this.state.rhRecord.charges_min}
        </View>}
        {this.state.rhRecord.charges_max != "" &&
        <View className="show-part-text">
          charges_max: {this.state.rhRecord.charges_max}
        </View>}
        {this.state.rhRecord.bednum_int != "" &&
        <View className="show-part-text">
          bednum_int: {this.state.rhRecord.bednum_int}
        </View>}
        {images_handled != "" &&
        <View className="show-part-text">
          images_handled: {images_handled}
        </View>}
      </View>
    )
  }
}
