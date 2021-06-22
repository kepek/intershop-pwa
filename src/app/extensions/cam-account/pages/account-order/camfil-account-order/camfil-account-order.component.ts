import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { OrderHelper } from 'ish-core/models/order/order.helper';
import { Price } from 'ish-core/models/price/price.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamAccountFacade } from '../../../facades/cam-account.facade';
import { DeliveryAddress } from '../../../models/deliveryAddress/deliveryAddress.interface';
import { Order } from '../../../models/order/order.model';
import { OrderLineItem } from '../../../models/orderLineItem/orderLineItem.interface';

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
  constructor(
    public dialog: MatDialog,
    private camAccountFacade: CamAccountFacade,
    private shoppingFacade: ShoppingFacade
  ) {}
  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  private destroy$ = new Subject();

  @Input() order: Order;
  @Input() deviceType: DeviceType;

  deliveryAddress: DeliveryAddress;
  loading = false;
  orderLoading$: Observable<boolean>;
  lineItems: OrderLineItem[];
  reOrderText: string;
  productsAvailability = true;
  getOrderStatusText = OrderHelper.getOrderStatusText;
  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  ngOnInit() {
    this.loading = true;
    this.orderLoading$ = this.camAccountFacade.loading$;

    this.orderLoading$?.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (!value) {
        setTimeout(() => {
          this.loading = false;
        }, 300);
      }
    });
    this.camAccountFacade
      .orderLineItems$(this.order?.id)
      .pipe(whenTruthy(), takeUntil(this.destroy$))
      .subscribe(lineItems => {
        this.lineItems = lineItems;
        if (this.lineItems && this.lineItems.length) {
          this.camAccountFacade.orderTrackAndTrace$(this.order?.id);
          this.camAccountFacade.orderAdditionalTotalCost$(this.order?.id);
          this.areProductsAvailable();
          if (!this.order?.totalOrderedQty) {
            this.camAccountFacade.orderLineItems$(this.order?.id);
          }
        }
      });

    this.deliveryAddress = this.order?.deliveryAddress;
  }

  placeReOrder() {
    // Check products availability
    if (this.productsAvailability) {
      this.loading = true;
      // API call /camfilorder/orderId Place reorder and redirect to checkout page
      this.camAccountFacade.createOrderDuplicate(this.order.id);
    } else {
      // Products are no longer buyable - display message
      this.reOrderText = 'camfil.modal.place_reorder_fail.text';
      this.dialog.open(this.modal?.show());

      this.modal.hide = () => {
        this.dialog.closeAll();
      };
    }
  }

  areProductsAvailable() {
    this.lineItems?.forEach(item =>
      this.shoppingFacade
        .product$(item.sku, CamfilAccountOrderComponent.REQUIRED_COMPLETENESS_LEVEL)
        .pipe(mapToProperty('availability'), takeUntil(this.destroy$))
        .subscribe(availability => {
          if (!availability) {
            this.productsAvailability = false;
          }
        })
    );
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

  get deliveryDatesForItems() {
    return (
      this.lineItems
        ?.reduce((acc, { deliveryDate }) => (acc.includes(deliveryDate) ? acc : [...acc, deliveryDate]), [])
        .sort() || []
    );
  }

  isDeliveryPartial() {
    const d = this.deliveryDatesForItems;
    return d.length > 1 && this.dateWithoutTime(d[d.length - 1]) > this.dateWithoutTime(this.order.deliveryDate);
  }

  /**
   *
   * @param n date in milliseconds
   * @returns number
   */
  dateWithoutTime(n: number) {
    return Math.floor(n / (24 * 60 * 60 * 1000));
  }
}
