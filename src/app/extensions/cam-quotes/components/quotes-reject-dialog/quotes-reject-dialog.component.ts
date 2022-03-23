import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'camfil-quotes-reject-dialog',
  templateUrl: './quotes-reject-dialog.component.html',
  styleUrls: ['./quotes-reject-dialog.component.scss']
})
export class QuotesRejectDialogComponent implements OnInit {

  @Output() onConfirm = new EventEmitter<{ reason: string }>();
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string },
    private dialogRef: MatDialogRef<QuotesRejectDialogComponent>,
    private readonly builder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.form = this.builder.group({
      reason: ['', Validators.required]
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }

  confirm(): void {
    if (!this.form.valid) {
      return;
    }
    this.dialogRef.close(true);
    this.onConfirm.emit(this.form.value);
  }
}
