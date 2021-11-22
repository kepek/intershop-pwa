import { BasketExtensionData, BasketExtensionGuestData } from './basket-extension.interface';
import { BasketExtension, BasketExtensionGuestForm, BasketExtensionGuestFormAddress } from './basket-extension.model';

export class BasketExtensionMapper {
  static fromData(data: BasketExtensionData): BasketExtension {
    if (!data) {
      throw new Error(`'basketExtensionData' is required for the mapping`);
    }

    const { anonymousBasketData, ...rest } = data;
    const guestBasket = BasketExtensionMapper.createGuestBasket(anonymousBasketData);

    return { guestBasket, ...rest };
  }
  static compareGuestBasketAddresses(
    deliveryAddress: BasketExtensionGuestFormAddress,
    invoiceAddress: BasketExtensionGuestFormAddress
  ): boolean {
    return (
      deliveryAddress.streetAddress === invoiceAddress.streetAddress &&
      deliveryAddress.zipCode === invoiceAddress.zipCode &&
      deliveryAddress.city === invoiceAddress.city &&
      deliveryAddress.country === invoiceAddress.country
    );
  }

  static createGuestBasket(data: BasketExtensionGuestData): BasketExtensionGuestForm {
    const deliveryAddress: BasketExtensionGuestFormAddress = {
      streetAddress: data.dlvStreetAddress,
      zipCode: data.dlvZipCode,
      city: data.dlvCity,
      country: data.dlvCountry,
    };

    const invoiceAddress: BasketExtensionGuestFormAddress = {
      streetAddress: data.invStreetAddress,
      zipCode: data.invZipCode,
      city: data.invCity,
      country: data.invCountry,
    };

    return {
      userDetailsFormGroup: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.emailAddress,
        phone: data.phoneNumber,
        siret: data.siretNumber,
        companyName: data.companyName,
        jobTitle: data.jobTitle,
        vat: data.vatNumber,
      },
      deliveryInfoFromGroup: {
        boxLabel: data.dlvGoodsMark,
        invoiceMark: data.dlvInvoiceMark,
        deliveryInfo: data.dlvInfo,
        customerNote: data.dlvNote,
        streetAddress: data.dlvStreetAddress,
        zipCode: data.dlvZipCode,
        city: data.dlvCity,
        country: data.dlvCountry,
        sameAddressAsInvoice: BasketExtensionMapper.compareGuestBasketAddresses(deliveryAddress, invoiceAddress),
      },
      invoiceAddressFormGroup: {
        streetAddress: data.invStreetAddress,
        zipCode: data.invZipCode,
        city: data.invCity,
        country: data.invCountry,
      },
    };
  }
}
