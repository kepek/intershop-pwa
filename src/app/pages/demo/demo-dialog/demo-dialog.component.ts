import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DemoDialogData } from 'ish-core/models/demo/demo.model';

@Component({
  selector: 'camfil-demo-dialog',
  templateUrl: './demo-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DemoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DemoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DemoDialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
