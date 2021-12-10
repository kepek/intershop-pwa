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
      deliveryAddress.addressLine1 === invoiceAddress.addressLine1 &&
      deliveryAddress.postalCode === invoiceAddress.postalCode &&
      deliveryAddress.city === invoiceAddress.city &&
      deliveryAddress.countryCode === invoiceAddress.countryCode
    );
  }

  static createGuestBasket(data: BasketExtensionGuestData): BasketExtensionGuestForm {
    const deliveryAddress: BasketExtensionGuestFormAddress = {
      addressLine1: data.dlvStreetAddress,
      postalCode: data.dlvZipCode,
      city: data.dlvCity,
      countryCode: data.dlvCountry,
    };

    const invoiceAddress: BasketExtensionGuestFormAddress = {
      addressLine1: data.invStreetAddress,
      postalCode: data.invZipCode,
      city: data.invCity,
      countryCode: data.invCountry,
    };

    return {
      userDetailsFormGroup: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.emailAddress,
        phoneHome: data.phoneNumber,
        siret: data.siretNumber,
        companyName1: data.companyName,
        jobTitle: data.jobTitle,
        vat: data.vatNumber,
      },
      deliveryInfoFromGroup: {
        boxLabel: data.dlvGoodsMark,
        invoiceMark: data.dlvInvoiceMark,
        deliveryInfo: data.dlvInfo,
        customerNote: data.dlvNote,
        addressLine1: data.dlvStreetAddress,
        postalCode: data.dlvZipCode,
        city: data.dlvCity,
        countryCode: data.dlvCountry,
        sameAddressAsInvoice: BasketExtensionMapper.compareGuestBasketAddresses(deliveryAddress, invoiceAddress),
      },
      invoiceAddressFormGroup: {
        addressLine1: data.invStreetAddress,
        postalCode: data.invZipCode,
        city: data.invCity,
        countryCode: data.invCountry,
      },
    };
  }
}
