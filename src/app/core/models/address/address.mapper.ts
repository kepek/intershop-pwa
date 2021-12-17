import { CamCard } from 'src/app/extensions/cam-cards/models/cam-card/cam-card.model';

import { ZipCodeData, ZipCodeInfo } from 'ish-core/models/zip-codes/zip-codes.interface';

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
      const building = addr.addressLine2 ? ` / ${addr.addressLine2}` : '';
      return {
        addressName: `CamCard_${camCard.name}`,
        companyName1: (addr.companyName1 || camCard.customer.companyName) + building,
        addressLine1: addr.addressLine1,
        addressLine2: '',
        postalCode: addr.postalCode,
        city: addr.city,
        countryCode: addr.countryCode,
        country: addr.country,
        id: '',
        invoiceToAddress: true,
        firstName: '',
        lastName: '',
        phoneHome: '',
        shipToAddress: true,
        urn: '',
        eligibleShipToAddress: true,
      };
    } else {
      throw new Error(`'camCard' is required for the mapping`);
    }
  }
  static zipCodefromData(code: string, data: ZipCodeData[]): ZipCodeInfo[] {
    if (!data.length) {
      return [{ city: undefined, zipCode: code }];
    }

    return data.map(item => ({
      id: item.cityAlias || item.cityId,
      city: item.cityId,
      country: item.countryRegionId,
      zipCode: item.zipCode || code,
      language: item.language,
    }));
  }
}
