import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

import { PRODUCT } from './database';

@Component({
  selector: 'camfil-ahu-page-detail',
  styleUrls: ['./camfil-ahu-page-detail.component.scss'],
  templateUrl: './camfil-ahu-page-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAHUPageDetailComponent {
  product: Product = PRODUCT;
  slots = new Array(4);
  isMoreDetailsOpen = false;

  toggleDetails() {
    this.isMoreDetailsOpen = !this.isMoreDetailsOpen;
  }
}
