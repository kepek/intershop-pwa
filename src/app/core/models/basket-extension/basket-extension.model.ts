import { BasketExtensionData } from './basket-extension.interface';

export interface BasketExtensionGuestForm {
  userDetailsFormGroup: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    siret: string;
    companyName: string;
    jobTitle: string;
    vat: string;
  };
  deliveryInfoFromGroup: {
    boxLabel: string;
    invoiceMark: string;
    deliveryInfo: string;
    customerNote: string;
    streetAddress: string;
    zipCode: string;
    city: string;
    country: string;
    sameAddressAsInvoice: boolean;
  };
  invoiceAddressFormGroup: {
    streetAddress: string;
    zipCode: string;
    city: string;
    country: string;
  };
}

export interface BasketExtensionGuestFormAddress {
  streetAddress: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface BasketExtension extends Omit<BasketExtensionData, 'anonymousBasketData'> {
  guestBasket?: BasketExtensionGuestForm;
}
