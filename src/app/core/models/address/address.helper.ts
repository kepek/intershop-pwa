import { BucketAddress } from 'ish-core/models/basket/bucket.model';

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

  static isNewAddress(currentAddress: Address, addresses: (Address | BucketAddress)[]) {
    const isCurrentOnTheList = addresses.find(
      address =>
        address.addressLine1 === currentAddress.addressLine1 &&
        address.addressLine2 === currentAddress.addressLine2 &&
        address.postalCode === currentAddress.postalCode &&
        address.city === currentAddress.city &&
        address.companyName1 === currentAddress.companyName1
    );

    return isCurrentOnTheList === undefined;
  }
}
