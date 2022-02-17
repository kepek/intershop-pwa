import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

import { OrderHelper } from 'ish-core/models/order/order.helper';
import { Price } from 'ish-core/models/price/price.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamAccountFacade } from '../../../facades/cam-account.facade';
import { Address } from 'ish-core/models/address/address.model';
import { Order } from '../../../models/order/order.model';

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
export class CamfilAccountOrderComponent implements OnInit, OnDestroy {
  constructor(public dialog: MatDialog, private camAccountFacade: CamAccountFacade) {}
  private destroy$ = new Subject();

  @Input() order: Order;
  @Input() deviceType: DeviceType;

  orderLoading$: Observable<boolean>;

  getOrderStatusText = OrderHelper.getOrderStatusText;
  commonShipToAddress: Address;

  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  ngOnInit() {
    this.orderLoading$ = this.camAccountFacade.ordersLoading$;
    const addr = this.order.deliveryAddress;
    // tslint:disable-next-line:ish-no-object-literal-type-assertion
    this.commonShipToAddress = {
      companyName1: addr.deliveryAddressName,
      companyName2: addr.deliveryAddressName2,
      addressLine1: addr.deliveryAddressAddress,
      addressLine2: addr.deliveryAddressAddressOptional || '',
      postalCode: addr.deliveryAddressZipCode,
      city: addr.deliveryAddressCity,
    } as Address;
  }

  placeReOrder() {
    // Check products availability
    if (this.order.canReOrder) {
      // API call /camfilorder/orderId Place reorder and redirect to checkout page
      this.camAccountFacade.createOrderDuplicate(this.order.id);
    } else {
      this.dialog.open(this.modal?.show());

      this.modal.hide = () => {
        this.dialog.closeAll();
      };
    }
  }

  handlePrice(value, currency): Price {
    return {
      value,
      currency,
      type: 'Money',
    };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
