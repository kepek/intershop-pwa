export const CREATE_CAMCARD_VALIDATORS = {
  name: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.name.error.required',
    },
    {
      error: 'maxlength',
      message: 'camfil.modal.createCamcard.input.name.error.maxlength',
    },
  ],
  orderMark: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.order_mark.error.required',
    },
  ],
  invoiceMark: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.invoice_mark.error.required',
    },
    {
      error: 'maxlength',
      message: 'camfil.checkout.order_header.invoice_label.error.maxLength',
    },
  ],
  company: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.company.error.required',
    },
  ],
  addressLine1: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.addressLine1.error.required',
    },
  ],
  zipCode: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.zip_code.error.required',
    },
    {
      error: 'pattern',
      message: 'camfil.modal.createCamcard.input.zip_code.error.format',
    },
  ],
  area: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.area.error.required',
    },
  ],
  countryCode: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.countryCode.error.required',
    },
  ],
  newCamCard: [
    {
      error: 'maxlength',
      message: 'camfil.modal.createCamcard.input.new_subcamcard.error.maxLength',
    },
  ],
};
