import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Price } from 'ish-core/models/price/price.model';
import { formatPrice } from 'ish-core/models/price/price.pipe';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
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
    private shoppingFacade: ShoppingFacade,
    private translate: TranslateService
  ) {}
  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  private destroy$ = new Subject();

  @Input() order: Order;
  deliveryAddress: DeliveryAddress;
  loading = false;

  lineItems: OrderLineItem[];
  reOrderText: string;
  productsAvailability = true;
  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  ngOnInit() {
    this.camAccountFacade
      .orderLineItems$(this.order?.id)
      .pipe(whenTruthy(), takeUntil(this.destroy$))
      .subscribe(lineItems => {
        this.lineItems = lineItems;
        if (this.lineItems && this.lineItems.length) {
          this.camAccountFacade.orderTrackAndTrace$(this.order?.id);
          // this.camAccountFacade.orderAdditionalTotalCost$(this.order?.id);
          this.areProductsAvailable();
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

  handlePrice(value, currency) {
    const priceData: Price = {
      value,
      currency,
      type: 'Money',
    };
    return (value || value === 0) && currency ? formatPrice(priceData, this.translate.currentLang) : '---';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
