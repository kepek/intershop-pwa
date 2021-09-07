import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Address } from 'ish-core/models/address/address.model';

/**
 * The Address Component displays an address. The readout is country-dependent.
 *
 * @example
 * <camfil-address
 *   [address]="order.invoiceToAddress"
 * ></camfil-address>
 */
@Component({
  selector: 'camfil-address',
  templateUrl: './camfil-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAddressComponent {
  /**
   * The Address to be displayed.
   *
   */
  @Input() address: Address;
}
