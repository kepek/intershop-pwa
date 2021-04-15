import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketExtensions } from 'ish-core/models/basket/basket.interface';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { Subject } from 'rxjs';

import { ORDER_HEADER_VALIDATORS } from '../camfil-checkout-list/validators';

@Component({
  selector: 'camfil-add-email-recipient-modal',
  templateUrl: './add-email-recipient-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmailRecipientModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
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
      emailRecipients: ['', [Validators.required, this.commaSeparatedEmailValidator]],
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

      const basketExtensionUpdate: BasketExtensions = {
        ...this.bucket,
        emailRecipients: addedEmailRecipients,
      };

      this.shoppingFacade.updateBucket(basket, deliveryAddressId, basketExtensionUpdate);
      this.hide();
    } else {
      markAsDirtyRecursive(this.recipientsForm);
    }
  }

  commaSeparatedEmailValidator = (control: AbstractControl): { [key: string]: any } | undefined => {
    const emails = control.value.split(',').map(e => e.trim());
    const forbidden = emails.some(email => Validators.email(new FormControl(email)));
    return forbidden ? { toAddress: { value: control.value } } : undefined;
  };
}
