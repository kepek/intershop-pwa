import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CheckoutFacade } from 'camfil-pwa/facades/checkout.facade';

import { Address } from 'ish-core/models/address/address.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'camfil-checkout-goods-acceptance-modal',
  templateUrl: './camfil-checkout-goods-acceptance-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutGoodsAcceptanceModalComponent implements OnInit {
  goodsAcceptanceTimeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CamfilCheckoutGoodsAcceptanceModalComponent>,
    private checkoutFacade: CheckoutFacade,
    @Inject(MAT_DIALOG_DATA) public bucketAddress: Address
  ) {}

  ngOnInit() {
    this.initForm();
  }

  hide() {
    this.dialogRef.close();
  }

  getField(name: string) {
    return this.goodsAcceptanceTimeForm.get(name);
  }

  submitEditGoodsAcceptanceTime(event) {
    if (this.goodsAcceptanceTimeForm.valid && event.type === 'submit') {
      const goodsAcceptanceNote = this.goodsAcceptanceTimeForm.get('goodsAcceptanceNote').value;
      const updatedBasketAddress = {
        ...this.bucketAddress,
        goodsAcceptanceNote,
      };

      this.checkoutFacade.updateBasketAddress(updatedBasketAddress, true);
      this.hide();
    } else {
      markAsDirtyRecursive(this.goodsAcceptanceTimeForm);
    }
  }

  private initForm() {
    this.goodsAcceptanceTimeForm = this.fb.group({
      goodsAcceptanceNote: ['', [Validators.required]],
    });
  }
}
