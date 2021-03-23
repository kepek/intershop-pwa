import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'camfil-error-page',
  templateUrl: './camfil-error-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilErrorPageComponent implements OnInit {
  error$: Observable<HttpError>;
  type$: Observable<string>;

  constructor(private appFacade: AppFacade) {}

  ngOnInit() {
    this.error$ = this.appFacade.generalError$;
    this.type$ = this.appFacade.generalErrorType$;
  }
}
