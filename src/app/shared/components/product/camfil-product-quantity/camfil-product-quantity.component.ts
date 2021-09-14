import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { range } from 'lodash-es';

import { Product } from 'ish-core/models/product/product.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { ADD_NEW_PRODUCT_VALIDATORS } from './validators';

function generateSelectOptionsForRange(min: number, max: number): SelectOption[] {
  return range(min, max)
    .map(num => num.toString())
    .map(num => ({ label: num, value: num }));
}

export type CamfilProductQuantityType = 'input' | 'select' | 'counter';

@Component({
  selector: 'camfil-product-quantity',
  templateUrl: './camfil-product-quantity.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductQuantityComponent implements OnInit, OnChanges {
  @Input() showErrors = true;
  @Input() readOnly = false;
  @Input() allowZeroQuantity = false;
  @Input() quantityLabel = 'product.quantity.label';
  @Input() product: Product;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() type?: CamfilProductQuantityType = 'counter';
  @Input() class?: string;
  @Input() isInLineItem = false;
  @Input() lineItemId?: string;

  quantityOptions: SelectOption[];

  validators = ADD_NEW_PRODUCT_VALIDATORS;

  get quantity() {
    return this.parentForm.get(this.controlName) && this.parentForm.get(this.controlName).value;
  }

  get labelClass() {
    return this.quantityLabel.trim() === '' ? 'col-0' : 'label-quantity col-6';
  }

  get inputClass() {
    return this.quantityLabel.trim() === ''
      ? 'col-12' + (this.class ? this.class : '')
      : 'col-6' + (this.class ? this.class : '');
  }

  ngOnInit() {
    this.parentForm.get(this.controlName).setValidators(this.getValidations());
  }

  getValidations(): ValidatorFn {
    if (this.type === 'input' || this.type === 'counter') {
      return Validators.compose([
        Validators.required,
        Validators.min(this.allowZeroQuantity ? 0 : this.product.minOrderQuantity),
        Validators.max(this.product.maxOrderQuantity),
        SpecialValidators.integer,
      ]);
    }
  }

  ngOnChanges(change: SimpleChanges) {
    if (this.type === 'select') {
      this.createSelectOptions(change.product);
    }
  }

  private createSelectOptions(change: SimpleChange) {
    if (change && change.currentValue) {
      this.quantityOptions = generateSelectOptionsForRange(
        this.product.minOrderQuantity,
        this.product.maxOrderQuantity
      );
    }
  }
}
