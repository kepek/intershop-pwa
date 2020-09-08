import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';

@Component({
  selector: 'camfil-product-title',
  templateUrl: './camfil-product-title.component.html',
  styleUrls: ['./camfil-product-title.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductTitleComponent {
  @Input() category?: CategoryView;
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
}
