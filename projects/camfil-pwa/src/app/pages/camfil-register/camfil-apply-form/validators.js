export const APPLY_VALIDATORS = {
  zipCode: [
    {
      error: 'required',
      message: 'camfil.account.apply_form.zipCode.error.required',
    },
    {
      error: 'pattern',
      message: 'camfil.account.apply_form.zipCode.error.pattern',
    },
    {
      error: 'incorrect',
      message: 'camfil.account.apply_form.zipCode.error.invalid',
    },
  ],
};
