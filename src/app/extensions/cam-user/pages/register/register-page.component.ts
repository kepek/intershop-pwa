import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { CamUserFacade } from '../../facades/cam-user.facade';
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

  constructor(private camUserFacade: CamUserFacade, private router: Router) {}

  ngOnInit() {
    this.applicantError$ = this.camUserFacade.applicantError$;
    this.applicantLoading$ = this.camUserFacade.applicantLoading$;
    this.applicant$ = this.camUserFacade.applicant$;
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onApply(applicant: Applicant) {
    this.camUserFacade.applyForAnAccount(applicant);
  }
}
