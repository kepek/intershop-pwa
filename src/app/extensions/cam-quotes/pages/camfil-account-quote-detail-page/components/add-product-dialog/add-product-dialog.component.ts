import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { ProductSkuExistValidator } from '../../validators/product-sku-exist.validator';

class InstantErrorStateMatcher implements ErrorStateMatcher {
  // tslint:disable-next-line:variable-name
  isErrorState(control: FormControl | null, _form: FormGroupDirective | NgForm | null): boolean {
    return control.dirty && control.invalid;
  }
}

@Component({
  selector: 'camfil-add-product-dialog',
  templateUrl: './add-product-dialog.component.html',
  styleUrls: ['./add-product-dialog.component.scss'],
})
export class AddProductDialogComponent implements OnInit, OnDestroy {
  form: FormGroup;
  product: ProductView;

  instantErrorMatcher: ErrorStateMatcher;

  private destroy$ = new Subject<boolean>();

  constructor(
    private dialogRef: MatDialogRef<AddProductDialogComponent>,
    private fb: FormBuilder,
    private skuValidator: ProductSkuExistValidator
  ) {
    this.form = this.fb.group({
      productSKU: this.fb.control('', {
        validators: [Validators.required],
        asyncValidators: [this.skuValidator.validate.bind(this.skuValidator)],
        updateOn: 'change',
      }),
      boxLabel: '',
      quantity: [1, Validators.min(1)],
    });

    this.instantErrorMatcher = new InstantErrorStateMatcher();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  hide() {
    this.dialogRef.close();
  }

  submit() {
    const data = {
      name: '???',
      quantity: {
        name: '???',
        value: this.form.value.quantity,
        unit: 'PIEC',
      },
      productSKU: this.form.value.productSKU,
    };
    this.dialogRef.close(data);
  }
}
