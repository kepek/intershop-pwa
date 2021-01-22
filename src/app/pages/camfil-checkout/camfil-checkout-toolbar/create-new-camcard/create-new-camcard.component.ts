import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CamCardsFacade } from 'src/app/extensions/cam-cards/facades/cam-cards.facade';
import { CamCard } from 'src/app/extensions/cam-cards/models/cam-card/cam-card.model';

import { Bucket } from 'ish-core/models/basket/bucket.model';
import { Product } from 'ish-core/models/product/product.model';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

@Component({
  selector: 'camfil-create-new-camcard',
  templateUrl: './create-new-camcard.component.html',
  styleUrls: ['./create-new-camcard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateNewCamcardComponent {
  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  products: Product[];

  @Input() buckets: Bucket[] = [];

  constructor(private camCardsFacade: CamCardsFacade, public dialog: MatDialog) {}

  create() {
    this.convertToPermanent();
  }

  convertToPermanent() {
    const newCamCards = this.buckets.map((bucket, idx) => {
      const name = this.getNewName(bucket.orderMark || `order_${bucket.id}`, idx);
      const { addressLine1, addressLine2, city, countryCode, postalCode, street } = bucket.shipToAddressFull;
      const camCardItems = bucket.lineItems.map(item => ({
        quantity: item.quantity.value,
        product: {
          sku: item.productSKU,
        },
      }));
      return {
        name,
        customer: bucket.customer || { id: 'xP9_AAABUmAAAAF2dzgS4.D8' },
        deliveryAddress: { addressLine1, addressLine2, city, countryCode, postalCode, street },
        invoiceLabel: bucket.invoiceLabel,
        orderLabel: bucket.orderMark,
        camCardItems,
      };
    }) as CamCard[];
    newCamCards.forEach(camCard => {
      this.camCardsFacade.addBasketToNewCamCard(camCard);
    });

    console.log(newCamCards, 'newCamCards');
    console.log(this.buckets, 'this.buckets');

    // this.camCardsFacade.cloneAndEditPermanentCamCards(newCamCards);
  }

  getNewName(oldName: string, idx: number): string {
    return `${oldName}_${this.getTimestamp()}_${idx}`;
  }

  openModal() {
    this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();
  }

  getTimestamp(): string {
    return new Date().toLocaleString().replace(', ', '_');
  }
}
