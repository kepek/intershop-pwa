import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { markAsDirtyRecursive } from 'src/app/shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard, CamCardContact, CamCardCustomer } from '../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-move-cam-card-dialog',
  templateUrl: './move-cam-card-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveCamCardDialogComponent implements OnInit, OnDestroy {
  @Input() camCards: CamCard[];
  moveForm: FormGroup;
  customers$: Observable<CamCardCustomer[]>;
  contacts: CamCardContact[];
  selectCustomer = '';
  selectAllContacts: boolean;

  private destroy$ = new Subject<void>();

  constructor(
    private camCardsFacade: CamCardsFacade,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MoveCamCardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public selectedCamCard: CamCard[]
  ) {}

  ngOnInit() {
    this.customers$ = this.camCardsFacade.customers$;
    this.initForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm() {
    this.moveForm = this.fb.group({
      customers: ['', [Validators.required]],
      contacts: ['', [Validators.required]],
    });
  }

  submitMoveCamCardForm(event) {
    if (this.moveForm.valid && event.type === 'submit') {
      const newCustomer = this.moveForm.get('customers').value;
      const newContacts = this.selectAllContacts ? [] : this.moveForm.get('contacts').value;
      const camCardContacts = { elements: newContacts };
      this.selectedCamCard.forEach(({ id }: CamCard) => {
        this.camCardsFacade.moveCamCard(id, newCustomer, camCardContacts);
      });
      this.dialogRef.close();
    } else {
      markAsDirtyRecursive(this.moveForm);
    }
  }

  handleCustomers(event) {
    this.camCardsFacade.loadContactsByCustomer(event.value);
    this.camCardsFacade
      .contactsByCustomer$(event.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((contacts: CamCardContact[]) => (this.contacts = contacts));
  }

  handleContacts(event) {
    this.selectAllContacts = event.value[0] === 'all';
  }
}
