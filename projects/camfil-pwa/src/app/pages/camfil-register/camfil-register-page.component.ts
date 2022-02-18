import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CamfilPwaFacade } from 'camfil-pwa/facades/camfil-pwa.facade';
import { CamfilApplicant } from 'camfil-pwa/models/camfil-applicant/camfil-applicant.model';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'camfil-register-page',
  templateUrl: './camfil-register-page.component.html',
  styleUrls: ['./camfil-register-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRegisterPageComponent implements OnInit {
  applicant$: Observable<CamfilApplicant>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  preferredTitles$: Observable<string[]>;

  constructor(private camfilAccountFacade: CamfilPwaFacade, private router: Router) {}

  ngOnInit() {
    this.applicant$ = this.camfilAccountFacade.applicant$;
    this.error$ = this.camfilAccountFacade.error$;
    this.loading$ = this.camfilAccountFacade.loading$;
    this.preferredTitles$ = this.camfilAccountFacade.preferredTitles$;
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onApply(applicant: CamfilApplicant) {
    this.camfilAccountFacade.applyForAnAccount(applicant);
  }
}
