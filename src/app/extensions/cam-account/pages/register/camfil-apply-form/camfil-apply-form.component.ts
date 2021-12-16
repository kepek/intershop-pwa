import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { Channel } from 'ish-core/models/channel/channel.types';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CamfilToastrService } from 'ish-core/store/core/messages/CamfilToastrService';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { Applicant } from '../../../models/applicant/applicant.model';

import { APPLY_VALIDATORS } from './validators';

@Component({
  selector: 'camfil-apply-form',
  templateUrl: './camfil-apply-form.component.html',
  styleUrls: ['./camfil-apply-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilApplyFormComponent implements OnInit {
  @Input() error: HttpError;
  @Input() preferredTitles: string[];

  @Output() apply = new EventEmitter<Applicant>();

  @ViewChild(CamfilSmallCtaModalComponent) errorModal: CamfilSmallCtaModalComponent;

  /** switch for business customer registration */
  businessCustomerRegistration: boolean;

  form: FormGroup;
  submitted = false;

  validators = APPLY_VALIDATORS;

  hideTitleField = false;

  constructor(
    private appFacade: AppFacade,
    private fb: FormBuilder,
    private featureToggle: FeatureToggleService,
    private translate: TranslateService,
    private toastr: CamfilToastrService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    // toggles business / private customer registration
    this.businessCustomerRegistration = this.featureToggle.enabled('businessCustomerRegistration');

    // Hide title field for FI channel
    this.appFacade.getChannel$?.pipe(whenTruthy(), take(1)).subscribe(channel => {
      if (channel === Channel.FI) {
        this.hideTitleField = true;
      }
    });

    this.createApplyForm();
  }

  private createApplyForm(): void {
    this.form = this.fb.group({
      title: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      phoneNumber: ['', [Validators.pattern('[0-9+-/]*')]],
      email: ['', [Validators.required, SpecialValidators.email]],
      customerName: ['', [Validators.required]],
      customerNo: '',
      comment: '',
      captcha: [''],
      gdpr: ['', [Validators.requiredTrue]],
      captchaAction: ['applyForAnAccount'],
    });

    // add form control(s) for business customers
    if (this.businessCustomerRegistration) {
      this.form.addControl('taxationID', new FormControl(''));
    }
  }

  private openErrorModal() {
    const refErrorModalDialog = this.dialog.open(this.errorModal?.show());
    this.errorModal.hide = () => {
      refErrorModalDialog.close();
    };
  }

  /**
   * Submits form and throws create event when form is valid
   */
  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      this.toastr.error(this.translate.instant('camfil.register.form.invalid.text'), '', { timeOut: 3000 });

      if (this?.form?.get('gdpr')?.invalid) {
        this.openErrorModal();
      }

      return;
    }

    const formValue = this.form.value;

    const registration = { ...formValue };

    registration.captcha = this.form.get('captcha').value;
    registration.captchaAction = this.form.get('captchaAction').value;

    this.apply.emit(registration);

    this.form.reset();
    this.form.clearValidators();
    this.form.clearAsyncValidators();
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
