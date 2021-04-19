import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CamCardsFacade } from 'src/app/extensions/cam-cards/facades/cam-cards.facade';
import { CamCard, CamCardItem } from 'src/app/extensions/cam-cards/models/cam-card/cam-card.model';

import { Bucket } from 'ish-core/models/basket/bucket.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Product } from 'ish-core/models/product/product.model';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

@Component({
  selector: 'camfil-create-new-camcard',
  templateUrl: './create-new-camcard.component.html',
  styleUrls: ['./create-new-camcard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewCamcardComponent implements OnInit, OnDestroy {
  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  products: Product[];
  private destroy$ = new Subject();

  camCardLoading$: Observable<boolean>;

  @Input() buckets: Bucket[] = [];

  constructor(private camCardsFacade: CamCardsFacade, public dialog: MatDialog) {}

  ngOnInit() {
    this.camCardLoading$ = this.camCardsFacade.camCardLoading$;
  }

  create() {
    this.convertToPermanent();

    this.camCardLoading$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (!value) {
        this.modal.hide();
      }
    });
  }

  getValFromAttr<T>(item: LineItemView, name: string) {
    return item.attributes?.find(attr => attr.name === name)?.value as T;
  }

  convertToPermanent() {
    const newCamCards = this.buckets.map((bucket, idx) => {
      const name = this.getNewName(bucket.orderMark, idx);
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
        deliveryAddress: { addressLine1, addressLine2, city, countryCode, postalCode },
        invoiceLabel: bucket.invoiceLabel,
        orderLabel: bucket.orderMark,
        reminderFlag: 1,
        camCardItems,
      };
    }) as CamCard[];
    newCamCards.forEach(camCard => {
      this.camCardsFacade.addBasketToNewCamCard(camCard);
    });
  }

  getNewName(oldName: string, idx: number): string {
    return `${oldName} ${this.getTimestamp()}_${idx}`;
  }

  openModal() {
    this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();
  }

  getTimestamp(): string {
    return new Date().toLocaleString().replace(', ', '_');
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
