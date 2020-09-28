import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

@Component({
  selector: 'ish-account-page',
  templateUrl: './account-page.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class AccountPageComponent implements OnInit {
  deviceType$: Observable<DeviceType>;
  url: string;

  constructor(private appFacade: AppFacade, private router: Router) {}

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
  }
  get _router(): Router {
    return this.router;
  }
  set _router(value: Router) {
    this.router = value;
  }
}
