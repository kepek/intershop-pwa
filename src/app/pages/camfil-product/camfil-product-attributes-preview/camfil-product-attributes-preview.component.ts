import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-attributes-preview',
  templateUrl: './camfil-product-attributes-preview.component.html',
  styleUrls: ['./camfil-product-attributes-preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductAttributesPreviewComponent implements OnInit {
  @Input() product: Product;
  @Input() multipleValuesSeparator = ', ';
  @ViewChild('productAttributes') productAttributes;
  productListAttributes;

  ngOnInit(): void {
    this.productListAttributes = this.product.attributeGroups[
      AttributeGroupTypes.ProductsListLabelAttributes
    ]?.attributes;
  }

  scrollToAttributes(): void {
    document
      .querySelector('.product-attributes')
      .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
