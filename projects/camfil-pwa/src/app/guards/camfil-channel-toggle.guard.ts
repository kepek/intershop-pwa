import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CamfilConfigurationService } from 'camfil-pwa/services/camfil-configuration/camfil-configuration.service';
import { Observable, race, timer } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

@Injectable({ providedIn: 'root' })
export class CamfilChannelToggleGuard implements CanActivate {
  constructor(
    private camfilConfigurationService: CamfilConfigurationService,
    private router: Router,
    private httpStatusCodeService: HttpStatusCodeService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Observable<boolean | UrlTree> {
    return race(
      this.camfilConfigurationService.isEnabled(route.data.channelSetting),
      // timeout and forbid visiting page
      timer(4000).pipe(mapTo(false))
    ).pipe(
      map(enabled => {
        if (!enabled) {
          this.httpStatusCodeService.setStatus(404);
          return this.router.parseUrl('/error');
        }
        return true;
      })
    );
  }
}
