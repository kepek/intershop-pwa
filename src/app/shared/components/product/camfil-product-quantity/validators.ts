import { CamfilErrorValidator } from 'camfil-pwa/models/camfil-error-valdiator/camfil-error-valdiator.model';

export const ADD_NEW_PRODUCT_VALIDATORS: { [key: string]: CamfilErrorValidator[] } = {
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
    {
      error: 'stepQuantityValue',
      message: 'camfil.modal.addNewProduct.validation.error.step.quantity',
      messageVariables: [],
    },
  ],
};
