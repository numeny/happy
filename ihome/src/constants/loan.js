export const SetCommercialLoanTotal = 'SetCommercialLoanTotal'
export const SetCommercialLoanMonthlyPayment = 'SetCommercialLoanMonthlyPayment'

export const SetProvidentFundLoanTotal = 'SetProvidentFundLoanTotal'
export const SetProvidentFundLoanMonthlyPayment = 'SetProvidentFundLoanMonthlyPayment'

export const SetOtherLoanTotal = 'SetOtherLoanTotal'
export const SetOtherLoanMonthlyPayment = 'SetOtherLoanMonthlyPayment'

export const SetAllLoanTotal = 'SetAllLoanTotal'
export const SetAllLoanMonthlyPayment = 'SetAllLoanMonthlyPayment'

export const LoanDataType {
  CommercialLoanTotal: 0,
  CommercialLoanMonthlyPayment: 1,

  ProvidentFundLoanTotal: 2,
  ProvidentFundLoanMonthlyPayment: 3,

  OtherLoanTotal: 4,
  OtherLoanMonthlyPayment: 5,

  AllLoanTotal: 6,
  AllLoanMonthlyPayment: 7,

  RadioValueCommercialLoanPaymentMethod: 8,
  RadioValueProvidentFundLoanPaymentMethod: 9,
  RadioValueOtherLoanPaymentMethod: 10,

  DurationCommercialLoan: 11,
  DurationProvidentFundLoan: 12,
  DurationOtherLoan: 13,

  RateCommercialLoan: 14,
  RateProvidentFundLoan: 15,
  RateOtherLoan: 16,

  // bool
  RateInputManualCommercialLoan: 17,
  RateInputManualProvidentFundLoan: 18,
  RateInputManualOtherLoan: 19,

  RateDiscountIdxCommercialLoan: 20,
  RateDiscountIdxProvidentFundLoan: 21,
  RateDiscountIdxOtherLoan: 22,

  LoanDataTypeMax: 23,
}
