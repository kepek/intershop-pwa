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
  ],
  company: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.company.error.required',
    },
  ],
  address: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.address.error.required',
    },
  ],
  zipCode: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.zip_code.error.required',
    },
    {
      error: 'pattern',
      message: 'camfil.modal.createCamcard.input.zip_code',
    },
  ],
  area: [
    {
      error: 'required',
      message: 'camfil.modal.createCamcard.input.area.error.required',
    },
  ],
  newCamCard: [
    {
      error: 'maxlength',
      message: 'camfil.modal.createCamcard.input.new_subcamcard.error.maxLength',
    },
  ],
};
