import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketExtensionData } from 'ish-core/models/basket-extension/basket-extension.interface';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { ORDER_HEADER_VALIDATORS } from 'ish-shared/components/camfil-checkout-bucket/validators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'camfil-checkout-add-email-recipient-modal',
  templateUrl: './camfil-checkout-add-email-recipient-modal.component.html',
  styleUrls: ['./camfil-checkout-add-email-recipient-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutAddEmailRecipientModalComponent implements OnInit {
  recipientsForm: FormGroup;
  validators = ORDER_HEADER_VALIDATORS;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CamfilCheckoutAddEmailRecipientModalComponent>,
    private shoppingFacade: ShoppingFacade,
    @Inject(MAT_DIALOG_DATA) public bucket: Bucket
  ) {}

  ngOnInit() {
    this.initForm();
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

      const basketExtensionUpdate: BasketExtensionData = {
        ...this.bucket,
        emailRecipients: [...emailRecipients, ...addedEmailRecipients],
      };

      this.shoppingFacade.updateBucket(basket, deliveryAddressId, basketExtensionUpdate);
      this.hide();
    } else {
      markAsDirtyRecursive(this.recipientsForm);
    }
  }

  private initForm() {
    this.recipientsForm = this.fb.group({
      emailRecipients: ['', [Validators.required, SpecialValidators.commaSeparatedEmailValidator]],
    });
  }
}
