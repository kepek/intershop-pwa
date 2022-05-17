import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'camfil-quotes-reject-dialog',
  templateUrl: './quotes-reject-dialog.component.html',
  styleUrls: ['./quotes-reject-dialog.component.scss'],
})
export class QuotesRejectDialogComponent implements OnInit {
  @Input() reason: string;
  @Output() onChange = new EventEmitter<{ reason: string }>();
  @Output() onConfirm = new EventEmitter<{ reason: string }>();
  form: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { title: string },
    private dialogRef: MatDialogRef<QuotesRejectDialogComponent>,
    private readonly builder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.builder.group({
      reason: [this.reason, Validators.required],
    });
    this.form.valueChanges.subscribe(value => this.onChange.emit(value));
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
