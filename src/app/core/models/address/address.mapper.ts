import { CamCard } from 'src/app/extensions/cam-cards/models/cam-card/cam-card.model';

import { AddressData } from './address.interface';
import { Address } from './address.model';

export class AddressMapper {
  static fromData(data: AddressData): Address {
    if (data) {
      return {
        id: data.id,
        urn: data.urn,
        type: data.type,
        addressName: data.addressName,
        companyName1: data.companyName1,
        companyName2: data.companyName2,
        title: data.title,
        firstName: data.firstName,
        lastName: data.lastName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        addressLine3: data.addressLine3,
        postalCode: data.postalCode,
        city: data.city,
        mainDivision: data.mainDivisionName || data.mainDivision,
        mainDivisionCode: data.mainDivisionCode || data.mainDivision,
        country: data.country,
        countryCode: data.countryCode,
        phoneHome: data.phoneHome,
        phoneMobile: data.phoneMobile,
        phoneBusiness: data.phoneBusiness,
        phoneBusinessDirect: data.phoneBusinessDirect,
        fax: data.fax,
        email: data.email,
        invoiceToAddress:
          data.eligibleInvoiceToAddress !== undefined ? data.eligibleInvoiceToAddress : data.invoiceToAddress,
        shipToAddress: data.eligibleShipToAddress !== undefined ? data.eligibleShipToAddress : data.shipToAddress,
        shipFromAddress:
          data.eligibleShipFromAddress !== undefined ? data.eligibleShipFromAddress : data.shipFromAddress,
        serviceToAddress:
          data.eligibleServiceToAddress !== undefined ? data.eligibleServiceToAddress : data.serviceToAddress,
        installToAddress:
          data.eligibleInstallToAddress !== undefined ? data.eligibleInstallToAddress : data.installToAddress,
      };
    } else {
      throw new Error(`'addressData' is required for the mapping`);
    }
  }
  static fromCamCard(camCard: CamCard): Address {
    if (camCard) {
      const addr = camCard.deliveryAddress;
      return {
        addressName: `CamCard_${camCard.name}`,
        country: addr.country,
        id: '',
        invoiceToAddress: true,
        firstName: addr.companyName1 || '',
        lastName: camCard.customer.companyName2 || '',
        phoneHome: '',
        shipToAddress: true,
        urn: '',
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        postalCode: addr.postalCode,
        city: addr.city,
        companyName1: camCard.customer.companyName,
        countryCode: addr.countryCode,
        eligibleShipToAddress: true,
      };
    } else {
      throw new Error(`'camCard' is required for the mapping`);
    }
  }
}
