import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'camfil-checkout-receipt-create-camcard-dialog',
  templateUrl: './camfil-checkout-receipt-create-camcard-dialog.component.html',
})
export class CamfilCheckoutReceiptCreateCamCardDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string },
    private dialogRef: MatDialogRef<CamfilCheckoutReceiptCreateCamCardDialogComponent>
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
