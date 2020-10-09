import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { CamAccountFacade } from '../../facades/cam-account.facade';
import { Applicant } from '../../models/applicant/applicant.model';

@Component({
  selector: 'camfil-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterPageComponent implements OnInit {
  applicantError$: Observable<HttpError>;
  applicantLoading$: Observable<boolean>;
  applicant$: Observable<Applicant>;

  constructor(private camAccountFacade: CamAccountFacade, private router: Router) {}

  ngOnInit() {
    this.applicantError$ = this.camAccountFacade.applicantError$;
    this.applicantLoading$ = this.camAccountFacade.applicantLoading$;
    this.applicant$ = this.camAccountFacade.applicant$;
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onApply(applicant: Applicant) {
    this.camAccountFacade.applyForAnAccount(applicant);
  }
}
