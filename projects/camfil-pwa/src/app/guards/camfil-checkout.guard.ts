import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { CamfilConfigurationService } from 'camfil-pwa/services/camfil-configuration/camfil-configuration.service';
import { Observable, of, race, timer } from 'rxjs';
import { mapTo, switchMap } from 'rxjs/operators';

import { AuthGuard } from 'ish-core/guards/auth.guard';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

@Injectable({ providedIn: 'root' })
export class CamfilCheckoutGuard extends AuthGuard implements CanActivate {
  constructor(
    protected store: Store,
    protected router: Router,
    @Inject(PLATFORM_ID) protected platformId: string,
    protected cookieService: CookiesService,
    protected camfilConfigurationService: CamfilConfigurationService
  ) {
    super(store, router, platformId, cookieService);
  }

  canActivate(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canCheckout(() => super.canActivate(snapshot, state));
  }

  canActivateChild(snapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.canCheckout(() => super.canActivateChild(snapshot, state));
  }

  private canCheckout(fn: () => {}): Observable<boolean | UrlTree> {
    return race(
      this.camfilConfigurationService.isEnabled('guestCheckout'),
      // timeout and forbid visiting page
      timer(4000).pipe(mapTo(false))
    ).pipe(
      switchMap(guestCheckout => {
        if (guestCheckout) {
          return of(guestCheckout);
        }

        return fn() as Observable<boolean | UrlTree>;
      })
    );
  }
}
