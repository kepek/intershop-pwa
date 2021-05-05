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
  selectedUser: string;
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
    if (this.camCard?.customer) {
      const { id } = this.camCard.customer;
      this.camCardsFacade.loadContactsByCustomer(id);
      this.allContacts$ = this.camCardsFacade.contactsByCustomer$(id);
    }

    // determine which radio button is preselected
    if (this.camCard?.contacts?.length) {
      this.selectedUser = 'single';
    } else {
      this.selectedUser = 'all';
    }

    this.initForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    const currentContacts = this.camCard.contacts?.map(({ profileId }) => profileId);
    this.accessForm = this.fb.group({
      user: ['', [Validators.required]],
      contact: [currentContacts],
    });
  }

  submit() {
    if (this.accessForm.valid) {
      const camCardContacts: CamCardContact[] = this.isUserSingle()
        ? this.accessForm.get('contact').value.map((item: string) => ({ profileId: item }))
        : [];

      this.camCardsFacade.updateCamCardContacts(this.camCard.id, camCardContacts);
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
