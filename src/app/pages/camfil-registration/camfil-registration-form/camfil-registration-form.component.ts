import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { CamfilCustomerRegistrationType } from 'ish-core/models/camfil-customer/camfil-customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'camfil-registration-form',
  templateUrl: './camfil-registration-form.component.html',
  styleUrls: ['./camfil-registration-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRegistrationFormComponent implements OnInit {
  @Input() error: HttpError;

  @Output() create = new EventEmitter<CamfilCustomerRegistrationType>();

  /** switch for business customer registration */
  businessCustomerRegistration: boolean;

  form: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder, private featureToggle: FeatureToggleService) {}

  ngOnInit() {
    // toggles business / private customer registration
    this.businessCustomerRegistration = this.featureToggle.enabled('businessCustomerRegistration');

    this.createRegistrationForm();
  }

  private createRegistrationForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, SpecialValidators.email]],
      customerName: ['', [Validators.required]],
      customerNo: '',
      comment: '',
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

    console.log('formValue', formValue);

    const registration = { ...formValue };

    this.create.emit(registration);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
