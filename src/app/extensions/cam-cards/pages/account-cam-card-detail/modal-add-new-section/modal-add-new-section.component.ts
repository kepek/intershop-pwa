import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCardAddress, CamCardCustomer } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-modal-add-new-section',
  templateUrl: './modal-add-new-section.component.html',
  styleUrls: ['./modal-add-new-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAddNewSectionComponent implements OnInit, OnDestroy {
  @Input() events: Observable<void>;

  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  rootCamCardId: string;
  rootCamCardAddress: CamCardAddress;
  rootCamCardCustomer: CamCardCustomer;
  newSegmentForm: FormGroup;
  newSegmentValidator = [
    {
      error: 'required',
      message: 'camfil.modal.addToCamcard.camcard.new_segment.error.required',
    },
    {
      error: 'maxlength',
      message: 'camfil.modal.addToCamcard.camcard.new_segment.error.maxLength',
    },
  ];

  private destroy$ = new Subject<void>();

  constructor(public dialog: MatDialog, private fb: FormBuilder, private camCardsFacade: CamCardsFacade) {}

  ngOnInit() {
    this.events.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.openModal();
    });

    this.newSegmentForm = this.fb.group({
      newCamCard: ['', [Validators.required, Validators.maxLength(30)]],
    });

    this.camCardsFacade.currentCamCard$.pipe(takeUntil(this.destroy$)).subscribe(camCard => {
      if (camCard) {
        this.rootCamCardId = camCard.id;
        this.rootCamCardAddress = camCard.deliveryAddress;
        this.rootCamCardCustomer = camCard.customer;
      }
    });
  }

  openModal() {
    const dialogRef = this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();

    dialogRef
      .afterClosed()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        this.newSegmentForm.reset();
      });
  }

  submitForm() {
    if (this.newSegmentForm.valid) {
      const newSegmentValue = this.newSegmentForm.get('newCamCard').value;
      const newSubCamCard = {
        name: newSegmentValue,
        deliveryAddress: this.rootCamCardAddress,
        customer: this.rootCamCardCustomer,
      };

      this.camCardsFacade.createSubCamCard(newSubCamCard, this.rootCamCardId);
      this.newSegmentForm.reset();
      this.modal.hide();
    } else {
      markAsDirtyRecursive(this.newSegmentForm);
    }
  }

  ngOnDestroy() {
    this.newSegmentForm.reset();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
