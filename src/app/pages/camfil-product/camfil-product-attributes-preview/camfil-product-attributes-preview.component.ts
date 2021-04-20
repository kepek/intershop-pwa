import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

/**
 * The Product Attributes Preview Component renders the SKU & the first five attributes of the product detail attribute group in a description list
 *
 * @example
 * <camfil-product-attributes-preview
 *   [product]="product"
 *   [multipleValuesSeparator]=", ">
 * </camfil-product-attributes-preview>
 */
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
    const attributes = (this.productListAttributes =
      this.product?.attributeGroups[AttributeGroupTypes.ProductsDetailAttributes]?.attributes ||
      this.product?.attributes);

    this.productListAttributes = attributes.filter(attribute => ProductHelper.isNotZero(attribute.value));
  }

  scrollToAttributes(): void {
    document
      .querySelector('.product-attributes')
      .scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }
}
