export const ORDER_HEADER_VALIDATORS = {
  orderMark: [
    {
      error: 'required',
      message: 'camfil.checkout.order_header.order_mark.error.required',
    },
    {
      error: 'maxlength',
      message: 'camfil.checkout.order_header.order_mark.error.maxLength',
    },
  ],
  invoiceLabel: [
    {
      error: 'required',
      message: 'camfil.checkout.order_header.invoice_label.error.required',
    },
    {
      error: 'maxlength',
      message: 'camfil.checkout.order_header.invoice_label.error.maxLength',
    },
  ],
  info: [
    {
      error: 'maxlength',
      message: 'camfil.checkout.order_header.note.error.maxLength',
    },
  ],
  emailRecipients: [
    {
      error: 'email',
      message: 'Please provide a valid email address',
    },
  ],
};
