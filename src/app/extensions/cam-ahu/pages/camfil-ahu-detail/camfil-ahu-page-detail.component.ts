import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PRODUCT } from './database';
import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-ahu-page-detail',
  styleUrls: ['./camfil-ahu-page-detail.component.scss'],
  templateUrl: './camfil-ahu-page-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAHUPageDetailComponent {
  product: Product = PRODUCT;
  isMoreDetailsOpen = false;

  toggleDetails() {
    this.isMoreDetailsOpen = !this.isMoreDetailsOpen;
  }
}
