import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Order } from 'camfil-pwa/models/order/order.model';
import { Observable } from 'rxjs';
import { debounceTime, filter, map, take } from 'rxjs/operators';
import { CamCardsFacade } from 'src/app/extensions/cam-cards/facades/cam-cards.facade';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';

import { CamCard, CamCardItem } from '../../../extensions/cam-cards/models/cam-card/cam-card.model';
import { CamfilCheckoutReceiptCreateCamCardDialogComponent } from '../camfil-checkout-receipt-create-camcard-dialog/camfil-checkout-receipt-create-camcard-dialog.component';

@Component({
  selector: 'camfil-checkout-receipt-order',
  templateUrl: './camfil-checkout-receipt-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutReceiptOrderComponent implements OnInit {
  @Input() order: Order;

  isLoggedIn$: Observable<boolean>;
  isFreightCostInvalid$: Observable<boolean>;

  constructor(
    private accountFacade: AccountFacade,
    private checkoutFacade: CheckoutFacade,
    private camCardsFacade: CamCardsFacade,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
    this.isFreightCostInvalid$ = this.checkoutFacade.isFreightCostInvalid$;

    if (this.order) {
      this.checkoutFacade.submittedBuckets$
        .pipe(
          debounceTime(1000),
          take(1),
          map(buckets => buckets.filter(b => !b.createdFromCamCardId)),
          filter(buckets => buckets.length > 0)
        )
        .subscribe(buckets => {
          this.showCreateCamCardsModal(buckets);
        });
    }
  }

  showCreateCamCardsModal(buckets: Bucket[]) {
    this.dialog
      .open(CamfilCheckoutReceiptCreateCamCardDialogComponent)
      .afterClosed()
      .subscribe(result => {
        if (result) {
          this.createCamCardsFromBuckets(buckets);
        }
      });
  }

  createCamCardsFromBuckets(buckets: Bucket[]) {
    const camCards = this.buildCamCards(buckets);
    camCards.forEach(camCard => {
      this.camCardsFacade.addBasketToNewCamCard(camCard);
    });
  }

  buildCamCards(buckets: Bucket[]): CamCard[] {
    return buckets.map(bucket => {
      const name = this.getNewName(bucket.orderMark);
      const { addressLine1, addressLine2, city, countryCode, postalCode } = bucket.shipToAddressFull;
      const camCardItems = bucket.lineItems.map(item => {
        const label = this.getValFromAttr<string>(item, 'boxLabel');
        const data: CamCardItem = {
          quantity: item.quantity.value,
          product: {
            sku: item.productSKU,
          },
        };
        if (label) {
          data.comment = { label };
        }

        const measurement = {
          width: this.getValFromAttr<number>(item, 'width'),
          height: this.getValFromAttr<number>(item, 'height'),
          diameter: this.getValFromAttr<number>(item, 'diameter'),
        };
        if (Object.values(measurement).filter(x => x).length) {
          data.measurement = measurement;
        }

        return data;
      });
      return {
        name,
        customer: bucket.customer,
        deliveryAddress: {
          addressLine1,
          addressLine2,
          city,
          countryCode,
          postalCode,
        },
        invoiceLabel: bucket.invoiceLabel,
        orderLabel: bucket.orderMark,
        reminderFlag: 1,
        camCardItems,
      };
    }) as CamCard[];
  }

  getValFromAttr<T>(item: LineItemView, name: string) {
    return item.attributes?.find(attr => attr.name === name)?.value as T;
  }

  getNewName(oldName: string): string {
    return `${oldName || new Date().toLocaleString().replace(', ', '_')}`;
  }
}
