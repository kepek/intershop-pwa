import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

@Component({
  selector: 'camfil-login-form',
  templateUrl: './camfil-login-form.component.html',
  styleUrls: ['./camfil-login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilLoginFormComponent implements OnInit, OnDestroy {
  @Input() loginMessageKey: string;

  form: FormGroup;
  submitted = false;
  loginError$: Observable<HttpError>;

  private destroy$ = new Subject();

  constructor(
    fb: FormBuilder,
    private accountFacade: AccountFacade,
    private activatedRoute: ActivatedRoute,
    private apiTokenService: ApiTokenService
  ) {
    this.form = fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.loginError$ = this.accountFacade.userError$;

    /* Login via URL parameters */
    this.activatedRoute.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      let token: string = params['access-token'];
      // token is not encoded by ICM URL, so we need to reinsert '+'
      token = token?.split(' ')?.join('+');

      const erpEmployeeId = params?.ERPEmployeeID;
      if (erpEmployeeId) {
        localStorage.setItem('erpEmployeeId', erpEmployeeId);
      }

      if (token) {
        this.apiTokenService.removeApiToken();
        this.accountFacade.loginUserWithToken(token);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
