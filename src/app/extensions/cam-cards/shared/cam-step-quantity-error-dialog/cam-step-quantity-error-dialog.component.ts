import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'camfil-cam-step-quantity-error-dialog',
  templateUrl: './cam-step-quantity-error-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamStepQuantityErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CamStepQuantityErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public errorData: {
      stepQuantityValue: number;
    }
  ) {}

  hide() {
    this.dialogRef.close();
  }
}
