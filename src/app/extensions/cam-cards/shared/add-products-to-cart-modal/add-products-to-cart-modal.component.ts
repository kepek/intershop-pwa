import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { ProductItem } from 'ish-core/models/product/product-item';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { AddProductToCartModalComponent } from '../add-product-to-cart-modal/add-product-to-cart-modal.component';

@Component({
  selector: 'camfil-add-products-to-cart-modal',
  templateUrl: './add-products-to-cart-modal.component.html',
  styleUrls: ['./add-products-to-cart-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line:component-creation-test
export class AddProductsToCartModalComponent extends AddProductToCartModalComponent implements OnInit, OnChanges {
  private itemsValues: (ProductItem & { quantityForm: FormGroup })[] = [];

  @Input() products: ProductItem[];

  @Input() set items(items: (ProductItem & { quantityForm: FormGroup })[]) {
    this.itemsValues = items;
  }

  get items() {
    return this.itemsValues;
  }

  private createItems() {
    this.items = this.products.map(item => {
      const quantityForm = new FormGroup({
        quantity: new FormControl(item?.quantity || item?.product?.minOrderQuantity || 0),
        boxLabel: new FormControl('', Validators.maxLength(60)),
      });

      return {
        ...item,
        quantityForm,
      };
    });
  }

  ngOnInit() {
    this.init();
    this.createItems();
  }

  ngOnChanges() {
    this.createItems();
  }

  disableIfNoMeasurements() {
    // We're assuming that multiple products do NOT need to handle measurements.
    return false;
  }

  addToOrder() {
    this.items.forEach(({ product, quantityForm }) => {
      if (quantityForm.valid && this.selectedOrderId) {
        const currentBucket = this.buckets.find(bucket => bucket.id === this.selectedOrderId);
        const quantity = quantityForm.get('quantity').value;
        const lineItemAttributes = AttributeHelper.calculateAttrsToAddFromForm(quantityForm);

        this.submitted = true;

        this.shoppingFacade.addProductToBucketWithUrn(
          currentBucket.shipToAddress,
          currentBucket.shipToAddressFull.id,
          this.commonShippingMethodId,
          product.sku,
          quantity,
          this.basketId,
          lineItemAttributes
        );
      } else {
        markAsDirtyRecursive(quantityForm);
      }
    });
  }

  // override   openCreateOrderModal

  show() {
    this.items.forEach(({ quantity, quantityForm }) => {
      quantityForm?.controls.quantity.setValue(quantity);
      quantityForm?.controls.boxLabel.setValue('');
    });

    return this.modalTemplate;
  }
}
