import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { markAsDirtyRecursive } from 'src/app/shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard, CamCardContact } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-user-access-cam-card-dialog',
  templateUrl: './user-access-cam-card-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserAccessCamCardDialogComponent implements OnInit, OnDestroy {
  accessForm: FormGroup;
  allContacts$: Observable<CamCardContact[]>;
  users: string[] = ['all', 'single'];
  validators = {
    user: [
      {
        error: 'required',
        message: 'camfil.account.cam_card.access_user.dialog.error.user.default',
      },
    ],
    contact: [
      {
        error: 'required',
        message: 'camfil.account.cam_card.access_user.dialog.error.contact.default',
      },
    ],
  };
  private destroy$ = new Subject<void>();

  constructor(
    private camCardsFacade: CamCardsFacade,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<UserAccessCamCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public camCard: CamCard
  ) {}

  ngOnInit() {
    this.camCardsFacade.loadContactsByCustomer(this.camCard.customer.id);
    this.allContacts$ = this.camCardsFacade.contactsByCustomer$(this.camCard.customer.id);
    this.initForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.accessForm = this.fb.group({
      user: ['', [Validators.required]],
      contact: [this.camCard.contacts],
    });
  }

  submit() {
    if (this.accessForm.valid) {
      const contacts: CamCardContact[] = [];
      if (this.isUserSingle()) {
        this.accessForm.get('contact').value.map((item: string) => {
          contacts.push({ profileId: item });
        });
      }
      this.camCardsFacade.updateCamCardContacts(this.camCard.id, contacts);
      this.dialogRef.close();
    } else {
      markAsDirtyRecursive(this.accessForm);
    }
  }

  getField(name: string) {
    return this.accessForm.get(name);
  }

  isUserSingle() {
    return this.accessForm.get('user').value === 'single';
  }
}
