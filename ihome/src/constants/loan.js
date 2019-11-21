import Taro from '@tarojs/taro';

export const DefaultValue = {
  LoanDuration: 20,

  BaseInterestRateCommercialLoan: 4.8,
  BaseInterestRateProvidentFundLoan: 3.25,
  BaseInterestRateOtherLoan: 4.8,
}

export const DefaultRateDiscountIdx = {
  CommercialLoan: 3,
  ProvidentFundLoan: 0,
  OtherLoan: 3,
}

export const LoanType = {
  CommercialLoan: 0,
  ProvidentFundLoan: 1,
  OtherLoan: 2,
}

export const RepaymentType = {
  CapitalAndInterest: 0,
  Capital: 1,
}
