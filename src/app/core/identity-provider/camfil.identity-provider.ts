import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, race, throwError } from 'rxjs';
import { catchError, concatMap, delay, first, switchMap, take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { IdentityProvider } from 'ish-core/identity-provider/identity-provider.interface';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { whenTruthy } from 'ish-core/utils/operators';

import { ICMIdentityProvider } from './icm.identity-provider';

export enum CamfilIdentityParams {
  AccessToken = 'access-token',
  ERPEmployeeID = 'ERPEmployeeID',
  ReturnUrl = 'returnUrl',
}

@Injectable({ providedIn: 'root' })
export class CAMFILIdentityProvider extends ICMIdentityProvider implements IdentityProvider {
  constructor(
    protected router: Router,
    protected store: Store,
    protected apiTokenService: ApiTokenService,
    private accountFacade: AccountFacade
  ) {
    super(router, store, apiTokenService);
  }

  triggerLogin(route: ActivatedRouteSnapshot) {
    let accessToken = route.queryParamMap.get(CamfilIdentityParams.AccessToken);
    // token is not encoded by ICM URL, so we need to reinsert '+'
    accessToken = decodeURIComponent(accessToken?.replace(/\s/g, '+'));

    let hasAccessToken = route.queryParamMap.has(CamfilIdentityParams.AccessToken);
    hasAccessToken = hasAccessToken && accessToken !== 'null';

    const erpEmployeeId = decodeURIComponent(route.queryParamMap.get(CamfilIdentityParams.ERPEmployeeID));
    let hasErpEmployeeId = route.queryParamMap.has(CamfilIdentityParams.ERPEmployeeID);
    hasErpEmployeeId = hasErpEmployeeId && erpEmployeeId !== 'null';

    const returnUrl = route?.queryParamMap?.get(CamfilIdentityParams.ReturnUrl) || '/home';

    // check for required start parameters before doing anything
    if (!hasAccessToken) {
      return true;
    }

    // initiate the user login with the access-token (cXML)
    if (hasAccessToken) {
      this.router.navigateByUrl('/loading', { replaceUrl: false, skipLocationChange: true });
      this.apiTokenService.removeApiToken();
      this.accountFacade.loginUserWithToken(accessToken);
    }

    if (hasErpEmployeeId) {
      window.localStorage.setItem(CamfilIdentityParams.ERPEmployeeID, erpEmployeeId);
    }

    return race(
      // throw an error if a user login error occurs
      this.accountFacade.userError$.pipe(
        whenTruthy(),
        take(1),
        // tslint:disable-next-line: no-unnecessary-callback-wrapper
        concatMap(userError => throwError(userError))
      ),

      // handle anything once the camfil user is logged in
      this.accountFacade.isLoggedIn$.pipe(
        whenTruthy(),
        take(1),
        switchMap(() => of(this.router.parseUrl(returnUrl))),
        // camfil error after successful authentication (needs to logout)
        catchError(error =>
          this.accountFacade.userLoading$.pipe(
            first(loading => !loading),
            delay(0),
            switchMap(() => {
              this.accountFacade.logoutUser();
              this.apiTokenService.removeApiToken();
              console.error(error);
              return of(this.router.parseUrl('/error'));
            })
          )
        )
      )
    ).pipe(
      // general error handling (parameter missing, authentication error)
      catchError(error => {
        console.error(error);
        return of(this.router.parseUrl('/error'));
      })
    );
  }

  triggerLogout(): Observable<UrlTree> {
    window.localStorage.removeItem(CamfilIdentityParams.ERPEmployeeID);

    return super.triggerLogout();
  }
}
