import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { AuthGuard } from 'ish-core/guards/auth.guard';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';

import { ConfigurationService } from '../services/configuration/configuration.service';

@Injectable({ providedIn: 'root' })
export class CheckoutGuard extends AuthGuard implements CanActivate {
  constructor(
    protected store: Store,
    protected router: Router,
    @Inject(PLATFORM_ID) protected platformId: string,
    protected cookieService: CookiesService,
    private configurationService: ConfigurationService
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
    return this.configurationService.isEnabled('guestCheckout').pipe(
      switchMap(guestCheckoutEnabled => {
        if (guestCheckoutEnabled) {
          return of(guestCheckoutEnabled);
        }

        return fn() as Observable<boolean | UrlTree>;
      })
    );
  }
}
