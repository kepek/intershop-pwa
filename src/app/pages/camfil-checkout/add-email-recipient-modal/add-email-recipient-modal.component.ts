import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketExtensions } from 'ish-core/models/basket/basket.interface';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { ORDER_HEADER_VALIDATORS } from '../camfil-checkout-list/validators';

@Component({
  selector: 'camfil-add-email-recipient-modal',
  templateUrl: './add-email-recipient-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmailRecipientModalComponent implements OnInit {
  recipientsForm: FormGroup;
  validators = ORDER_HEADER_VALIDATORS;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEmailRecipientModalComponent>,
    private shoppingFacade: ShoppingFacade,
    @Inject(MAT_DIALOG_DATA) public bucket: Bucket
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.recipientsForm = this.fb.group({
      emailRecipients: ['', [Validators.required, SpecialValidators.commaSeparatedEmailValidator]],
    });
  }

  hide() {
    this.dialogRef.close();
  }

  getField(name: string) {
    return this.recipientsForm.get(name);
  }

  submitAddEmailRecipientForm(event) {
    if (this.recipientsForm.valid && event.type === 'submit') {
      const addedEmailRecipients = this.recipientsForm.get('emailRecipients').value.split(',');
      const { basket, deliveryAddressId } = this.bucket;

      const emailRecipients = this.bucket?.emailRecipients || [];

      const basketExtensionUpdate: BasketExtensions = {
        ...this.bucket,
        emailRecipients: [...emailRecipients, ...addedEmailRecipients],
      };


      this.shoppingFacade.updateBucket(basket, deliveryAddressId, basketExtensionUpdate);
      this.hide();
    } else {
      markAsDirtyRecursive(this.recipientsForm);
    }
  }
}
