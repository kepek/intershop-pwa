import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { ProductItem } from 'ish-core/models/product/product-item';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CreateOrderProductModalComponent } from '../create-order-product-modal/create-order-product-modal.component';

@Component({
  selector: 'camfil-create-order-products-modal',
  templateUrl: './create-order-products-modal.component.html',
  styleUrls: ['./create-order-products-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CreateOrderProductsModalComponent extends CreateOrderProductModalComponent implements OnChanges {
  private itemsValues: (ProductItem & { quantityForm: FormGroup })[] = [];

  @Input() products: ProductItem[];

  @Input() set items(items: (ProductItem & { quantityForm: FormGroup })[]) {
    this.itemsValues = items;
  }

  quantityForms: FormArray;

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

  ngOnChanges() {
    this.createItems();
  }

  init() {
    this.createItems();

    super.init();
  }

  initForms() {
    this.orderForm = this.fb.group({});
    this.quantityForms = new FormArray(this.getQuantityForms());
  }

  getQuantityForms() {
    return this.items.map(item => item.quantityForm);
  }

  submitForm() {
    const addressForm = this.orderFormCmp.addressForm;

    if (addressForm.invalid || this.quantityForms.invalid) {
      markAsDirtyRecursive(addressForm);
      this.getQuantityForms().forEach(quantityForm => {
        markAsDirtyRecursive(quantityForm);
      });
    } else {
      this.loading = true;

      const bucket: Bucket = {
        basket: '',
        id: '',
        ...this.getBasketExtension(),
        shippingAddress: this.getAddress(),
      };

      this.products?.length ? this.addProductsToBucket() : this.submitWithoutProduct(bucket);
    }
  }

  addProductsToBucket() {
    const address = this.getAddress();

    this.items.forEach(item => {
      const quantity = item.quantityForm.get('quantity').value;

      const lineItemAttributes = AttributeHelper.calculateAttrsToAddFromForm(item.quantityForm);

      if (this.isNewAddress()) {
        this.shoppingFacade.addProductToBucket(
          address,
          this.commonShippingMethodId,
          item.product.sku,
          quantity,
          this.basketId,
          this.getBasketExtension(),
          lineItemAttributes
        );
      } else {
        this.shoppingFacade.addProductToBucketWithUrn(
          this.getUrn(address),
          this.getId(address),
          this.commonShippingMethodId,
          item.product.sku,
          quantity,
          this.basketId,
          lineItemAttributes
        );
      }
    });
  }

  disableIfNoMeasurements() {
    // We're assuming that multiple products do NOT need to handle measurements.
    return false;
  }
}
