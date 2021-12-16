import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { ProductItem } from 'ish-core/models/product/product-item';

import { CreateProductCamCardModalComponent } from '../../add-product-to-cam-card-modal/create-product-cam-card-modal/create-product-cam-card-modal.component';

@Component({
  selector: 'camfil-create-products-cam-card-modal',
  templateUrl: './create-products-cam-card-modal.component.html',
  styleUrls: ['./create-products-cam-card-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CreateProductsCamCardModalComponent extends CreateProductCamCardModalComponent implements OnChanges {
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
        boxLabel: new FormControl('', Validators.maxLength(40)),
      });

      return {
        ...item,
        quantityForm,
      };
    });
  }

  init() {
    this.createItems();
    super.init();
  }

  ngOnChanges() {
    this.createItems();
  }

  disableIfNoMeasurements() {
    // We're assuming that multiple products do NOT need to handle measurements.
    return false;
  }
}
