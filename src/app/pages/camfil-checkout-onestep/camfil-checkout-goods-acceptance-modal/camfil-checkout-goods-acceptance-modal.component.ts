import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketExtensionData } from 'ish-core/models/basket-extension/basket-extension.interface';
import { Bucket } from 'ish-core/models/bucket/bucket.model';

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
    return this.goodsAcceptanceTimeForm.get(name);
  }

  submitEditGoodsAcceptanceTime(event) {
    if (this.goodsAcceptanceTimeForm.valid && event.type === 'submit') {
      const goodsAcceptanceNote = this.goodsAcceptanceTimeForm.get('goodsAcceptanceNote').value;
      const { basket, deliveryAddressId } = this.bucket;

      const basketExtensionUpdate: BasketExtensionData = {
        ...this.bucket,
        goodsAcceptanceNote,
      };

      this.shoppingFacade.updateBucket(basket, deliveryAddressId, basketExtensionUpdate);
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
