import Taro, { Component, Events } from '@tarojs/taro'
import { View, Text, Image, Input, Video, Button, Icon, Progress, Checkbox, Switch, Form, Slider, Picker, PickerView, PickerViewColumn, Swiper, SwiperItem, Navigator } from '@tarojs/components'

import './rhdetail.scss'

import namedPng from '@images/index/1.jpeg'

import { SERVER_HOST } from '../common/const'

import namedVideo from '@res/video/1.mp4'

export default class Rhdetail extends Component {

  constructor(props) {
    super(props)
    this.state = {
      rhId : this.$router.params.rh_id,
      rhRecord : {}
    }
  }

  componentDidMount () {
    Taro.showToast({title: String(this.state.rhId)})
    Taro.request({
      url: SERVER_HOST + '/get_rh_detail?rhid=' + String(this.state.rhId),
      success: (res) => {
        console.log(res.data.record)
        Taro.showToast({title: res.data.record.name})
        this.setState({
            message: 'success',
            rhRecord: res.data.record,
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
    return (
      <View>
        <Video width='150px' height='190px' src={namedVideo} />
        <View className="show-part-text">aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa
        </View>
        <View> aaaaaaaaaaaaaaaaaaaaa </View>
        <View> aaaaaaaaaaaaaaaaaaaaa </View>
        <View> aaaaaaaaaaaaaaaaaaaaa </View>
        <View> aaaaaaaaaaaaaaaaaaaaa </View>
        <View> aaaaaaaaaaaaaaaaaaaaa </View>
        <View> aaaaaaaaaaaaaaaaaaaaa </View>
        <View> aaaaaaaaaaaaaaaaaaaaa </View>
        <Text className="show-part-text">This is some long text that will not fit in the boxThis is some long text that will not fit in the boxThis is some long text that will not fit in the boxThis is some long text that will not fit in the boxThis is some long text that will not fit in the boxThis is some long text that will not fit in the box</Text>
        <View className="show-part-text">
        rh_id: {this.state.rhRecord.id}
        </View>
        <View className="show-part-text">
        id: {this.state.rhRecord.id}
        </View>
        <View className="show-part-text">
        name: {this.state.rhRecord.name}
        </View>
        <View className="show-part-text">
        phone: {this.state.rhRecord.phone}
        </View>
        <View className="show-part-text">
        mobile: {this.state.rhRecord.mobile}
        </View>
        <View className="show-part-text">
        email: {this.state.rhRecord.email}
        </View>
        <View className="show-part-text">
        postcode: {this.state.rhRecord.postcode}
        </View>
        <View className="show-part-text">
        location_id: {this.state.rhRecord.location_id}
        </View>
        <View className="show-part-text">
        type: {this.state.rhRecord.type}
        </View>
        <View className="show-part-text">
        factory_property: {this.state.rhRecord.factory_property}
        </View>
        <View className="show-part-text">
        person_in_charge: {this.state.rhRecord.person_in_charge}
        </View>
        <View className="show-part-text">
        establishment_time: {this.state.rhRecord.establishment_time}
        </View>
        <View className="show-part-text">
        floor_surface: {this.state.rhRecord.floor_surface}
        </View>
        <View className="show-part-text">
        building_area: {this.state.rhRecord.building_area}
        </View>
        <View className="show-part-text">
        bednum: {this.state.rhRecord.bednum}
        </View>
        <View className="show-part-text">
        staff_num: {this.state.rhRecord.staff_num}
        </View>
        <View className="show-part-text">
        for_persons: {this.state.rhRecord.for_persons}
        </View>
        <View className="show-part-text">
        charges_extent: {this.state.rhRecord.charges_extent}
        </View>
        <View className="show-part-text">
        special_services: {this.state.rhRecord.special_services}
        </View>
        <View className="show-part-text">
        contact_person: {this.state.rhRecord.contact_person}
        </View>
        <View className="show-part-text">
        address: {this.state.rhRecord.address}
        </View>
        <View className="show-part-text">
        url: {this.state.rhRecord.url}
        </View>
        <View className="show-part-text">
        transportation: {this.state.rhRecord.transportation}
        </View>
        <View className="show-part-text">
        inst_intro: {this.state.rhRecord.inst_intro}
        </View>
        <View className="show-part-text">
        inst_charge: {this.state.rhRecord.inst_charge}
        </View>
        <View className="show-part-text">
        facilities: {this.state.rhRecord.facilities}
        </View>
        <View className="show-part-text">
        service_content: {this.state.rhRecord.service_content}
        </View>
        <View className="show-part-text">
        inst_notes: {this.state.rhRecord.inst_notes}
        </View>
        <View className="show-part-text">
        ylw_id: {this.state.rhRecord.ylw_id}
        </View>
        <View className="show-part-text">
        province: {this.state.rhRecord.privince}
        </View>
        <View className="show-part-text">
        city: {this.state.rhRecord.city}
        </View>
        <View className="show-part-text">
        area: {this.state.rhRecord.area}
        </View>
        <View className="show-part-text">
        title_image: {this.state.rhRecord.title_image}
        </View>
        <View className="show-part-text">
        images: {this.state.rhRecord.images}
        </View>
        <View className="show-part-text">
        charges_min: {this.state.rhRecord.charges_min}
        </View>
        <View className="show-part-text">
        charges_max: {this.state.rhRecord.charges_max}
        </View>
        <View className="show-part-text">
        bednum_int: {this.state.rhRecord.bednum_int}
        </View>
        <Swiper indicatorColor='#999' indicatorActiveColor='#333'
                circular indicatorDots autoplay>
          <SwiperItem>
            <Image src={namedPng} width="100%" />
          </SwiperItem>
          <SwiperItem>
            <Image src={namedPng} width="100%" />
          </SwiperItem>
          <SwiperItem>
            <Image src={namedPng} width="100%" />
          </SwiperItem>
        </Swiper>
        <View className='title-container'>
          <View>
            <Text className='title-item'> title </Text>
          </View>
          <View>
            <Text> address </Text>
          </View>
        </View>
      </View>
    )
  }
}
