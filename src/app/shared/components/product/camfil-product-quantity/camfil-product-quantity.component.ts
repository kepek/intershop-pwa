import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { range } from 'lodash-es';
import { EMPTY, Subject } from 'rxjs';
import { debounceTime, mapTo, takeUntil, tap } from 'rxjs/operators';
import { CamStepQuantityErrorDialogComponent } from 'src/app/extensions/cam-cards/shared/cam-step-quantity-error-dialog/cam-step-quantity-error-dialog.component';

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
export class CamfilProductQuantityComponent implements OnInit, OnChanges, OnDestroy {
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

  constructor(public dialog: MatDialog) {}
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
  private destroy$ = new Subject();

  static validateValueWithQuantityStep(stepQuantity = 1) {
    return (control: AbstractControl): ValidationErrors | undefined => {
      const value = control.value;

      if (!value) {
        return;
      }

      const isValueMultipliedCorrectly = value % stepQuantity === 0;

      return !isValueMultipliedCorrectly ? { stepQuantityValue: true } : undefined;
    };
  }

  ngOnInit() {
    this.parentForm.get(this.controlName).setValidators(this.getValidations());

    this.parentForm
      .get(this.controlName)
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const quantityControlError = this.parentForm.get(this.controlName).errors;
        if (quantityControlError && 'stepQuantityValue' in quantityControlError) {
          this.showStepQuantityErrorModal(this.product.stepQuantity);
        }
      });
  }

  getAsyncValidators(): AsyncValidatorFn {
    return (control: FormGroup) =>
      (control.valueChanges &&
        control.valueChanges.pipe(
          debounceTime(1000),
          tap(quantity => {
            console.log('quantity', quantity);
            const quantityControl = control.get(this.controlName) as FormControl;
            quantityControl.setValidators([
              Validators.required,
              Validators.min(this.allowZeroQuantity ? 0 : this.product.minOrderQuantity),
              Validators.max(this.product.maxOrderQuantity),
              SpecialValidators.integer,
              CamfilProductQuantityComponent.validateValueWithQuantityStep(this.product.stepQuantity),
            ]);
          }),
          mapTo(undefined)
        )) ||
      EMPTY;
  }

  getValidations(): ValidatorFn {
    if (this.type === 'input' || this.type === 'counter') {
      return Validators.compose([
        Validators.required,
        Validators.min(this.allowZeroQuantity ? 0 : this.product.minOrderQuantity),
        Validators.max(this.product.maxOrderQuantity),
        SpecialValidators.integer,
        CamfilProductQuantityComponent.validateValueWithQuantityStep(this.product.stepQuantity),
      ]);
    }
  }

  ngOnChanges(change: SimpleChanges) {
    if (this.type === 'select') {
      this.createSelectOptions(change.product);
    }
    if (change.product) {
      const quantityValidator = this.validators.quantity?.map(validator =>
        validator.error === 'stepQuantityValue'
          ? {
              ...validator,
              messageVariables: [`${this.product.stepQuantity}`],
            }
          : validator
      );
      this.validators = {
        ...this.validators,
        quantity: [...quantityValidator],
      };
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

  showStepQuantityErrorModal(stepQuantityValue): void {
    this.dialog.open(CamStepQuantityErrorDialogComponent, {
      width: '330px',
      autoFocus: false,
      data: { stepQuantityValue },
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
