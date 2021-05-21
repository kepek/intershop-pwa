import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';
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
export class CamfilProductItemDetailedComponent extends CamfilProductItemBaseComponent implements OnInit {
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;

  isoEfficiency;
  energyclass;
  frameProduct;
  pressuredrop;
  isoClass;
  filterbags;

  updatedQuantity: number;

  isNotZero = ProductHelper.isNotZero;

  ngOnInit(): void {
    const attributes =
      this.product?.attributeGroups?.[AttributeGroupTypes.ProductsListLabelAttributes]?.attributes || [];

    this.updatedQuantity = this.quantity || 0;

    this.productItemForm = new FormGroup({
      [this.quantityControlName]: new FormControl(this.updatedQuantity),
    });
    this.productItemForm
      .get(this.quantityControlName)
      .valueChanges.pipe(
        map(val => +val),
        takeUntil(this.destroy$)
      )
      .subscribe(quantity => {
        this.updatedQuantity = quantity;
        this.quantityChange.emit(quantity);
      });

    this.isoEfficiency = this.getAttributeValue(attributes, 'IsoEfficiency');
    this.energyclass = this.getAttributeValue(attributes, 'Energyclass');
    this.frameProduct = this.getAttributeValue(attributes, 'FrameProduct');
    this.pressuredrop = this.getAttributeValue(attributes, 'Pressuredrop');
    this.isoClass = this.getAttributeValue(attributes, 'IsoClass');
    this.filterbags = this.getAttributeValue(attributes, 'Filterbags');
  }

  getAttributeValue(attributes: Attribute[], attributeName: string) {
    return attributes.find(x => x.name === attributeName)?.value;
  }
}
