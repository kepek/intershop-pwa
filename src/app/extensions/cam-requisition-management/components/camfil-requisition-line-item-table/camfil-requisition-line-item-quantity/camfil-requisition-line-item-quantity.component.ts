import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { LineItem } from 'ish-core/models/line-item/line-item.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';

import { CamRequisitionManagementFacade } from '../../../facades/cam-requisition-management.facade';
import { CamfilRequisition } from '../../../models/camfil-requisition/camfil-requisition.model';

@Component({
  selector: 'camfil-requisition-line-item-quantity',
  templateUrl: './camfil-requisition-line-item-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionLineItemQuantityComponent implements OnInit, OnDestroy {
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() lineItem: LineItem;
  @Input() isEditable = false;
  @Input() requisition: CamfilRequisition;
  productItemForm: FormGroup;
  isMasterProduct = ProductHelper.isMasterProduct;
  updatedQuantity: number;

  readonly quantityControlName = 'quantity';

  private destroy$ = new Subject();

  constructor(private camRequisitionManagementFacade: CamRequisitionManagementFacade) {}

  ngOnInit() {
    this.productItemForm = new FormGroup({
      [this.quantityControlName]: new FormControl(this.lineItem?.quantity?.value || 1, { updateOn: 'blur' }),
    });

    this.productItemForm
      .get(this.quantityControlName)
      ?.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(quantity => {
        const { minOrderQuantity, maxOrderQuantity } = this.product;

        if (quantity < minOrderQuantity) {
          return;
        }

        if (quantity >= maxOrderQuantity) {
          return;
        }

        const lineItemUpdate = {
          lineItemId: this.lineItem.id,
          quantity,
        };
        if (this.productItemForm.get(this.quantityControlName)?.value !== this.lineItem?.quantity?.value) {
          this.camRequisitionManagementFacade.updateCamfilRequisitionLineItem(this.requisition.id, lineItemUpdate);
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
