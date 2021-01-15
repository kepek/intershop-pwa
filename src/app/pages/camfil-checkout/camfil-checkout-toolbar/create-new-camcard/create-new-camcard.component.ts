import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Bucket } from 'ish-core/models/basket/bucket.model';
import { Product } from 'ish-core/models/product/product.model';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamCardsFacade } from '../../../../extensions/cam-cards/facades/cam-cards.facade';
import { CamCard } from '../../../../extensions/cam-cards/models/cam-card/cam-card.model';

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
    const transientCamCards: CamCard[] = this.buckets.map((bucket, idx) => {
      const camCardName = this.getNewName(bucket.orderMark, idx);

      return {
        id: bucket.camCardId,
        name: camCardName,
      };
    });

    this.camCardsFacade.cloneAndEditPermanentCamCards(transientCamCards);
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
