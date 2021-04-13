import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

@Component({
  selector: 'camfil-add-email-recipient-modal',
  templateUrl: './add-email-recipient-modal.component.html',
  styleUrls: ['./add-email-recipient-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddEmailRecipientModal implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(public dialogRef: MatDialogRef<AddEmailRecipientModal>) {}
  ngOnInit() {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  hide() {
    this.dialogRef.close()
  }
}
