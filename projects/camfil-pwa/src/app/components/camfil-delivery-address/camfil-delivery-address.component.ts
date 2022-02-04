import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CamfilOrderDeliveryAddressData } from 'camfil-pwa/models/camfil-order-delivery-address/camfil-order-delivery-address.interface';

/**
 * The Address Component displays an address. The readout is country-dependent.
 *
 * @example
 * <camfil-delivery-address
 *   [deliveryAddress]="order.deliveryAddress"
 * ></camfil-delivery-address>
 */
@Component({
  selector: 'camfil-delivery-address',
  templateUrl: './camfil-delivery-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilDeliveryAddressComponent {
  /**
   * The Address to be displayed.
   *
   */
  @Input() deliveryAddress: CamfilOrderDeliveryAddressData;
}
