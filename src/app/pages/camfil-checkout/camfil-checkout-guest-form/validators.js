export const GUEST_FORM_VALIDATORS = {
  // Validators for User details form
  firstName: [
    {
      error: 'required',
      message: 'camfil.account.organization.user_details.form.first_name.error.required',
    },
    {
      error: 'maxlength',
      message: 'camfil.account.organization.user_details.form.first_name.error.maxLength',
    },
  ],
  lastName: [
    {
      error: 'required',
      message: 'camfil.account.organization.user_details.form.last_name.error.required',
    },
    {
      error: 'maxlength',
      message:
        'camfil.account.organization.user_details.form.first_name.error.maxLengthcamfil.account.organization.user_details.form.last_name.error.maxLength',
    },
  ],
  email: [
    {
      error: 'required',
      message: 'camfil.account.organization.user_details.form.email.error.required',
    },
    {
      error: 'email',
      message: 'camfil.account.organization.user_details.form.email.error.email',
    },
  ],
  phone: [
    {
      error: 'required',
      message: 'camfil.modal.createOrder.order-form.input.phone_number.error.required',
    },
  ],
  siret: [
    {
      error: 'required',
      message: 'camfil.modal.createOrder.order-form.input.siret.error.required',
    },
    {
      error: 'pattern',
      message: 'camfil.modal.createOrder.order-form.input.siret.error.pattern',
    },
  ],
  // Validators for Delivery form
  streetAddress: [
    {
      error: 'required',
      message: 'camfil.modal.createOrder.order-form.input.street_address.error.required',
    },
  ],
  zipCode: [
    {
      error: 'required',
      message: 'camfil.guest-form.input.zip_code.errror.required',
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
  city: [
    {
      error: 'required',
      message: 'camfil.guest-form.input.city.errror.required',
    },
  ],
  country: [
    {
      error: 'required',
      message: 'camfil.guest-form.input.country.errror.required',
    },
  ],
};
