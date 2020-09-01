import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-attributes',
  templateUrl: './camfil-product-attributes.component.html',
  styleUrls: ['./camfil-product-attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductAttributesComponent {
  @Input() product: Product;
  @Input() multipleValuesSeparator = ', ';
}
