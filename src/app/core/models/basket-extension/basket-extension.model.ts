import { BasketExtensionData } from './basket-extension.interface';

export interface BasketExtensionGuestForm {
  userDetailsFormGroup: {
    firstName: string;
    lastName: string;
    email: string;
    phoneHome: string;
    siret: string;
    companyName1: string;
    jobTitle: string;
    vat: string;
  };
  deliveryInfoFromGroup: {
    boxLabel: string;
    invoiceMark: string;
    deliveryInfo: string;
    customerNote: string;
    addressLine1: string;
    postalCode: string;
    city: string;
    countryCode: string;
    sameAddressAsInvoice: boolean;
  };
  invoiceAddressFormGroup: {
    addressLine1: string;
    postalCode: string;
    city: string;
    countryCode: string;
  };
}

export interface BasketExtensionGuestFormAddress {
  addressLine1: string;
  postalCode: string;
  city: string;
  countryCode: string;
}

export interface BasketExtension extends Omit<BasketExtensionData, 'anonymousBasketData'> {
  guestBasket?: BasketExtensionGuestForm;
}
