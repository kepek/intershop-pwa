import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

/**
 * The Product Attributes Component renders all attributes of the product detail attribute group in a description list
 *
 * @example
 * <camfil-product-attributes
 *   [product]="product"
 *   [multipleValuesSeparator]=", ">
 * </camfil-product-attributes>
 */
@Component({
  selector: 'camfil-product-attributes',
  templateUrl: './camfil-product-attributes.component.html',
  styleUrls: ['./camfil-product-attributes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductAttributesComponent implements OnInit {
  @Input() product: Product;
  @Input() multipleValuesSeparator = ', ';

  productListAttributes: Attribute[];

  ngOnInit(): void {
    const attributes = (this.productListAttributes =
      this.product?.attributeGroups?.[AttributeGroupTypes.ProductsDetailAttributes]?.attributes ||
      this.product?.attributes);

    this.productListAttributes = attributes.filter(attribute => ProductHelper.isNotZero(attribute.value));
  }
}
