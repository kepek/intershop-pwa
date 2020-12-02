import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  CamfilProductItemBaseComponent,
  ProductItemBaseComponentConfiguration,
} from 'ish-shared/components/product/camfil-product-item-base/camfil-product-item-base.component';

export type ProductItemSimpleComponentConfiguration = ProductItemBaseComponentConfiguration;

@Component({
  selector: 'camfil-product-item-simple',
  templateUrl: './camfil-product-item-simple.component.html',
  styleUrls: ['./camfil-product-item-simple.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductItemSimpleComponent extends CamfilProductItemBaseComponent {}
