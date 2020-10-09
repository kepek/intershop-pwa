import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'camfil-apply-form',
  templateUrl: './apply-form.component.html',
  styleUrls: ['./apply-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplyFormComponent implements OnInit {
  @Input() error: HttpError;

  @Output() apply = new EventEmitter<CustomerRegistrationType>();

  /** switch for business customer registration */
  businessCustomerRegistration: boolean;

  form: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private featureToggle: FeatureToggleService) {}

  ngOnInit() {
    // toggles business / private customer registration
    this.businessCustomerRegistration = this.featureToggle.enabled('businessCustomerRegistration');

    this.createApplyForm();
  }

  private createApplyForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, SpecialValidators.email]],
      customerName: ['', [Validators.required]],
      customerNo: '',
      comment: '',
      captcha: [''],
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
      return;
    }

    const formValue = this.form.value;

    const registration = { ...formValue };

    registration.captcha = this.form.get('captcha').value;
    registration.captchaAction = this.form.get('captchaAction').value;

    this.apply.emit(registration);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
