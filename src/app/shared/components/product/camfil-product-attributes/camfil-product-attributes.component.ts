import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-attributes',
  templateUrl: './camfil-product-attributes.component.html',
  styleUrls: ['./camfil-product-attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductAttributesComponent implements OnInit {
  @Input() product: Product;
  @Input() multipleValuesSeparator = ', ';
  productListAttributes;

  ngOnInit(): void {
    this.productListAttributes = this.product?.attributeGroups[
      AttributeGroupTypes.ProductsListLabelAttributes
    ]?.attributes;
  }
}
