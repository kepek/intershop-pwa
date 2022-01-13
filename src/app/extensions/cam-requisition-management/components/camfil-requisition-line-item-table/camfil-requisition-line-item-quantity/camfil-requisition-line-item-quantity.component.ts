import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { LineItem } from 'ish-core/models/line-item/line-item.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';

@Component({
  selector: 'camfil-requisition-line-item-quantity',
  templateUrl: './camfil-requisition-line-item-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionLineItemQuantityComponent implements OnInit, OnDestroy {
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() lineItem: LineItem;

  productItemForm: FormGroup;
  isMasterProduct = ProductHelper.isMasterProduct;
  updatedQuantity: number;

  readonly quantityControlName = 'quantity';

  private destroy$ = new Subject();

  constructor() {}

  ngOnInit() {
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
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
