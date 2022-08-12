import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store, select } from '@ngrx/store';
import { CamfilPwaFacade } from 'camfil-pwa/facades/camfil-pwa.facade';
import { CamfilOrder } from 'camfil-pwa/models/camfil-order/camfil-order.model';
import { Observable, Subject } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { OrderHelper } from 'ish-core/models/order/order.helper';
import { Price } from 'ish-core/models/price/price.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { getProducts } from 'ish-core/store/shopping/products';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

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
  constructor(public dialog: MatDialog, private camfilAccountFacade: CamfilPwaFacade, private store: Store) {}
  private destroy$ = new Subject();

  @Input() order: CamfilOrder;
  @Input() deviceType: DeviceType;

  orderLoading$: Observable<boolean>;

  getOrderStatusText = OrderHelper.getOrderStatusText;

  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  ngOnInit() {
    this.orderLoading$ = this.camfilAccountFacade.ordersLoading$;
  }

  placeReOrder() {
    const skus = this.order?.lineItems?.map(lineItem => lineItem?.sku);
    // TODO: Should be an ReOrder action
    this.store
      .pipe(
        take(1),
        select(getProducts, { skus }),
        filter(products => products.length === skus.length),
        map(products =>
          products.map(({ availability, failed, sku }) => ({ sku, availability: failed ? false : availability }))
        ),
        map(availabilities => availabilities.every(({ availability }) => !!availability))
      )
      .subscribe(canReOrder => {
        if (canReOrder) {
          // API call /camfilorder/orderId Place reorder and redirect to checkout page
          this.camfilAccountFacade.cloneCamfilOrder(this.order.id);
        } else {
          this.dialog.open(this.modal?.show());

          this.modal.hide = () => {
            this.dialog.closeAll();
          };
        }
      });
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
