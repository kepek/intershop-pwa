import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Address } from 'ish-core/models/address/address.model';

@Component({
  selector: 'camfil-cam-card-modal-details',
  templateUrl: './cam-card-modal-details.component.html',
  styleUrls: ['./cam-card-modal-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamCardModalDetailsComponent {
  @Input() label?: string;
  @Input() nextDelivery: string;
  @Input() orderMark: string;
  @Input() invoiceMark: string;
  @Input() deliveryAddress: Address;
  @Input() isClicked = false;
  @Input() customerName: string;
  @Input() index: number;

  createDeliveryAddress() {
    const addressObj = {
      recipient: this.customerName,
      building: this.deliveryAddress.addressLine2,
      address: this.deliveryAddress.addressLine1,
      zipCode: this.deliveryAddress.postalCode,
      city: this.deliveryAddress.city,
    };

    const addressKeys = ['recipient', 'building', 'address', 'zipCode', 'city'];

    return this.addressToString(addressObj, addressKeys);
  }

  addressToString(obj, keys) {
    return keys
      .map(key => obj[key])
      .filter(v => v)
      .join(', ');
  }
}
