import { Address } from './address.model';

export class AddressHelper {
  static equal(add1: Address, add2: Address): boolean {
    if (!add1 || !add2) {
      return false;
    }
    if (add1.urn && add2.urn) {
      return add1.urn === add2.urn;
    }
    // fallback to id if urn is not set
    return add1.id === add2.id;
  }

  private static compare(address1: Address, address2: Address): boolean {
    return (
      address1.addressLine1 === address2.addressLine1 &&
      address1.postalCode === address2.postalCode &&
      address1.city === address2.city &&
      address1.countryCode === address2.countryCode &&
      address1.companyName1 === address2.companyName1
    );
  }

  static isNewAddress(currentAddress: Address, addresses: Address[]): boolean {
    const isCurrentOnTheList = addresses.find(address => AddressHelper.compare(address, currentAddress));

    return isCurrentOnTheList === undefined;
  }

  static getUrn(currentAddress: Address, addresses: Address[]): string {
    const fullAddress = addresses.find(address => AddressHelper.compare(address, currentAddress));

    return fullAddress?.urn || '';
  }

  static getId(currentAddress: Address, addresses: Address[]): string {
    const fullAddress = addresses.find(address => AddressHelper.compare(address, currentAddress));

    return fullAddress?.id || '';
  }
}
