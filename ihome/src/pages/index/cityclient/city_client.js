import Taro from '@tarojs/taro'
import { Util } from '@util/util'

export function CityClient(state) {

  CityClient.prototype.mState = state

  CityClient.prototype.setClientState = function(state) {
    this.mState = state
    console.error('CityClient.prototype.setClientState: '
        + state + ", this.mState: " + this.mState
        );
  }

  CityClient.prototype.getDeedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.DeedTax;
  }

  CityClient.prototype.getDeedTaxRate = function() {
    return 0;
  }

  CityClient.prototype.getDeedTax = function() {
    return 0;
  }

  CityClient.prototype.getPersonalIncomeTaxHelpIndex = function() {
    return Util.mTipBoxMessages.PersonalIncomeTax;
  }

  CityClient.prototype.getPersonalIncomeTax = function() {
    return 0;
  }

  CityClient.prototype.getValueAddedTaxHelpIndex = function() {
    return Util.mTipBoxMessages.ValueAddedTax;
  }

  CityClient.prototype.getValueAddedTaxRate = function() {
    return 0;
  }

  CityClient.prototype.getValueAddedTax = function() {
    return 0;
  }
}

export let sCityClient = new CityClient()
