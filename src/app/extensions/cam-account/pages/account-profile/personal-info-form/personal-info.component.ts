import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'camfil-account-personal-info-form',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss', '../account-profile/account-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  user$: Observable<User>;
  user: User;
  userLoading$: Observable<boolean>;

  form: FormGroup;
  submitted = false;

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.userLoading$ = this.accountFacade.userLoading$;

    this.user$.pipe(takeUntil(this.destroy$)).subscribe(user => (this.user = user));

    this.form = new FormGroup({
      firstName: new FormControl(this.user.firstName, [Validators.required, SpecialValidators.noSpecialChars]),
      lastName: new FormControl(this.user.lastName, [Validators.required, SpecialValidators.noSpecialChars]),
      phoneNumber: new FormControl(this.user.phoneHome, []),
      email: new FormControl(this.user.email, [Validators.required, SpecialValidators.email]),
    });
  }

  validate() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }
  }

  updateUserEmail() {
    const { email } = this.form.value;
    const updatedUser = { ...this.user, email };

    this.validate();

    this.accountFacade.updateUserEmail(updatedUser);
  }

  updateUserProfile() {
    const { firstName, lastName, phoneHome } = this.form.value;
    const updatedUser = { ...this.user, firstName, lastName, phoneHome };

    this.validate();

    this.accountFacade.updateUserProfile(updatedUser);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
