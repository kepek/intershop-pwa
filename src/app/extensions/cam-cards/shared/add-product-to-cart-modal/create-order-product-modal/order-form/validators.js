export const ADDRESS_VALIDATORS = {
  customer: [
    {
      error: 'required',
      message: 'camfil.modal.createOrder.order-form.select.customer.error.required',
    },
  ],
  contact: [
    {
      error: 'required',
      message: 'camfil.modal.createOrder.order-form.select.contact_person.error.required',
    },
  ],
  phoneNumber: [
    {
      error: 'pattern',
      message: 'camfil.modal.createOrder.order-form.input.phone_number.error.pattern',
    },
    {
      error: 'maxlength',
      message: 'camfil.modal.createOrder.order-form.input.phone_number.error.pattern',
    },
  ],
  orderMark: [
    {
      error: 'maxlength',
      message: 'camfil.modal.createOrder.order-form.input.order_mark.error.maxLength',
    },
  ],
  invoiceLabel: [
    {
      error: 'maxlength',
      message: 'camfil.modal.createOrder.order-form.input.invoice_mark.error.maxLength',
    },
  ],
  company: [
    {
      error: 'required',
      message: 'camfil.modal.createOrder.order-form.input.company.error.required',
    },
  ],
  addressLine1: [
    {
      error: 'required',
      message: 'camfil.modal.createOrder.order-form.input.addressLine1.error.required',
    },
  ],
  zipCode: [
    {
      error: 'required',
      message: 'camfil.modal.createOrder.order-form.input.zipcode.error.required',
    },
    {
      error: 'pattern',
      message: 'camfil.modal.createOrder.order-form.input.zipcode.error.pattern',
    },
    {
      error: 'incorrect',
      message: 'camfil.address_form.post_code.invalid',
    },
  ],
  area: [
    {
      error: 'required',
      message: 'camfil.modal.createOrder.order-form.input.area.error.required',
    },
  ],
  info: [
    {
      error: 'maxlength',
      message: 'camfil.modal.createOrder.order-form.textarea.info.error.maxLength',
    },
  ],
};
