import { ChangeDetectionStrategy, Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'camfil-ie-modal',
  templateUrl: './camfil-ie-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilIEModalComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data,
    private dialogRef: MatDialogRef<CamfilIEModalComponent>
  ) {}

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;
  modalText: string;

  ngOnInit() {
    this.modalText = this.data?.modalText;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
