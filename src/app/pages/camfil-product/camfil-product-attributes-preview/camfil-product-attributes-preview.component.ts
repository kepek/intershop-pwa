import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-attributes-preview',
  templateUrl: './camfil-product-attributes-preview.component.html',
  styleUrls: ['./camfil-product-attributes-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductAttributesPreviewComponent {
  @Input() product: Product;
  @Input() multipleValuesSeparator = ', ';
  @ViewChild('productAttributes') productAttributes;

  scrollToAttributes(): void {
    document
      .querySelector('.product-attributes')
      .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
