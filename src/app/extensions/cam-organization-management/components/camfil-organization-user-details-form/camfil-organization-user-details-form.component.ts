// tslint:disable: ish-ordered-imports project-structure ban-specific-imports
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';
import { CreatePageDataSourceComponent } from '../../pages/create/create-page.data-source';

@Component({
  selector: 'camfil-organization-user-details-form',
  templateUrl: './camfil-organization-user-details-form.component.html',
  styleUrls: ['./camfil-organization-user-details-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilOrganizationUserDetailsFormComponent implements OnInit, OnDestroy {
  @Input() customer: CamfilB2bCustomer;
  @Input() user: CamfilB2bUser;

  @Output() changeUser = new EventEmitter<{ customer: CamfilB2bCustomer; user: CamfilB2bUser }>();
  @Output() changeUserActive = new EventEmitter<{ active: boolean }>();
  @Output() changeUserPassword = new EventEmitter();

  private destroy$ = new Subject();

  form: FormGroup;
  activeForm: FormGroup;

  isUserFormSubmitted = false;

  constructor(private fb: FormBuilder) {}

  get isUserFormSubmitButtonDisabled() {
    return this.form?.invalid && this.isUserFormSubmitted;
  }

  get isEditMode() {
    return !!(this.user?.hasOwnProperty('id') && this.user?.id);
  }

  private initUserForm() {
    this.form = this.fb.group({
      firstName: new FormControl(this.user?.firstName, {
        validators: [Validators.required, Validators.maxLength(60)],
      }),
      lastName: new FormControl(this.user?.lastName, {
        validators: [Validators.required, Validators.maxLength(60)],
      }),
      phoneHome: new FormControl(this.user?.phoneHome, {
        validators: [],
      }),
      email: new FormControl(this.user?.email, {
        validators: [SpecialValidators.email],
      }),
      login: new FormControl(
        {
          value: this.user?.login,
          disabled: this.isEditMode, // TODO (extMlk): [CAM-979] Field is disabled since BE does not support login changes.
        },
        {
          validators: [Validators.required, SpecialValidators.username],
        }
      ),
    });

    if (!this.isEditMode) {
      const emailControl = this.form.get('email');
      const loginControl = this.form.get('login');

      emailControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(email => {
        if (emailControl.valid && !loginControl.valid) {
          loginControl.setValue(CreatePageDataSourceComponent.createLogin(this.customer, { ...this.user, email }));
        }
      });
    }
  }

  private initUserActiveForm() {
    this.activeForm = this.fb.group({
      active: [!this.user?.active],
    });
  }

  ngOnInit() {
    this.initUserForm();
    this.initUserActiveForm();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleChangeUser() {
    if (!this.isEditMode && this.form.invalid) {
      this.isUserFormSubmitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const firstName = this.form.get('firstName').value;
    const lastName = this.form.get('lastName').value;
    const phoneHome = this.form.get('phoneHome').value;
    const email = this.form.get('email').value;
    const login = this.form.get('login').value;

    const customer = this.customer;
    const user = { ...this.user, firstName, lastName, phoneHome, email, login };

    this.changeUser.emit({ customer, user });
  }

  handleResetUserPassword() {
    const { customer, user } = this;

    this.changeUserPassword.emit({ customer, user });
  }

  handleToggleActiveFlag() {
    const active = !this.user?.active;

    this.changeUserActive.emit({ active });
  }
}
