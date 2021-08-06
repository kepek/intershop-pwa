import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { CamAccountFacade } from '../../facades/cam-account.facade';
import { Applicant } from '../../models/applicant/applicant.model';

@Component({
  selector: 'camfil-register-page',
  templateUrl: './camfil-register-page.component.html',
  styleUrls: ['./camfil-register-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRegisterPageComponent implements OnInit {
  applicant$: Observable<Applicant>;
  applicantError$: Observable<HttpError>;
  applicantPreferredTitles$: Observable<string[]>;
  applicantLoading$: Observable<boolean>;

  constructor(private camAccountFacade: CamAccountFacade, private router: Router) {}

  ngOnInit() {
    this.applicant$ = this.camAccountFacade.applicant$;
    this.applicantError$ = this.camAccountFacade.applicantError$;
    this.applicantPreferredTitles$ = this.camAccountFacade.applicantPreferredTitles$;
    this.applicantLoading$ = this.camAccountFacade.applicantLoading$;
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onApply(applicant: Applicant) {
    this.camAccountFacade.applyForAnAccount(applicant);
  }
}
