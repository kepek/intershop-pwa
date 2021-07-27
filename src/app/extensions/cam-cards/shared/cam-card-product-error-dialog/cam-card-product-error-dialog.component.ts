import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'camfil-cam-card-product-error-dialog',
  templateUrl: './cam-card-product-error-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddingErrorDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ProductAddingErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public errorData: {
      errorMessage: string;
      camCardName: string;
    }
  ) {}

  ngOnInit() {}

  hide() {
    this.dialogRef.close();
  }
}
