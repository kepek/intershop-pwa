import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Address } from 'ish-core/models/address/address.model';

/**
 * The Address Component displays an address. The readout is country-dependent.
 *
 * @example
 * <camfil-checkout-delivery-address
 *   [address]="order.invoiceToAddress"
 * ></camfil-checkout-delivery-address>
 */
@Component({
  selector: 'camfil-checkout-delivery-address',
  templateUrl: './camfil-checkout-delivery-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutDeliveryAddressComponent {
  /**
   * The Address to be displayed.
   *
   */
  @Input() address: Address;
}
