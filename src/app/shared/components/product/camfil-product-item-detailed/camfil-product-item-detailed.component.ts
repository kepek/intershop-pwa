import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CamfilProductItemBaseComponent,
  ProductItemBaseComponentConfiguration,
} from 'ish-shared/components/product/camfil-product-item-base/camfil-product-item-base.component';

export type ProductItemDetailedComponentConfiguration = ProductItemBaseComponentConfiguration;

@Component({
  selector: 'camfil-product-item-detailed',
  templateUrl: './camfil-product-item-detailed.component.html',
  styleUrls: ['./camfil-product-item-detailed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductItemDetailedComponent extends CamfilProductItemBaseComponent {}
