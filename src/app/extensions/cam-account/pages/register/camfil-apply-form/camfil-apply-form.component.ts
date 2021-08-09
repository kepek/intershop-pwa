import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CamfilToastrService } from 'ish-core/store/core/messages/CamfilToastrService';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { Applicant } from '../../../models/applicant/applicant.model';

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

  /** switch for business customer registration */
  businessCustomerRegistration: boolean;

  form: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private featureToggle: FeatureToggleService,
    private translate: TranslateService,
    private toastr: CamfilToastrService
  ) {}

  ngOnInit() {
    // toggles business / private customer registration
    this.businessCustomerRegistration = this.featureToggle.enabled('businessCustomerRegistration');

    this.createApplyForm();
  }

  private createApplyForm(): void {
    this.form = this.fb.group({
      title: [''],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      street: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      phoneNumber: ['', [Validators.pattern('[0-9+-/]*')]],
      email: ['', [Validators.required, SpecialValidators.email]],
      customerName: ['', [Validators.required]],
      customerNo: '',
      comment: '',
      captcha: [''],
      gdpr: ['', [Validators.required]],
      captchaAction: ['applyForAnAccount'],
    });

    // add form control(s) for business customers
    if (this.businessCustomerRegistration) {
      this.form.addControl('taxationID', new FormControl(''));
    }
  }

  /**
   * Submits form and throws create event when form is valid
   */
  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      this.toastr.error(this.translate.instant('camfil.register.form.invalid.text'), '', { timeOut: 3000 });

      return;
    }

    const formValue = this.form.value;

    const registration = { ...formValue };

    registration.captcha = this.form.get('captcha').value;
    registration.captchaAction = this.form.get('captchaAction').value;

    delete registration.gdpr;

    this.apply.emit(registration);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
