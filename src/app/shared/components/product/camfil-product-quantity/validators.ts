export const ADD_NEW_PRODUCT_VALIDATORS = {
  sku: [
    {
      error: 'required',
      message: 'camfil.modal.addNewProduct.error.required.sku',
    },
  ],
  quantity: [
    {
      error: 'min',
      message: 'camfil.modal.addNewProduct.error.min.quantity',
    },
    {
      error: 'max',
      message: 'camfil.modal.addNewProduct.error.max.quantity',
    },
  ],
};
