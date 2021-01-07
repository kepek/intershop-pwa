import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order Page Component displays the details of an order. See also {@link OrderPageContainerComponent}
 *
 * @example
 * <camfil-account-order [order]="order"></camfil-account-order>
 */
@Component({
  selector: 'camfil-account-order',
  templateUrl: './camfil-account-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-account-order.component.scss'],
})
export class CamfilAccountOrderComponent {
  @Input() order: Order;
}
