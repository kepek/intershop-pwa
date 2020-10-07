import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'camfil-login-form',
  templateUrl: './camfil-login-form.component.html',
  styleUrls: ['./camfil-login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilLoginFormComponent implements OnInit {
  @Input() loginMessageKey: string;

  form: FormGroup;
  submitted = false;
  loginError$: Observable<HttpError>;

  constructor(fb: FormBuilder, private accountFacade: AccountFacade) {
    this.form = fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loginError$ = this.accountFacade.userError$;
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const formValue = this.form.value;
    const credentials: Credentials = { ...formValue };

    this.accountFacade.loginUser(credentials);
  }
}
