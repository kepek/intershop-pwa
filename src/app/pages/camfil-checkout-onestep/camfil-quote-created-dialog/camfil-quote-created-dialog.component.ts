import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'camfil-quote-created-dialog',
  templateUrl: './camfil-quote-created-dialog.component.html',
})
export class CamfilQuoteCreatedDialogComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string },
    private dialogRef: MatDialogRef<CamfilQuoteCreatedDialogComponent>
  ) {}

  ngOnInit(): void {}

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    this.dialogRef.close(true);
  }
}
